import { Link, useNavigate } from "react-router-dom";

export function Chart(props) {
    return (
        <div id="Chart-div">
             {!props.hideInfo && <button className="info-button" onClick={() => {location.href="/chart"}}>i</button>}
            <h1>CHART</h1>

            <button onClick={() => {setCookie('user', "Success", {path: '/'})}}>TEST COOKIES</button>
        </div>
    )
}