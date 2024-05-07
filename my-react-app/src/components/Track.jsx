import { useNavigate } from "react-router-dom";
import { useQuery } from '@apollo/client';
import Chart from "react-apexcharts";
import queries from '../graphQL/index.js';  
import { CookiesProvider, useCookies } from 'react-cookie';
import { Link, useParams } from 'react-router-dom';

export function Track(props) {

    const [cookies, setCookie] = useCookies(['user']);
    let user = cookies.user
    const {trackid} = useParams();

    const { data: trackData, loading: trackLoading, error: trackError } = useQuery(
        queries.GET_SPOTIFY_TRACK, {
          variables: {
            id: user._id,
            trackId: trackid
          }
      });
      
      const { data: audioFeaturesData, loading: audioFeaturesLoading, error: audioFeaturesError } = useQuery(
        queries.GET_SPOTIFY_TRACK_AUDIO_FEATURES, {
          variables: {
            id: user._id,
            trackId: trackid
          }
      });
       
    if (trackLoading || audioFeaturesLoading) return <p>Loading...</p>;
    if (trackError || audioFeaturesError) return <p>404 Error : Please try again</p>;

    const track = trackData?.getSpotifyTrack;
    const audioFeatures = audioFeaturesData?.getSpotifyTrackAudioFeatures;

    let chartData = {
        options: {
            chart: {
                id: "basic-bar"
            },
            xaxis: {
                categories: [
                    "Acousticness",
                    "Danceability",
                    "Energy",
                    "Instrumentalness",
                    "Liveness",
                    "Popularity?",
                    "Speechful",
                    "Valence"
                ]
            }
        },
        series: [
            {
                name: track.name,
                data: [
                    audioFeatures.acousticness,
                    audioFeatures.danceability,
                    audioFeatures.energy,
                    audioFeatures.instrumentalness,
                    audioFeatures.liveness,
                    0,
                    audioFeatures.speechiness,
                    audioFeatures.valence,
                ]
            }
        ]
    };

    return (
        <div>
            <h1>{track.name}</h1>
            <p>Duration: {track.duration_ms} ms</p>
            <p>Explicit: {track.explicit ? 'Yes' : 'No'}</p>
            <p>Preview URL: <a href={track.preview_url}>{track.preview_url}</a></p>
            <p>Spotify URL: <a href={track.external_urls.spotify}>{track.external_urls.spotify}</a></p>
            <p>Track Number: {track.track_number}</p>
            <p>Disc Number: {track.disc_number}</p>
            <p>Popularity: {track.popularity}</p>
            <p>Is Local: {track.is_local ? 'Yes' : 'No'}</p>
            <div>
                <h3>Artists:</h3>
                {track.artists.map((artist) => (
                    <div key={artist.id}>
                        <p>Name: <Link to={`/artist/${artist.id}`}>{artist.name}</Link></p>
                    </div>
                ))}
            </div>
            <div>
            <h3>Album:</h3>
            <p>Name: <Link to={`/album/${track.album.id}`}>{track.album.name}</Link></p>
            </div>
            <h1>Chart:</h1>
            {chartData && <Chart
                options={chartData.options}
                series={chartData.series}
                type="bar"
                width="500"
            />}
            <Link to={`/`}>Home</Link>
        </div>
    )
}