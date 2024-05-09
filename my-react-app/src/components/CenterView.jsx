import { useState } from "react";
import { Search } from "./Search";
import { ChartComponent } from "./Chart";

export function CenterView() {
  const [centerView, setCenterView] = useState("chart");

  const toggleCenterView = () => {
    if (centerView === "chart") setCenterView("search");
    else if (centerView == "search") setCenterView("chart");
  };
  return (
    <div id="center-view">
      <button onClick={toggleCenterView}>Chart/Search</button>

      {centerView === "chart" && (
        <div className="center-div">
          <ChartComponent hideInfo={false} />
        </div>
      )}

      {centerView === "search" && (
        <div className="center-div">
          <Search hideInfo={false} />
        </div>
      )}
    </div>
  );
}
