import React, { useState } from 'react';
import queries from '../graphQL/index.js';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CookiesProvider, useCookies } from 'react-cookie';
function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
    email: '',
    password: '',
    });
    const [cookies, setCookie] = useCookies(['user']);
  const [validateUser, { loading, error }] = useMutation(queries.VALIDATE_USER);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
        ...prevState,
        [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    validateUser({
        variables: formData
    }).then(response => {
        console.log('User log in successful');
        if (response.data.validateUser) {
            delete response.data.friends;
            delete response.data.friendRequests;
            setCookie('user', response.data.validateUser, { path: '/' }); 
            navigate('/');
        } else {
            console.error('Error: No user data returned');
        }
    }).catch((error) => {
        console.error(`Error adding user: ${error.message}`);
    });
  };


  return (
    <form onSubmit={handleSubmit}>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
        <button type="submit" disabled={loading}>Log in</button>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
    </form>
  );
}

export default Login;