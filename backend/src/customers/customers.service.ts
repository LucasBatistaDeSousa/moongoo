import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Customer } from './schemas/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    @InjectConnection() private connection: Connection,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<any> {
    const createdCustomer = new this.customerModel(createCustomerDto);
    const saved = await createdCustomer.save();
    return {
      ...saved.toObject(),
      shard: await this.getShardForCpf(createCustomerDto.cpf),
    };
  }

  private async getShardForCpf(cpf: string): Promise<string> {
    try {
      const client = this.connection.getClient();
      const configDb = client.db('config');
      const chunks = await configDb
        .collection('chunks')
        .find({ ns: 'customers.customers' })
        .sort({ 'min.cpf': 1 })
        .toArray();

      if (!chunks || chunks.length === 0) {
        return 'rs0';
      }

      const cpfNum = parseInt(cpf.replace(/\D/g, ''), 10);

      for (const chunk of chunks) {
        const min = chunk.min?.cpf;
        const max = chunk.max?.cpf;

        if (min !== undefined && max !== undefined) {
          if (typeof min === 'number' && typeof max === 'number') {
            if (cpfNum >= min && cpfNum < max) {
              return chunk.shard;
            }
          }
        }
      }

      const lastShard = chunks[chunks.length - 1]?.shard;
      return lastShard || 'rs0';
    } catch (error) {
      return 'rs0';
    }
  }

  async findAll(): Promise<any[]> {
    const customers = await this.customerModel.find().exec();
    return Promise.all(
      customers.map(async (customer) => ({
        ...customer.toObject(),
        shard: await this.getShardForCpf(customer.cpf),
      })),
    );
  }

  async findById(id: string): Promise<any> {
    const customer = await this.customerModel.findById(id).exec();
    if (!customer) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
    return {
      ...customer.toObject(),
      shard: await this.getShardForCpf(customer.cpf),
    };
  }

  async update(
    id: string,
    updateCustomerDto: Partial<CreateCustomerDto>,
  ): Promise<any> {
    const updatedCustomer = await this.customerModel
      .findByIdAndUpdate(id, updateCustomerDto, { new: true })
      .exec();

    if (!updatedCustomer) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    return {
      ...updatedCustomer.toObject(),
      shard: updateCustomerDto.cpf
        ? await this.getShardForCpf(updateCustomerDto.cpf)
        : await this.getShardForCpf(updatedCustomer.cpf),
    };
  }

  async delete(id: string): Promise<void> {
    const result = await this.customerModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
  }

  async debugSharding(): Promise<any> {
    try {
      const client = this.connection.getClient();
      const configDb = client.db('config');

      const chunks = await configDb
        .collection('chunks')
        .find({ ns: 'customers.customers' })
        .toArray();

      return {
        chunks: chunks.map((c) => ({
          min: c.min,
          max: c.max,
          shard: c.shard,
        })),
        totalChunks: chunks.length,
      };
    } catch (error) {
      return { error: String(error) };
    }
  }
}
