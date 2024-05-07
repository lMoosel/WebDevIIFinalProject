import { useNavigate } from "react-router-dom";
import { useQuery } from '@apollo/client';
import queries from '../graphQL/index.js';  
import { CookiesProvider, useCookies } from 'react-cookie';
import { Link, useParams } from 'react-router-dom';

export function Artist(props) {

    const [cookies, setCookie] = useCookies(['user']);
    let user = cookies.user
    const {artistid} = useParams();

    const { data, loading, error } = useQuery(queries.GET_SPOTIFY_ARTIST, {
        variables: {
            id: user._id,
            artistId: artistid
        }
    });
        
    if (loading) return <p>Loading...</p>;
    if (error) return <p>404 Error : Please try again</p>;

    const artist = data?.getSpotifyArtist;

    return(
        <div id="Genre-info-div">
            <h1>{artist.name}</h1>
            <p>Followers: {artist.followers.total}</p>
            <p>Popularity: {artist.popularity}</p>
            <p>Genres: {artist.genres.join(', ')}</p>
            <p>Spotify URL: <a href={artist.external_urls.spotify}>{artist.external_urls.spotify}</a></p>
            <div>
                <h3>Image:</h3>
                {artist.images.length > 0 && (
                    <img
                        src={artist.images[0].url} // Display the URL of the first image
                        alt={`Artist Image`}
                        style={{ maxWidth: '400px', maxHeight: '400px' }} // Limit the size of the image
                    />
                )}
            </div>
            <Link to={`/`}>Home</Link>
        </div>
    )
}