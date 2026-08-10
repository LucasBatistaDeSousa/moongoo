import { Model, Connection } from 'mongoose';
import { Customer } from './schemas/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
export declare class CustomersService {
    private customerModel;
    private connection;
    constructor(customerModel: Model<Customer>, connection: Connection);
    create(createCustomerDto: CreateCustomerDto): Promise<any>;
    private getShardForCpf;
    findAll(): Promise<any[]>;
    findById(id: string): Promise<any>;
    update(id: string, updateCustomerDto: Partial<CreateCustomerDto>): Promise<any>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=customers.service.d.ts.map