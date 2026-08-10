"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const mongoose_3 = require("mongoose");
const customer_schema_1 = require("./schemas/customer.schema");
let CustomersService = class CustomersService {
    constructor(customerModel, connection) {
        this.customerModel = customerModel;
        this.connection = connection;
    }
    async create(createCustomerDto) {
        const createdCustomer = new this.customerModel(createCustomerDto);
        const saved = await createdCustomer.save();
        return {
            ...saved.toObject(),
            shard: await this.getShardForCpf(createCustomerDto.cpf),
        };
    }
    async getShardForCpf(cpf) {
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
        }
        catch (error) {
            return 'rs0';
        }
    }
    async findAll() {
        const customers = await this.customerModel.find().exec();
        return Promise.all(customers.map(async (customer) => ({
            ...customer.toObject(),
            shard: await this.getShardForCpf(customer.cpf),
        })));
    }
    async findById(id) {
        const customer = await this.customerModel.findById(id).exec();
        if (!customer) {
            throw new common_1.NotFoundException(`Cliente com ID ${id} não encontrado`);
        }
        return {
            ...customer.toObject(),
            shard: await this.getShardForCpf(customer.cpf),
        };
    }
    async update(id, updateCustomerDto) {
        const updatedCustomer = await this.customerModel
            .findByIdAndUpdate(id, updateCustomerDto, { new: true })
            .exec();
        if (!updatedCustomer) {
            throw new common_1.NotFoundException(`Cliente com ID ${id} não encontrado`);
        }
        return {
            ...updatedCustomer.toObject(),
            shard: updateCustomerDto.cpf
                ? await this.getShardForCpf(updateCustomerDto.cpf)
                : await this.getShardForCpf(updatedCustomer.cpf),
        };
    }
    async delete(id) {
        const result = await this.customerModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException(`Cliente com ID ${id} não encontrado`);
        }
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(customer_schema_1.Customer.name)),
    __param(1, (0, mongoose_2.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_3.Model,
        mongoose_3.Connection])
], CustomersService);
//# sourceMappingURL=customers.service.js.map