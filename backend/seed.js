const axios = require('axios');

const clientes = [
  { nome: 'João Silva', cpf: '111.111.111-11', email: 'joao1@test.com', telefone: '(11)98888-8888', dataNascimento: '1990-01-15', endereco: 'Rua A, 123', cidade: 'São Paulo', estado: 'SP', cep: '01310-100' },
  { nome: 'Maria Santos', cpf: '222.222.222-22', email: 'maria1@test.com', telefone: '(21)98888-8888', dataNascimento: '1985-05-20', endereco: 'Rua B, 456', cidade: 'Rio de Janeiro', estado: 'RJ', cep: '20000-000' },
  { nome: 'Carlos Mendes', cpf: '333.333.333-33', email: 'carlos1@test.com', telefone: '(47)98888-8888', dataNascimento: '1988-07-22', endereco: 'Rua C, 789', cidade: 'Joinville', estado: 'SC', cep: '89000-000' },
  { nome: 'Ana Costa', cpf: '444.444.444-44', email: 'ana1@test.com', telefone: '(85)98888-8888', dataNascimento: '1992-03-10', endereco: 'Rua D, 321', cidade: 'Fortaleza', estado: 'CE', cep: '60000-000' },
  { nome: 'Pedro Oliveira', cpf: '555.555.555-55', email: 'pedro1@test.com', telefone: '(31)98888-8888', dataNascimento: '1995-11-05', endereco: 'Rua E, 654', cidade: 'Belo Horizonte', estado: 'MG', cep: '30000-000' },
  { nome: 'Lucas Ferreira', cpf: '666.666.666-66', email: 'lucas1@test.com', telefone: '(51)98888-8888', dataNascimento: '1993-06-12', endereco: 'Rua F, 987', cidade: 'Porto Alegre', estado: 'RS', cep: '90000-000' },
  { nome: 'Fernanda Alves', cpf: '777.777.777-77', email: 'fernanda1@test.com', telefone: '(71)98888-8888', dataNascimento: '1991-02-28', endereco: 'Rua G, 147', cidade: 'Salvador', estado: 'BA', cep: '40000-000' },
  { nome: 'Ricardo Gomes', cpf: '888.888.888-88', email: 'ricardo1@test.com', telefone: '(61)98888-8888', dataNascimento: '1987-09-30', endereco: 'Rua H, 258', cidade: 'Brasília', estado: 'DF', cep: '70000-000' },
  { nome: 'Juliana Martins', cpf: '999.999.999-99', email: 'juliana1@test.com', telefone: '(81)98888-8888', dataNascimento: '1994-04-17', endereco: 'Rua I, 369', cidade: 'Recife', estado: 'PE', cep: '50000-000' },
  { nome: 'Bruno Castro', cpf: '101.010.101-01', email: 'bruno1@test.com', telefone: '(41)98888-8888', dataNascimento: '1989-12-03', endereco: 'Rua J, 456', cidade: 'Curitiba', estado: 'PR', cep: '80000-000' },
];

const API_URL = process.env.API_URL || 'http://backend:3000';

async function waitForAPI(maxRetries = 30) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await axios.get(`${API_URL}/customers`, { timeout: 3000 });
      console.log('✅ API pronta!');
      return true;
    } catch (error) {
      console.log(`⏳ Aguardando API... (${i + 1}/${maxRetries})`);
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  throw new Error('API não respondeu a tempo');
}

async function seed() {
  try {
    console.log('🌱 Iniciando seed de clientes...\n');

    await waitForAPI();

    let success = 0;
    let failed = 0;

    for (const cliente of clientes) {
      try {
        const response = await axios.post(`${API_URL}/customers`, cliente, { timeout: 5000 });
        console.log(`✅ ${cliente.nome.padEnd(20)} | CPF: ${cliente.cpf} | Shard: ${response.data.shard}`);
        success++;
      } catch (error) {
        console.error(`❌ Erro ao criar ${cliente.nome}: ${error.response?.data?.message || error.message}`);
        failed++;
      }
    }

    console.log(`\n📊 Resumo: ${success} criados, ${failed} falhados`);
    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('❌ Erro fatal:', error.message);
    process.exit(1);
  }
}

seed();
