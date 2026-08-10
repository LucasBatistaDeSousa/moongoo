import React from 'react';
import './CustomerList.css';

function CustomerList({ customers, onSelectCustomer, selectedCustomerId }) {
  return (
    <div className="customer-list">
      <h2>👥 Lista de Clientes ({customers.length})</h2>
      {customers.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum cliente cadastrado ainda.</p>
          <p>Preencha o formulário ao lado para adicionar um novo cliente!</p>
        </div>
      ) : (
        <div className="customer-table">
          <div className="table-header">
            <div className="col-nome">Nome</div>
            <div className="col-cpf">CPF</div>
            <div className="col-email">E-mail</div>
            <div className="col-shard">🗄️ Shard</div>
          </div>
          <div className="table-body">
            {customers.map((customer) => (
              <div
                key={customer._id}
                className={`table-row ${
                  selectedCustomerId === customer._id ? 'selected' : ''
                }`}
                onClick={() => onSelectCustomer(customer)}
              >
                <div className="col-nome">{customer.nome}</div>
                <div className="col-cpf">{customer.cpf}</div>
                <div className="col-email">{customer.email}</div>
                <div className="col-shard">
                  <span className="shard-badge">{customer.shard}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerList;
