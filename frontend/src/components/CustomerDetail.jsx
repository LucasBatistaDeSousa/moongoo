import React from 'react';
import './CustomerDetail.css';

function CustomerDetail({ customer, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="customer-detail">
      <h2>📝 Detalhes do Cliente</h2>

      <div className="detail-content">
        <div className="detail-item">
          <label>Nome:</label>
          <p>{customer.nome}</p>
        </div>

        <div className="detail-item">
          <label>CPF:</label>
          <p>{customer.cpf}</p>
        </div>

        <div className="detail-item">
          <label>E-mail:</label>
          <p>{customer.email}</p>
        </div>

        <div className="detail-item">
          <label>Telefone:</label>
          <p>{customer.telefone}</p>
        </div>

        <div className="detail-item">
          <label>Data de Nascimento:</label>
          <p>{formatDate(customer.dataNascimento)}</p>
        </div>

        <div className="detail-item">
          <label>Endereço:</label>
          <p>{customer.endereco}</p>
        </div>

        <div className="detail-item">
          <label>Cidade:</label>
          <p>{customer.cidade}</p>
        </div>

        <div className="detail-item">
          <label>Estado:</label>
          <p>{customer.estado}</p>
        </div>

        <div className="detail-item">
          <label>CEP:</label>
          <p>{customer.cep}</p>
        </div>

        <div className="detail-item">
          <label>ID MongoDB:</label>
          <p className="id-text">{customer._id}</p>
        </div>

        <div className="detail-item">
          <label>🗄️ Shard:</label>
          <p className="shard-text">{customer.shard || 'unknown'}</p>
        </div>
      </div>

      <div className="detail-actions">
        <button className="btn btn-edit" onClick={onEdit}>
          ✏️ Editar
        </button>
        <button className="btn btn-delete" onClick={onDelete}>
          🗑️ Deletar
        </button>
      </div>
    </div>
  );
}

export default CustomerDetail;
