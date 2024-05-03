import { GenreInfo } from "./GenreInfo"
import { Chart } from "./Chart"
import { SocialHub } from "./SocialHub"
import { CurrentSong } from "./CurrentSong"

export function StatsScreen() {

    return (
        <>
        <div id="Stat-screen-main-div">
            <span class="side-span"><GenreInfo/></span>
            <span class="center-span"><Chart/></span>
            <span class="side-span"><SocialHub/></span>
            <CurrentSong/>
        </div>
        </>
    )
    
}
