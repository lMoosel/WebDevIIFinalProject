import { useQuery } from '@apollo/client';
import queries from '../queries.js';
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
        }
    });
    
    return (
        <div id="Current-song-div">
            <h1>CURRENT SONG</h1>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {!loading && !error && !data && <p>Unable to fetch authentication URL, please try again later.</p>}
            {data && <>
                <p>Current song playing is: { data.getSpotifyCurrentlyPlaying.item.name }</p>
            </>}
        </div>
    )
}