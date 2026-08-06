import { IsString, IsEmail, IsDateString } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  nome: string;

  @IsString()
  cpf: string;

  @IsEmail()
  email: string;

  @IsString()
  telefone: string;

  @IsDateString()
  dataNascimento: string;

  @IsString()
  endereco: string;

  @IsString()
  cidade: string;

  @IsString()
  estado: string;

  @IsString()
  cep: string;
}
