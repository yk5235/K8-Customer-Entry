import React, { useState, useEffect } from 'react';
import CustomerForm from './components/CustomerForm';
import CustomerList from './components/CustomerList';
import config from './config';
import './index.css';

const App = () => {
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    console.log('Fetching customers...');
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`/api/customers`);
      const data = await response.json();
      setCustomers(data);
      console.log('Fetched customers:', data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const addCustomer = async (customer) => {
    try {
      console.log('Adding customer:', customer);
      const response = await fetch(`/api/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customer)
      });
      const newCustomer = await response.json();
      setCustomers([...customers, newCustomer]);
      console.log('Added customer:', newCustomer);
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  const updateCustomer = async (customer) => {
    try {
      console.log('Updating customer:', customer);
      const response = await fetch(`/api/customers/${customer._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customer)
      });
      const updatedCustomer = await response.json();
      setCustomers(customers.map((c) => (c._id === updatedCustomer._id ? updatedCustomer : c)));
      setEditingCustomer(null);
      console.log('Updated customer:', updatedCustomer);
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const deleteCustomer = async (id) => {
    try {
      console.log('Deleting customer with ID:', id);
      await fetch(`/api/customers/${id}`, {
        method: 'DELETE'
      });
      setCustomers(customers.filter((customer) => customer._id !== id));
      console.log('Deleted customer with ID:', id);
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const editCustomer = (customer) => {
    setEditingCustomer(customer);
    console.log('Editing customer:', customer);
  };

  return (
    <div className="container">
      <h1>Customer Data Entry</h1>
      <CustomerForm addCustomer={addCustomer} editingCustomer={editingCustomer} updateCustomer={updateCustomer} />
      <CustomerList customers={customers} deleteCustomer={deleteCustomer} editCustomer={editCustomer} />
    </div>
  );
};

export default App;