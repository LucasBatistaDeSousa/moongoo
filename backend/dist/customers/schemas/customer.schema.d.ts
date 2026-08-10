import { Document } from 'mongoose';
export declare class Customer extends Document {
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    dataNascimento: Date;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
}
export declare const CustomerSchema: import("mongoose").Schema<Customer, import("mongoose").Model<Customer, any, any, any, Document<unknown, any, Customer, any, {}> & Customer & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Customer, Document<unknown, {}, import("mongoose").FlatRecord<Customer>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Customer> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
//# sourceMappingURL=customer.schema.d.ts.map