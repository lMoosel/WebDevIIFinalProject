import { Link } from "react-router-dom";
import { useQuery } from '@apollo/client';
import queries from '../graphQL/index.js';  
import { useCookies } from 'react-cookie';

export function GenreInfo(props) {
    const [cookies] = useCookies(['user']);
    const user = cookies.user;

    const { data: tracksData, loading: tracksLoading } = useQuery(queries.GET_SPOTIFY_TOP_TRACKS, {
        variables: {
            id: user._id,
            timeRange: "short_term",
            offset: 0,
            limit: 5
        }
    });

    const { data: artistsData, loading: artistsLoading } = useQuery(queries.GET_SPOTIFY_TOP_ARTISTS, {
        variables: {
            id: user._id,
            timeRange: "short_term",
            offset: 0,
            limit: 5
        }
    });

    const { data: genresData, loading: genresLoading } = useQuery(queries.GET_SPOTIFY_TOP_GENRES, {
        variables: {
            id: user._id,
            timeRange: "short_term",
            limit: 5
        }
    });

    const { data: albumsData, loading: albumsLoading } = useQuery(queries.GET_SPOTIFY_TOP_ALBUMS, {
        variables: {
            id: user._id,
            timeRange: "short_term",
            limit: 5
        }
    }); 

    return (
        <div id="Genre-info-div">
            {!props.hideInfo && <button className="info-button" onClick={() => {location.href="/topcategories"}}>i</button>}
            <h1>Your Favorites</h1>

            <h3>Top Songs:</h3>
            {!tracksLoading && tracksData && tracksData.getSpotifyTopTracks.items.map((song) => (
                <div key={song.id}>
                    <Link to={`/track/${song.id}`}>{song.name}</Link>
                </div>
            ))}

            <h3>Top Artists:</h3>
            {!artistsLoading && artistsData && artistsData.getSpotifyTopArtists.items.map((artist) => (
                <div key={artist.id}>
                    <Link to={`/artist/${artist.id}`}>{artist.name}</Link>
                </div>
            ))}

            <h3>Top Genres:</h3>
            {!genresLoading && genresData && genresData.getSpotifyTopGenres.map((genre) => (
                <div key={genre}>
                    {genre}
                </div>
            ))}

            <h3>Top Albums:</h3>
            {!albumsLoading && albumsData && albumsData.getSpotifyTopAlbums.map((album) => (
                <div key={album.id}>
                    <Link to={`/album/${album.id}`}>{album.name}</Link>
                </div>
            ))}
        </div>
    );
}