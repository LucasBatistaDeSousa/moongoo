import React, { useState, useEffect } from 'react';
import './CustomerForm.css';

function CustomerForm({ onSubmit, initialData, isEditing, onCancelEdit }) {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome || '',
        cpf: initialData.cpf || '',
        email: initialData.email || '',
        telefone: initialData.telefone || '',
        dataNascimento: initialData.dataNascimento
          ? initialData.dataNascimento.split('T')[0]
          : '',
        endereco: initialData.endereco || '',
        cidade: initialData.cidade || '',
        estado: initialData.estado || '',
        cep: initialData.cep || '',
      });
    } else {
      setFormData({
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
        dataNascimento: '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!isEditing) {
      setFormData({
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
        dataNascimento: '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
      });
    }
  };

  return (
    <form className="customer-form" onSubmit={handleSubmit}>
      <h2>{isEditing ? '✏️ Editar Cliente' : '➕ Novo Cliente'}</h2>

      <div className="form-group">
        <label htmlFor="nome">Nome *</label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
          placeholder="João da Silva"
        />
      </div>

      <div className="form-group">
        <label htmlFor="cpf">CPF *</label>
        <input
          type="text"
          id="cpf"
          name="cpf"
          value={formData.cpf}
          onChange={handleChange}
          required
          placeholder="123.456.789-00"
          disabled={isEditing}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">E-mail *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="email@example.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="telefone">Telefone *</label>
        <input
          type="tel"
          id="telefone"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
          required
          placeholder="(11) 99999-9999"
        />
      </div>

      <div className="form-group">
        <label htmlFor="dataNascimento">Data de Nascimento *</label>
        <input
          type="date"
          id="dataNascimento"
          name="dataNascimento"
          value={formData.dataNascimento}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="endereco">Endereço *</label>
        <input
          type="text"
          id="endereco"
          name="endereco"
          value={formData.endereco}
          onChange={handleChange}
          required
          placeholder="Rua A, 123"
        />
      </div>

      <div className="form-group">
        <label htmlFor="cidade">Cidade *</label>
        <input
          type="text"
          id="cidade"
          name="cidade"
          value={formData.cidade}
          onChange={handleChange}
          required
          placeholder="São Paulo"
        />
      </div>

      <div className="form-group">
        <label htmlFor="estado">Estado *</label>
        <input
          type="text"
          id="estado"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          required
          placeholder="SP"
          maxLength="2"
        />
      </div>

      <div className="form-group">
        <label htmlFor="cep">CEP *</label>
        <input
          type="text"
          id="cep"
          name="cep"
          value={formData.cep}
          onChange={handleChange}
          required
          placeholder="01310-100"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Atualizar' : 'Cadastrar'}
        </button>
        {isEditing && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancelEdit}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default CustomerForm;
