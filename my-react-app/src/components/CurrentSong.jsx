import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import queries from '../graphQL/index.js';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';

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
        }, 30 * 1000); // Refetch every 30 seconds
        return () => clearInterval(interval);
    }, [user._id]); // Refetch when user ID changes (shouldn't be necessary but just in case)

    if (error) {
        console.log("Error: ", error, loading);
    }

    return (
        <div id="Current-song-div">
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {!loading && !error && !data && <p>Unable to fetch authentication URL, please try again later.</p>}
            {data && data.getSpotifyCurrentlyPlaying && <>
                <div id="cs-div"><h1 id="current-song">
                    <Link to={`/track/${data.getSpotifyCurrentlyPlaying.item.id}`}>{data.getSpotifyCurrentlyPlaying.item.name}</Link>
                    {" "} by {" "}
                    {data.getSpotifyCurrentlyPlaying.item.artists.map((artist, index) => (
                    <span key={index}>
                         {index > 0 && ", "}
                         <Link to={`/artist/${artist.id}`}>{artist.name}</Link>
                     </span>))}
                </h1></div>
            </>}
            {data && !data.getSpotifyCurrentlyPlaying && <>
                <p>No song currently playing!</p>
            </>}
        </div>
    );
}