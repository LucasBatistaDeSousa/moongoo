import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import CustomerForm from './components/CustomerForm';
import CustomerList from './components/CustomerList';
import CustomerDetail from './components/CustomerDetail';

const API_URL = 'http://localhost:3000';

function App() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/customers`);
      setCustomers(response.data);
      setSelectedCustomer(null);
    } catch (err) {
      setError('Erro ao carregar clientes: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async (customerData) => {
    try {
      const response = await axios.post(
        `${API_URL}/customers`,
        customerData
      );
      setCustomers([...customers, response.data]);
      setError(null);
      alert('Cliente cadastrado com sucesso!');
    } catch (err) {
      setError('Erro ao cadastrar cliente: ' + err.message);
      console.error(err);
    }
  };

  const handleUpdateCustomer = async (customerId, customerData) => {
    try {
      const response = await axios.put(
        `${API_URL}/customers/${customerId}`,
        customerData
      );
      setCustomers(
        customers.map((c) => (c._id === customerId ? response.data : c))
      );
      setEditingCustomer(null);
      setSelectedCustomer(null);
      setError(null);
      alert('Cliente atualizado com sucesso!');
    } catch (err) {
      setError('Erro ao atualizar cliente: ' + err.message);
      console.error(err);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('Tem certeza que deseja deletar este cliente?')) {
      try {
        await axios.delete(`${API_URL}/customers/${customerId}`);
        setCustomers(customers.filter((c) => c._id !== customerId));
        setSelectedCustomer(null);
        setError(null);
        alert('Cliente deletado com sucesso!');
      } catch (err) {
        setError('Erro ao deletar cliente: ' + err.message);
        console.error(err);
      }
    }
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setEditingCustomer(null);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Sistema de Cadastro de Clientes</h1>
        <p>Gerenciamento com MongoDB Sharding</p>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="app-container">
        <div className="form-section">
          <CustomerForm
            onSubmit={
              editingCustomer
                ? (data) =>
                    handleUpdateCustomer(editingCustomer._id, data)
                : handleCreateCustomer
            }
            initialData={editingCustomer}
            isEditing={!!editingCustomer}
            onCancelEdit={() => setEditingCustomer(null)}
          />
        </div>

        <div className="main-content">
          {loading ? (
            <div className="loading">Carregando...</div>
          ) : (
            <>
              <CustomerList
                customers={customers}
                onSelectCustomer={handleSelectCustomer}
                selectedCustomerId={selectedCustomer?._id}
              />

              {selectedCustomer && (
                <CustomerDetail
                  customer={selectedCustomer}
                  onEdit={() => handleEditCustomer(selectedCustomer)}
                  onDelete={() => handleDeleteCustomer(selectedCustomer._id)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
