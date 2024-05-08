import { Link } from "react-router-dom";
import { useQuery } from '@apollo/client';
import queries from '../graphQL/index.js';  

export function TopInfo({ userId }) {
    const { data: tracksData, loading: tracksLoading } = useQuery(queries.GET_SPOTIFY_TOP_TRACKS, {
        variables: {
            id: userId,
            timeRange: "short_term",
            offset: 0,
            limit: 5
        }
    });

    const { data: artistsData, loading: artistsLoading } = useQuery(queries.GET_SPOTIFY_TOP_ARTISTS, {
        variables: {
            id: userId,
            timeRange: "short_term",
            offset: 0,
            limit: 5
        }
    });

    const { data: genresData, loading: genresLoading } = useQuery(queries.GET_SPOTIFY_TOP_GENRES, {
        variables: {
            id: userId,
            timeRange: "short_term",
            limit: 5
        }
    });

    const { data: albumsData, loading: albumsLoading } = useQuery(queries.GET_SPOTIFY_TOP_ALBUMS, {
        variables: {
            id: userId,
            timeRange: "short_term",
            limit: 5
        }
    }); 

    return (
        <div>
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
