import React, { useState } from 'react';
import queries from '../queries.js';
import { useMutation } from '@apollo/client';

function SignUp() {
    const [formData, setFormData] = useState({
    email: '',
    password: '',
    });

  const [createUser, { loading, error }] = useMutation(queries.CREATE_USER);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
        ...prevState,
        [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    createUser({
        variables: formData
    }).then(() => {
        alert('User Added');
        //Handle cookies 
    }).catch((error) => {
        console.error(`Error adding user: ${error.message}`);
    });
  };


  return (
    <form onSubmit={handleSubmit}>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
        <button type="submit" disabled={loading}>Sign Up</button>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
    </form>
  );
}

export default SignUp;
