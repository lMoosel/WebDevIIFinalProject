import React from 'react';
import { useQuery } from '@apollo/client';
import queries from '../queries.js';

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
    <div>
        <button onClick={handleRedirect} disabled={loading || !data || !data.getSpotifyAuthUrl}>
            Authenticate with Spotify
        </button>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
    </div>
  );
}

export default Authorize;
