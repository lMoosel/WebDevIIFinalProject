import React from 'react';
import { useQuery } from '@apollo/client';
import queries from '../queries.js';
import { Link } from 'react-router-dom';
function Authorize() {
    const { data, loading, error } = useQuery(queries.GET_SPOTIFY_AUTH_URL);

    const handleRedirect = () => {
        if (data && data.getSpotifyAuthUrl) {
            window.location.href = data.getSpotifyAuthUrl;
        } else {
            console.error('No URL available to redirect.');
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to Spotifind</h1>
            <p>Please create a new account or log in.</p>
            <button onClick={handleRedirect} disabled={loading || !data || !data.getSpotifyAuthUrl}>
                Create Account
            </button>
            <button>
            <Link to={`/login/`}>
                  Login
            </Link>
            </button>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {!loading && !error && !data && <p>Unable to fetch authentication URL, please try again later.</p>}
        </div>
    );
}

export default Authorize;
