import { GenreInfo } from "./GenreInfo"
import { ChartComponent } from "./Chart"
import { SocialHub } from "./SocialHub"
import { CurrentSong } from "./CurrentSong"

export function StatsScreen() {
    return (
        <>
        <div id="Stat-screen-main-div">
            <span className="side-span"><GenreInfo hideInfo={false} /></span>
            <span className="center-span"><ChartComponent hideInfo={false} /></span>
            <span className="side-span"><SocialHub hideInfo={false} /></span>
        </div>
        </>
    )
    
}
