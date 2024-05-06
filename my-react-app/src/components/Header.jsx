import { CookiesProvider, useCookies } from 'react-cookie';
export function Header(props) {
    
    const [cookies, setCookie] = useCookies(['user']);

    let user = cookies.user;
    
    return (
        <div id="header">

            {user && 
                <div>
                    {/* <span><a>PROFILE PICTURE</a></span> */}
                    { user.profile_picture && user.profile_picture.length ?
                        <img 
                            src={ user.profile_picture[0].url }
                            alt="Your profile picture"
                        /> :
                        <span><a>No profile picture found...</a></span>
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