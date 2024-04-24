
import { v4 as uuidv4 } from 'uuid';
//For reference https://developer.spotify.com/documentation/web-api/tutorials/code-flow

//TODO maybe put this in the .env too since the port can change
var redirect_uri = 'http://localhost:5173/callback'

//Generates an authentication URL that we will route the user to when they are trying to connect their spotify accounts
function getAuthUrl() {
    const state = uuidv4()
    const scope = 'user-read-private user-read-email';
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const redirectUri = redirect_uri;

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectUri,
        state: state
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
}
//Takes in code which will be given once they have completed the authentication process
function codeForToken(code) {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirectUri = redirect_uri;
    const params = new URLSearchParams({
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
    });
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: params,
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
        },
        json: true
    };
    return authOptions;
}
function refreshForToken(refresh_token) {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const params = new URLSearchParams({
        refresh_token: refresh_token,
        grant_type: 'refresh_token'
    });
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: params,
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
        },
        json: true
    };
    return authOptions;
}

export {getAuthUrl, codeForToken, refreshForToken};