import { useState } from "react";
import { CookiesProvider, useCookies } from "react-cookie";
import { useLazyQuery } from "@apollo/client";
import queries from "../graphQL/index.js";
import { Link } from "react-router-dom";

export function Search(props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [cookies, setCookie] = useCookies(["user"]);
  const userid = cookies.user._id;
  const [
    getSpotifySearch,
    { loading: spotifyLoading, error: spotifyError, data: spotifyData },
  ] = useLazyQuery(queries.GET_SPOTIFY_SEARCH);
  const [
    getUserSearch,
    { loading: userLoading, error: userError, data: userData },
  ] = useLazyQuery(queries.SEARCH_USERS_BY_NAME);

  if (spotifyError || userError) {
    console.log(spotifyError);
    console.log(userError);
    return `An error has occurred while searching`;
  }

  const spotifySearch = (query) => {
    if (query)
      getSpotifySearch({
        variables: {
          id: userid,
          query: query,
          type: ["artist", "track", "album"],
          limit: 10,
          offset: 0,
        },
      });
  };

  const userSearch = (query) => {
    getUserSearch({ variables: { query: query } });
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(e.target.value);
    spotifySearch(query);
    userSearch(query);
  };

  return (
    <div id="search-area">
      <h1>Search</h1>
      <form>
        <label>
          Search:
          <input type="text" onChange={handleSearchChange} />
        </label>
      </form>

      {userLoading ? (
        <p>Loading Users Response ...</p>
      ) : (
        userData && (
          <div id="search-user-results">
            {userData.searchUsersByName && (
              <div>
                <h3>Users</h3>
                <ul>
                  {userData.searchUsersByName.map((user) => (
                    <li key={user._id}>
                      <div>
                        <Link to={`/user/${user._id}`}>{user.username}</Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      )}

      {spotifyLoading ? (
        <p>Loading Spotify Response ...</p>
      ) : (
        spotifyData && (
          <div id="search-spotify-results">
            {spotifyData.getSpotifySearch.tracks && (
              <div id="tracks-result">
                <h3>Tracks</h3>
                <ul>
                  {spotifyData.getSpotifySearch.tracks.items.map((item) => (
                    <li key={item.id}>
                      <Link to={`/track/${item.id}`}>{item.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {spotifyData.getSpotifySearch.albums && (
              <div id="albums-result">
                <h3>Albums</h3>
                <ul>
                  {spotifyData.getSpotifySearch.albums.items.map((item) => (
                    <li key={item.id}>
                      <Link to={`/album/${item.id}`}>{item.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {spotifyData.getSpotifySearch.artists && (
              <div id="artists-result">
                <h3>Artists</h3>
                <ul>
                  {spotifyData.getSpotifySearch.artists.items.map((item) => (
                    <li key={item.id}>
                      <Link to={`/artist/${item.id}`}>{item.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
