import { GenreInfo } from "./GenreInfo"
import { Chart } from "./Chart"
import { SocialHub } from "./SocialHub"

export function StatsScreen() {

    return (
        <div id="Stat-screen-main-div">
            <span><GenreInfo/></span>
            <span><Chart/></span>
            <span><SocialHub/></span>
        </div>
    )
    
}
