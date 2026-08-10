import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'customers',
  timestamps: true,
})
export class Customer extends Document {
  @Prop({ required: true })
  nome: string;

  @Prop({ required: true })
  cpf: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  telefone: string;

  @Prop({ required: true })
  dataNascimento: Date;

  @Prop({ required: true })
  endereco: string;

  @Prop({ required: true })
  cidade: string;

  @Prop({ required: true })
  estado: string;

  @Prop({ required: true })
  cep: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
