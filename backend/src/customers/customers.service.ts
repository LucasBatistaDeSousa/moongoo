import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Customer } from './schemas/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    private connection: Connection,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const createdCustomer = new this.customerModel(createCustomerDto);
    return createdCustomer.save();
  }

  private async getShardForCpf(cpf: string): Promise<string> {
    try {
      const db = this.connection.db;
      const configDb = this.connection.client.db('config');
      const chunks = await configDb.collection('chunks').find({
        ns: 'customers.customers',
      }).toArray();

      for (const chunk of chunks) {
        const min = chunk.min?.cpf;
        const max = chunk.max?.cpf;

        if (min !== undefined && max !== undefined) {
          if (cpf >= min && cpf < max) {
            return chunk.shard;
          }
        } else if (min !== undefined && cpf >= min) {
          return chunk.shard;
        } else if (max !== undefined && cpf < max) {
          return chunk.shard;
        }
      }
      return 'unknown';
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
