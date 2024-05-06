import { useQuery } from '@apollo/client';
import queries from '../graphQL/index.js';
import { CookiesProvider, useCookies } from 'react-cookie';

export function CurrentSong (props) {
    
    const [cookies, setCookie] = useCookies(['user']);
    let user = cookies.user;

    if (!user) {
        <h1>CURRENT SONG</h1>
    }

    const { data, loading, error } = useQuery(queries.GET_SPOTIFY_CURRENTLY_PLAYING, {
        variables: {
            id: user._id
        },
        pollInterval: 30000
    });

    if(!loading && false) {
        console.log("Error: ", error)
    }

    if(!loading) {
        console.log(data.getSpotifyCurrentlyPlaying)
        console.log("user's id: ", user._id)
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
    )
}