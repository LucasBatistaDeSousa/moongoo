import { IsString, IsEmail, IsDateString, Matches, MinLength, MaxLength } from 'class-validator';

export class CreateCustomerDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  @MaxLength(150, { message: 'Nome deve ter no máximo 150 caracteres' })
  nome!: string;

  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'CPF deve estar no formato: 000.000.000-00',
  })
  cpf!: string;

  @IsEmail({}, { message: 'Email deve ser um endereço de email válido' })
  email!: string;

  @IsString()
  @Matches(/^\(\d{2}\)\s9\d{4}-\d{4}$/, {
    message: 'Telefone deve estar no formato: (XX) 9XXXX-XXXX',
  })
  telefone!: string;

  @IsDateString({}, { message: 'Data de nascimento deve estar no formato YYYY-MM-DD' })
  dataNascimento!: string;

  @IsString()
  @MinLength(5, { message: 'Endereço deve ter no mínimo 5 caracteres' })
  endereco!: string;

  @IsString()
  @MinLength(3, { message: 'Cidade deve ter no mínimo 3 caracteres' })
  cidade!: string;

  @IsString()
  @Matches(/^[A-Z]{2}$/, {
    message: 'Estado deve ser uma sigla com 2 letras maiúsculas (ex: SP, RJ)',
  })
  estado!: string;

  @IsString()
  @Matches(/^\d{5}-\d{3}$/, {
    message: 'CEP deve estar no formato: XXXXX-XXX',
  })
  cep!: string;
}
