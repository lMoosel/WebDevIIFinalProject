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
        <span className="center-span">
          <ChartComponent hideInfo={false} />
        </span>
      )}

      {centerView === "search" && (
        <span className="center-span">
          <Search hideInfo={false} />
        </span>
      )}
    </div>
  );
}
