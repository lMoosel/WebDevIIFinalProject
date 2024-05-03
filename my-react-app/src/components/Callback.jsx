import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import queries from '../queries.js';

function Callback() {
    const navigate = useNavigate(); 
    const [authorizeSpotify, { data, loading, error }] = useMutation(queries.AUTHORIZE_SPOTIFY);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const error = params.get('error');
        const state = params.get('state');
        if (error) {
            console.error('Spotify authentication error:', error);
        }

        if (state && code) {
        authorizeSpotify({
        variables: {
            id: '66356c6fca887f8452dfdbf0', // Replace userid with the cookie id 
            code: code
        }
        }).then(() => {
            console.log('Authorization successful');
            navigate('/');
        }).catch(err => {
            console.error('Error processing authorization:', err);
            navigate('/error');
        });
        }
    }, [authorizeSpotify, navigate]);

    if (loading) return <p>Authorizing...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return <div>Processing Spotify authentication...</div>;
}

export default Callback;
