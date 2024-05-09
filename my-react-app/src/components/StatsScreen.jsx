import { GenreInfo } from "./GenreInfo";
import { SocialHub } from "./SocialHub";
import { CenterView } from "./CenterView";

export function StatsScreen() {
  return (
    <div id="Stat-screen-main-div">
      <div className="side-div">
        <GenreInfo hideInfo={false} />
      </div>

      <div className="center-div" id="therealcenterdiv">
        <CenterView />
      </div>

      <div className="side-div">
        <SocialHub hideInfo={false} />
      </div>
    </div>
  );
}
