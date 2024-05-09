import { GenreInfo } from "./GenreInfo";
import { SocialHub } from "./SocialHub";
import { CenterView } from "./CenterView";

export function StatsScreen() {
  return (
    <div id="Stat-screen-main-div">
      <span className="side-span">
        <GenreInfo hideInfo={false} />
      </span>

      <span className="center-span" id="therealcenterspan">
        <CenterView />
      </span>

      <span className="side-span">
        <SocialHub hideInfo={false} />
      </span>
    </div>
  );
}
