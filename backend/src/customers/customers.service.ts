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

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const createdCustomer = new this.customerModel(createCustomerDto);
    return createdCustomer.save();
  }

  private async getShardForCpf(cpf: string): Promise<string> {
    try {
      const client = this.connection.getClient();
      const configDb = client.db('config');
      const chunks = await configDb.collection('chunks').find({
        ns: 'customers.customers',
      }).toArray();

      if (chunks.length === 0) {
        return 'unknown';
      }

      const cpfNum = parseInt(cpf.replace(/\D/g, ''), 10);

      for (const chunk of chunks) {
        const min = chunk.min?.cpf;
        const max = chunk.max?.cpf;

        if (typeof min === 'number' && typeof max === 'number') {
          if (cpfNum >= min && cpfNum < max) {
            return chunk.shard || 'unknown';
          }
        }
      }

      return chunks[0]?.shard || 'unknown';
    } catch (error) {
      return 'unknown';
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
  ): Promise<Customer> {
    const updatedCustomer = await this.customerModel
      .findByIdAndUpdate(id, updateCustomerDto, { new: true })
      .exec();

    if (!updatedCustomer) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    return updatedCustomer;
  }

  async delete(id: string): Promise<void> {
    const result = await this.customerModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
  }
}
