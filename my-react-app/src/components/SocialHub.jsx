export function SocialHub(props) {

    let onlineFriends = [{name:"Charles", currentSong:"N/A"}, {name:"Luke", currentSong:"Song"}, {name:"Alex", currentSong:"Other Song"}]
    let friendRequests = [{name:"Olivia"}]
    let suggestedFriends = [{name:"Zack"}]

    return (
        <div id="Social-hub-div">
            {!props.hideInfo && <button className="info-button" onClick={() => {location.href="/socialhub"}}>i</button>}
            <h1>SOCIAL HUB</h1>

            <h3>Online Friends:</h3>
            {
                onlineFriends.map((friend, index) => {
                    return( <OnlineFriend key={index} name={friend.name} currentSong={friend.currentSong} /> )
                })
            }

            <h3>Incoming Friend requests:</h3>
            {
                friendRequests.map((friend, index) => {
                    return (<FriendRequest key={index} name={friend.name}/>)
                })
            }

            <h3>Suggested Friends:</h3>
            {
                suggestedFriends.map((friend, index) => {
                    return(
                    <SuggestedFriend key={index} name={friend.name}/>
                    )
                })
            }
        </div>
    )
}

function FriendRequest(props) {
    return (
    <div className="friend-request">
        <span className="request-span"><a>{props.name}</a></span>
        <span className="request-span"><button id="accept-request">Accept</button></span>
        <span className="request-span"><button id="decline-request">Decline</button></span>
    </div>
    )
}

function OnlineFriend(props) {
    return(
        <div className="online-friend friend-request">
            <a>{props.name}</a>
            <a>{props.currentSong}</a>
        </div>
    )
}

function SuggestedFriend(props) {
    return (
        <div className="suggested-friend friend-request"> 
            <span><a>{props.name}</a></span>
            <span><button>Send Request</button></span>
        </div>

    )
}