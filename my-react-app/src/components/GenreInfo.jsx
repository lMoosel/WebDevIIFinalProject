import { useNavigate } from "react-router-dom";

export function GenreInfo(props) {
    return(
        <div id="Genre-info-div">
            {!props.hideInfo && <button className="info-button" onClick={() => {location.href="/topcategories"}}>i</button>}
            <h1>TOP CATEGORY</h1>
        </div>
    )
}