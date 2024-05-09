import { CookiesProvider, useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
export function Header({ logout }) {
    
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    let user = cookies.user;
    console.log("user: ", user)
    return (
        <div id="header">
            {user && 
                <div>
                    { user.profile_picture && user.profile_picture.length ?
                        <div id="pfp-div"><img 
                            src={ user.profile_picture[0].url }
                            alt="Your profile picture"
                        /></div> :
                        <div id="pfp-div"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png"></img></div>
                    }
                    { user.username && 
                        <p id="username-header"><Link to={`/user/${user._id}`}>{user.username}</Link></p>
                    }
                    <span id="Login-Logout-button">
                        <button onClick={logout}>Logout</button>
                    </span>
                    <form action="/" method="get">
                        <button id="Home-button">Home</button>
                    </form>
                    <form action="/explain" method="get">
                        <button id="Explain-button">What do all these stats mean?</button>
                    </form>
                </div>
            }
            {!user &&
                <button id="Login-Logout-button">Login/Signup</button>    
            }
        </div>
    );
}