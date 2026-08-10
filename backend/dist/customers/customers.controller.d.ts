import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    create(createCustomerDto: CreateCustomerDto): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateCustomerDto: Partial<CreateCustomerDto>): Promise<any>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=customers.controller.d.ts.map