import React, { useState, useEffect } from 'react';

const CustomerForm = ({ addCustomer, editingCustomer, updateCustomer }) => {
  const [customer, setCustomer] = useState({
    name: '',
    address: '',
    country: '',
    gender: '',
    age: ''
  });

  useEffect(() => {
    if (editingCustomer) {
      setCustomer(editingCustomer);
      console.log('Editing customer:', editingCustomer);
    }
  }, [editingCustomer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
    console.log(`Updated ${name} to ${value}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with customer:', customer);
    if (editingCustomer) {
      updateCustomer(customer);
    } else {
      addCustomer(customer);
    }
    setCustomer({
      name: '',
      address: '',
      country: '',
      gender: '',
      age: ''
    });
    console.log('Customer form reset');
  };

  return (
    <form onSubmit={handleSubmit} className="customer-form">
      <label>Name:</label>
      <input type="text" name="name" value={customer.name} onChange={handleChange} required />
      <label>Address:</label>
      <input type="text" name="address" value={customer.address} onChange={handleChange} required />
      <label>Country:</label>
      <input type="text" name="country" value={customer.country} onChange={handleChange} required />
      <label>Gender:</label>
      <input type="text" name="gender" value={customer.gender} onChange={handleChange} required />
      <label>Age:</label>
      <input type="number" name="age" value={customer.age} onChange={handleChange} required />
      <button type="submit">{editingCustomer ? 'Update' : 'Add'} Customer</button>
    </form>
  );
};

export default CustomerForm;