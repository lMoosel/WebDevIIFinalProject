import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import queries from '../graphQL/index.js';
import { useCookies } from 'react-cookie';

export function CurrentSong (props) {
    
    const [cookies, setCookie] = useCookies(['user']);
    let user = cookies.user;

    if (!user) {
        return ( <h1>CURRENT SONG</h1> );
    }

    const { data, loading, error, refetch } = useQuery(queries.GET_SPOTIFY_CURRENTLY_PLAYING, {
        variables: {
            id: user._id
        },
        pollInterval: 30 * 1000
    });

    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
        }, 30000); // Refetch every 30 seconds
        return () => clearInterval(interval);
    }, [user._id]); // Refetch when user ID changes (shouldn't be necessary but just in case)

    if (!loading && error) {
        console.log("Error: ", error);
    }

    if (!loading) {
        console.log(data.getSpotifyCurrentlyPlaying);
        console.log("User's id: ", user._id);
    }

    return (
        <div id="Current-song-div">
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {!loading && !error && !data && <p>Unable to fetch authentication URL, please try again later.</p>}
            {data && data.getSpotifyCurrentlyPlaying && <>
                <div id="cs-div"><h1 id="current-song">{ data.getSpotifyCurrentlyPlaying.item.name } by {data.getSpotifyCurrentlyPlaying.item.artists[0].name}</h1></div>
            </>}
            {data && !data.getSpotifyCurrentlyPlaying && <>
                <p>No song currently playing!</p>
            </>}
        </div>
    );
}