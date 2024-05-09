import { CookiesProvider, useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export function Header({ logout }) {
    
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    let user = cookies.user;
    const navigate = useNavigate()
    return (
        <div id="header">
            {user && 
                <>
                    { user.profile_picture && user.profile_picture.length ?
                        <span id="pfp-div"><img 
                            src={ user.profile_picture[0].url }
                            alt="Your profile picture"
                        /></span> :
                        <span id="pfp-div">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png"
                                alt="Default Pfp"
                            />
                        </span>
                    }
                    { user.username && 
                        <span><p id="username-header"><Link to={`/user/${user._id}`}>{user.username}</Link></p></span>
                    }
                    <span id="header-buttons">
                        <span id="Login-Logout-button">
                            <button onClick={logout}>Logout</button>
                        </span>
                        <button id="Home-button" onClick={() => navigate("/")}>
                            Home
                        </button>
                        <button id="Explain-button" onClick={() => navigate("/explain")}>
                            What Do All These Stats Mean?
                        </button>
                    </span>
                </>
            }
            {!user &&
                <button id="Login-Logout-button">Login/Signup</button>    
            }
        </div>
    );
}

