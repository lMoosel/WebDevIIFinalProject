import { Link, useNavigate } from "react-router-dom";
// import ApexCharts from 'apexcharts';
import Chart from "react-apexcharts";
import { CookiesProvider, useCookies } from 'react-cookie';
import { useQuery } from '@apollo/client';
import queries from '../graphQL/index.js';

export function ChartComponent (props) {

    const [cookies, setCookie] = useCookies(['user']);
    let user = cookies.user;

    let query1Results, query2Results;

    query1Results = useQuery(queries.GET_SPOTIFY_CURRENTLY_PLAYING, {
        variables: {
            id: user._id
        },
        pollInterval: 30 * 1000
    });

    let trackId = query1Results?.data?.getSpotifyCurrentlyPlaying?.item?.id;

    query2Results = useQuery(queries.GET_SPOTIFY_TRACK_AUDIO_FEATURES, {
        variables: {
            id: user._id,
            trackId
        },
        skip: !trackId,
        pollInterval: 0
    });

    console.log(query1Results, query2Results);

    // if (query1Results && query1Results.data && query1Results.data.getSpotifyCurrentlyPlaying) {
        
    // } else {
    //     query2Results = null;
    // }

    let chartData;
    if (query2Results?.data) {
        chartData = {
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
                    name: query1Results.data.getSpotifyCurrentlyPlaying.item.name,
                    data: [30, 40, 45, 50, 49, 60, 70, 91]
                }
            ]
        };
    }


    return (
        <div id="Chart-div">
             {!props.hideInfo && <button className="info-button" onClick={() => {location.href="/chart"}}>i</button>}
            <h1>CHART</h1>

            { chartData && <Chart
                options={chartData.options}
                series={chartData.series}
                type="bar"
                width="500"
            /> }
            { !chartData && <>
                <p>No track currently playing!</p>
            </>}

        </div>
    );
}