import axios from "axios";

export const getCurrentSong = () => {
    //https://developer.spotify.com/documentation/web-api/reference/get-information-about-the-users-current-playback
    return false;
}

export const getFavoriteAlbums = () => {
    //No Explicit API
    return true
}

export const getFavoriteGenres = () => {
    //No Explicit API
    return null
}

export const getFavoriteArtists = () => {
    //https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
    return null
}

export const getFavoriteSongs = () => {
    //https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
    return null
}

export const getAverageListeningSession = () => {
    //Not sure if this one is possible
    return null
}