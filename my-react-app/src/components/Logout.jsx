import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import queries from '../queries.js';
import { CookiesProvider, useCookies } from 'react-cookie';
function Logout() {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const handleRemoveCookie = () => {
        removeCookie('user');
    };
    return (
        <div>
            <button onClick={handleRemoveCookie}>Log out</button>
        </div>
    );
}
export default Logout;