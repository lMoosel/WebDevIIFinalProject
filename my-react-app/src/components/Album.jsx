import { useNavigate } from "react-router-dom";
import { useQuery } from '@apollo/client';
import queries from '../graphQL/index.js';  
import { CookiesProvider, useCookies } from 'react-cookie';
import { Link, useParams } from 'react-router-dom';

export function Album(props) {

    const [cookies, setCookie] = useCookies(['user']);
    let user = cookies.user
    const {albumid} = useParams();

    const { data, loading, error } = useQuery(queries.GET_SPOTIFY_ALBUM, {
        variables: {
            id: user._id,
            albumId: albumid
        }
    });
        
    if (loading) return <p>Loading...</p>;
    if (error) return <p>404 Error : Please try again</p>;

    const album = data?.getSpotifyAlbum;

    return (
        <div>
            <h1>{album.name}</h1>
            <p>Album Type: {album.album_type}</p>
            <p>Total Tracks: {album.total_tracks}</p>
            <p>Release Date: {album.release_date}</p>
            <div>
                <h3>Artists:</h3>
                {album.artists.map((artist) => (
                    <div key={artist.external_urls.spotify.split("/").pop()}>
                        <p>Name: <Link to={`/artist/${artist.external_urls.spotify.split("/").pop()}`}>{artist.name}</Link></p>
                        <p>Spotify URL: <a href={artist.external_urls.spotify}>{artist.external_urls.spotify}</a></p>
                    </div>
                ))}
            </div>
            <div>
                <h3>Images:</h3>
                {album.images.length > 0 && (
                    <img
                        src={album.images[0].url} // Display the URL of the first image
                        alt={`Album Image`}
                        style={{ maxWidth: '400px', maxHeight: '400px' }} // Limit the size of the image
                    />
                )}
            </div>
        </div>
    )
}