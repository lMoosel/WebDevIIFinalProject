import { useNavigate } from "react-router-dom";
import { useQuery } from '@apollo/client';
import queries from '../graphQL/index.js';  
import { CookiesProvider, useCookies } from 'react-cookie';
import { Link, useParams } from 'react-router-dom';

export function Artist(props) {

    const [cookies, setCookie] = useCookies(['user']);
    let user = cookies.user
    const {artistid} = useParams();

    const { data: artistData, loading: artistLoading, error: artistError } = useQuery(queries.GET_SPOTIFY_ARTIST, {
        variables: {
            id: user._id,
            artistId: artistid
        }
    });

    const { data: relatedData, loading: relatedLoading, error: relatedError} = useQuery(queries.GET_RELATED_ARTISTS, {
        variables: {
            id: user._id,
            artistId: artistid
        }
    });

    const { data: topData, loading: topLoading, error: topError } = useQuery(queries.GET_ARTIST_TOP, {
        variables: {
            id: user._id,
            artistId: artistid
        }
    });
        
    if (artistLoading || relatedLoading || topLoading) return <p>Loading...</p>;
    if (artistError || relatedError || topError) return <p>404 Error : Please try again</p>;

    const artist = artistData?.getSpotifyArtist;
    const related = relatedData?.getSpotifyArtistRelatedArtists;
    const top = topData?.getSpotifyArtistTopSongs;

    return(
        <div id="Genre-info-div">
            <h1>{artist.name}</h1>
            <p>Followers: {artist.followers.total}</p>
            <p>Popularity: {artist.popularity}</p>
            <p>Genres: {artist.genres.join(', ')}</p>
            <p>Spotify URL: <a href={artist.external_urls.spotify}>{artist.external_urls.spotify}</a></p>
            <h3>Top Songs</h3>
            {top.map((track) => (
                <div key={track.id}>
                    <p><Link to={`/track/${track.id}`}>{track.name}</Link>
                        {" from "}
                        <Link to={`/album/${track.album.id}`}>{track.album.name}</Link>
                        {" by "}
                        {track.artists.map((artist, index) => (
                            <span key={index}>
                                {index > 0 && ", "}
                                <Link to={`/artist/${artist.id}`}>{artist.name}</Link>
                            </span>
                        ))}
                    </p>
                </div>
            ))}
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
            <h3>Related Artists</h3>
            {related.map((otherArtist) => (
                <div key={otherArtist.id}>
                    <p><Link to={`/artist/${otherArtist.id}`}>{otherArtist.name}</Link></p>
                </div>
            ))}
        </div>
    )
}