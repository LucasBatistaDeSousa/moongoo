import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from './schemas/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const createdCustomer = new this.customerModel(createCustomerDto);
    return createdCustomer.save();
  }

  async findAll(): Promise<Customer[]> {
    return this.customerModel.find().exec();
  }

  async findById(id: string): Promise<Customer> {
    const customer = await this.customerModel.findById(id).exec();
    if (!customer) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
    return customer;
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

  async getStats(): Promise<any> {
    const totalClientes = await this.customerModel.countDocuments().exec();

    const stats = {
      totalClientes,
      mongosConexao: 'mongodb://localhost:27021',
      shardKey: 'cpf',
      status: 'Cluster Sharded funcionando',
      distribuicaoPorShard: {
        nota: 'Para ver distribuição real, execute: docker exec mongos mongosh --eval "use admin; sh.status()"',
        estimado: {
          shard1: Math.ceil(totalClientes / 3),
          shard2: Math.floor(totalClientes / 3),
          shard3: Math.floor(totalClientes / 3),
        },
      },
      shards: [
        {
          id: 'rs0',
          nome: 'Shard 1',
          host: 'shard1:27017',
          porta: 27017,
        },
        {
          id: 'rs1',
          nome: 'Shard 2',
          host: 'shard2:27017',
          porta: 27018,
        },
        {
          id: 'rs2',
          nome: 'Shard 3',
          host: 'shard3:27017',
          porta: 27019,
        },
      ],
      configServer: {
        id: 'configrs',
        host: 'config:27017',
        porta: 27020,
      },
      mongosRouter: {
        host: 'mongos:27017',
        porta: 27021,
      },
    };

    return stats;
  }
}
