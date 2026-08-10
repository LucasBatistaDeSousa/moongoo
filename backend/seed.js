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

async function waitForAPI(maxRetries = 60) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await axios.get(`${API_URL}/customers`, { timeout: 2000 });
      console.log('[SEED] API ready!');
      return true;
    } catch (error) {
      console.log(`[SEED] Waiting for API... (${i + 1}/${maxRetries})`);
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  throw new Error('API did not start in time');
}

async function createInitialChunk() {
  try {
    const testCliente = {
      nome: 'Teste Inicial',
      cpf: '000.000.000-00',
      email: 'teste@test.com',
      telefone: '(00)00000-0000',
      dataNascimento: '2000-01-01',
      endereco: 'Rua Teste, 1',
      cidade: 'Teste',
      estado: 'TT',
      cep: '00000-000'
    };
    await axios.post(`${API_URL}/customers`, testCliente, { timeout: 5000 });
    console.log('[SEED] Initial document created to trigger chunk creation');
  } catch (error) {
    console.log('[SEED] Initial document may already exist');
  }
}

async function waitForSharding(maxRetries = 30) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.get(`${API_URL}/customers/debug/sharding`, { timeout: 2000 });
      const chunks = response.data?.chunks || [];
      if (chunks.length > 0) {
        console.log(`[SEED] Sharding ready! Found ${chunks.length} chunks`);
        return true;
      }
      console.log(`[SEED] Waiting for chunks creation... (${i + 1}/${maxRetries})`);
      await new Promise(r => setTimeout(r, 2000));
    } catch (error) {
      console.log(`[SEED] Waiting for sharding... (${i + 1}/${maxRetries})`);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  console.log('[SEED] Chunks not created, proceeding...');
  return true;
}

async function seed() {
  try {
    await waitForAPI();
    await createInitialChunk();
    await waitForSharding();

    let success = 1;
    let failed = 0;

    for (const cliente of clientes) {
      try {
        await axios.post(`${API_URL}/customers`, cliente, { timeout: 5000 });
        success++;
        console.log(`[SEED] Created: ${cliente.nome}`);
      } catch (error) {
        failed++;
        console.error(`[SEED] Failed: ${cliente.nome}`, error.message);
      }
    }

    console.log(`[SEED] Done! Success: ${success}, Failed: ${failed}`);
    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('[SEED] Fatal error:', error.message);
    process.exit(1);
  }
}

seed();
