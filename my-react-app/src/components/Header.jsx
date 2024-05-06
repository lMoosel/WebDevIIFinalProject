import { CookiesProvider, useCookies } from 'react-cookie';
export function Header(props) {
    
    const [cookies, setCookie] = useCookies(['user']);

    let user = cookies.user;
    
    console.log("user: ", user)

    return (
        <div id="header">

            {user && 
                <div>
                    {/* <span><a>PROFILE PICTURE</a></span> */}
                    { user.profile_picture && user.profile_picture.length ?
                        <div id="pfp-div"><img 
                            src={ user.profile_picture[0].url }
                            alt="Your profile picture"
                        /></div> :
                        <div id="pfp-div"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png"></img></div>
                    }
                    { user.username && 
                        <a id="username-header">{user.username}</a>
                    }
                    <span id="Login-Logout-button">
                        <button>Logout</button>
                    </span>
                </div>
            }

            {!user &&
                <button id="Login-Logout-button">Login/Signup</button>    
            }
        </div>
    );
}