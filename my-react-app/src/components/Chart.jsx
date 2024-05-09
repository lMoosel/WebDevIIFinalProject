import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"; // Import useEffect and useState
import Chart from "react-apexcharts";
import { CookiesProvider, useCookies } from 'react-cookie';
import { useQuery } from '@apollo/client';
import queries from '../graphQL/index.js';

export function ChartComponent (props) {

    const [cookies, setCookie] = useCookies(['user']);
    let user = cookies.user;

    const [trackId, setTrackId] = useState(null); // Track the current trackId with state

    const query1Results = useQuery(queries.GET_SPOTIFY_CURRENTLY_PLAYING, {
        variables: {
            id: user._id
        },
        pollInterval: 30 * 1000
    });

    useEffect(() => {
        // Set the trackId when the data changes
        if (query1Results.data && query1Results.data.getSpotifyCurrentlyPlaying) {
            const newTrackId = query1Results.data.getSpotifyCurrentlyPlaying.item.id;
            setTrackId(newTrackId);
        }
    }, [query1Results.data]);

    const query2Results = useQuery(queries.GET_SPOTIFY_TRACK_AUDIO_FEATURES, {
        variables: {
            id: user._id,
            trackId
        },
        skip: !trackId,
        pollInterval: 0
    });

    let chartData;
    if (query2Results.data && query1Results.data.getSpotifyCurrentlyPlaying) {

        let CPResults = query1Results.data.getSpotifyCurrentlyPlaying;
        let songName = CPResults.item.name;
        let artistName = CPResults.item.artists.map(artist => artist.name).join(', ');
        let audioFeatures = query2Results.data.getSpotifyTrackAudioFeatures;
        chartData = {
            options: {
                chart: {
                    id: "basic-bar"
                },
                fill: {
                    colors: "#1DB954"
                },
                xaxis: {
                    categories: [
                        "Acousticness",
                        "Danceability",
                        "Energy",
                        "Instrumentalness",
                        "Liveness",
                        "Speechful",
                        "Valence"
                    ],
                    labels: {
                        style: {
                            colors : "#1DB954"
                        }
                    }
                },
                yaxis: {
                    min: 0,
                    max: 1
                },
                title: {
                    text: songName + " by " + artistName,
                    style: {
                        color: "#1DB954"
                    }
                }
            },
            series: [
                {
                    name: songName,
                    data: [
                        audioFeatures.acousticness,
                        audioFeatures.danceability,
                        audioFeatures.energy,
                        audioFeatures.instrumentalness,
                        audioFeatures.liveness,
                        audioFeatures.speechiness,
                        audioFeatures.valence,
                    ]
                }
            ]
        };
    }

    return (
        <div id="Chart-div">
            {!props.hideInfo && <button className="info-button" onClick={() => {location.href=`/track/${query1Results.data.getSpotifyCurrentlyPlaying.item.id}`}}>i</button>}
            <h1>CHART</h1>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {query1Results.data && query2Results && chartData && (
                    <Chart
                        options={chartData.options}
                        series={chartData.series}
                        type="bar"
                        width="700"
                    />
                )}
                { !chartData && <>
                    <p>No track currently playing!</p>
                </>}
            </div>
        </div>
    );
}
