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
                <>
                    { user.profile_picture && user.profile_picture.length ?
                        <span>
                            <span id="pfp-div"><img 
                                src={ user.profile_picture[0].url }
                                alt="Your profile picture"
                            /></span></span> :
                            <span><span id="pfp-div"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png"></img></span></span>
                        
                    }
                    { user.username && 
                        <span><a id="username-header"><Link to={`/user/${user._id}`}>{user.username}</Link></a></span>
                    }
                    <span id="header-buttons">
                        <span id="Login-Logout-button">
                            <button onClick={logout}>Logout</button>
                        </span>
                        <span id="Home-button">
                            <button><Link to={`/`}>Home</Link></button>
                        </span>
                        <span id="Explain-button">
                            <button><Link to={`/explain`}>What do all these stats mean?</Link></button>
                        </span>
                    </span>
                </>
            }
            {!user &&
                <button id="Login-Logout-button">Login/Signup</button>    
            }
        </div>
    );
}