import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import queries from "../graphQL/index.js";
import { CookiesProvider, useCookies } from "react-cookie";
function Callback() {
  const navigate = useNavigate();
  const [
    authorizeSpotify,
    { data: spotifyData, loading: spotifyLoading, error: spotifyError },
  ] = useMutation(queries.AUTHORIZE_SPOTIFY);
  const [
    createUser,
    { data: userData, loading: userLoading, error: userError },
  ] = useMutation(queries.CREATE_USER);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [cookies, setCookie] = useCookies(["user"]);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");
    const state = params.get("state");
    if (error) {
      console.error("Spotify authentication error:", error);
      navigate("/error");
      return;
    }
    if (state && code) {
      setCode(code);
      authorizeSpotify({
        variables: { code: code },
      })
        .then(() => {
          console.log("Authorization successful");
          setIsAuthorized(true);
        })
        .catch((err) => {
          console.error("Error processing authorization:", err);
        });
    }
  }, [authorizeSpotify, navigate]);
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    createUser({
      variables: {
        password: password,
        code: code,
      },
    })
      .then((response) => {
        console.log("User creation successful");
        if (response.data.createUser) {
          delete response.data.createUser.friends;
          delete response.data.createUser.friendRequests;
          setCookie("user", response.data.createUser, { path: "/" });
          navigate("/");
        } else {
          console.error("Error: No user data returned");
        }
      })
      .catch((err) => {
        console.error("Error creating user:", err);
      });
  };
  if (spotifyLoading || userLoading) return <p>Loading...</p>;
  if (spotifyError) return <p>Error: {spotifyError.message}</p>;
  if (isAuthorized && spotifyData) {
    const { display_name, email, images } = spotifyData.authorizeSpotify;
    return (
      <div>
        <h1>Authorization Successful</h1>
        {images.length > 0 && (
          <div id="pfp-div-but-relative">
            <img
              src={images[0].url}
              alt="Profile"
              width={images[0].width}
              height={images[0].height}
            />
          </div>
        )}
        <p>Welcome {display_name}!</p>
        <p>Email: {email}</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="password">Create a password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <button type="submit">Submit</button>
          {userError && <p>Error: {userError.message}</p>}
        </form>
      </div>
    );
  }
  return <div>Processing Spotify authentication...</div>;
}
export default Callback;

