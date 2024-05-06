import { useNavigate } from "react-router-dom";
import { useQuery } from '@apollo/client';
import queries from '../graphQL/index.js';  
import { CookiesProvider, useCookies } from 'react-cookie';

export function GenreInfo(props) {

    const [cookies, setCookie] = useCookies(['user']);
    let user = cookies.user

    let data_tracks; let data_artists;
    let loading_tracks; let loading_artists;

    if(true) { //Im sure there is a better way to do this but it works
        const { data, loading, error } = useQuery(queries.GET_SPOTIFY_TOP_TRACKS, 
            {
                variables: {
                    id: user._id,
                    timeRange: "short_term",
                    offset: 0,
                    limit: 5
                }
            });
        
        if(!loading) {
            data_tracks = data;
            loading_tracks = loading;
            console.log("top tracks: ", data_tracks)

        }
    }

    if(true) {
        const {data, loading, error} = useQuery(queries.GET_SPOTIFY_TOP_ARTISTS, 
            {
            variables: {
                id: user._id,
                timeRange: "short_term",
                offset: 0,
                limit: 5
            }
        })

        if(!loading) {
            data_artists = data
            loading_artists = loading;
            console.log("top artists: ", data_artists)
        }
    }

    data_artists = {items: [{"name":"blur"}, {"name":"Arctic Monkeys"}]}
    data_tracks = {items: [{"name":"The Narcissist"}, {"name":"The Jeweller's Hands"}]}


    return(
        <div id="Genre-info-div">
            {!props.hideInfo && <button className="info-button" onClick={() => {location.href="/topcategories"}}>i</button>}
            <h1>Your Favorties</h1>

            <h3>Top Songs:</h3>
            {!loading_tracks && 
                data_tracks.items.map((song) => {
                    return (
                        <div key={song.name}>
                            {song.name}
                        </div>
                    )
                })
            }

            <h3>Top Artists:</h3>
            {!loading_tracks && 
                data_artists.items.map((artist) => {
                    return (
                        <div key={artist.name}>
                            {artist.name}
                        </div>
                    )
                })   
            }
            

            <h3>Top Genres:</h3>
            {
                <div className="top-info-div" id="top-genres">
                    WIP
                </div>
            }
            <h3>Top Albums:</h3>
            {
                 <div className="top-info-div" id="top-albums">
                    WIP
                 </div>
            }
        </div>
    )
}