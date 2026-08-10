const axios = require('axios');

function generateClientes(count) {
  const nomes = ['João', 'Maria', 'Carlos', 'Ana', 'Pedro', 'Lucas', 'Fernanda', 'Ricardo', 'Juliana', 'Bruno', 'Felipe', 'Mariana', 'Diego', 'Sofia', 'Roberto', 'Beatriz', 'Antonio', 'Camila'];
  const sobrenomes = ['Silva', 'Santos', 'Mendes', 'Costa', 'Oliveira', 'Ferreira', 'Alves', 'Gomes', 'Martins', 'Castro', 'Pereira', 'Carvalho', 'Rocha', 'Souza', 'Fernandes', 'Ribeiro', 'Barbosa', 'Monteiro'];
  const cidades = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Salvador', 'Fortaleza', 'Recife', 'Porto Alegre', 'Curitiba', 'Manaus', 'Belém', 'Goiânia', 'Maceió', 'João Pessoa', 'Natal', 'Teresina'];
  const estados = ['SP', 'RJ', 'MG', 'DF', 'BA', 'CE', 'PE', 'RS', 'PR', 'AM', 'PA', 'GO', 'AL', 'PB', 'RN', 'PI'];

  const clientes = [];
  for (let i = 0; i < count; i++) {
    const cpfBase = Math.floor((i / count) * 1000000000);
    const cpfNum = String(cpfBase).padStart(9, '0');
    const cpfCheck = String(i % 100).padStart(2, '0');
    const cpf = `${cpfNum.substring(0, 3)}.${cpfNum.substring(3, 6)}.${cpfNum.substring(6, 9)}-${cpfCheck}`;
    const nome = `${nomes[i % nomes.length]} ${sobrenomes[i % sobrenomes.length]}`;
    const cidade = cidades[i % cidades.length];
    const estado = estados[i % estados.length];

    clientes.push({
      nome,
      cpf,
      email: `cliente${i}@example.com`,
      telefone: `(${String((i % 85) + 11).padStart(2, '0')})9${String(98000000 + (i % 10000000)).padStart(8, '0')}`,
      dataNascimento: `${1970 + (i % 50)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      endereco: `Rua ${String.fromCharCode(65 + (i % 26))}, ${(i % 9999) + 1}`,
      cidade,
      estado,
      cep: `${String((i % 99999)).padStart(5, '0')}-${String((i + 100) % 1000).padStart(3, '0')}`
    });
  }
  return clientes;
}

const clientes = generateClientes(1500);

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
