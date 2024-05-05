import { CookiesProvider, useCookies } from 'react-cookie';
export function Header(props) {
    
    const [cookies, setCookie] = useCookies(['user'])

    let user = cookies.user
    
    return (
        <div id="header">

            {user && 
                <div>
                    <span><a>PROFILE PICTURE</a></span>
                    <span id="Login-Logout-button"><button>Logout</button></span>
                </div>
            }

            {!user &&
                <button id="Login-Logout-button">Login/Signup</button>    
            }
        </div>
    )
}