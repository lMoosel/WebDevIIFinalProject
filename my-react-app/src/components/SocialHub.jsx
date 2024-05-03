export function SocialHub(props) {
    return (
        <div id="Social-hub-div">
            <h1>SOCIAL HUB</h1>
            <FriendRequest/>
            <FriendRequest/>
            <FriendRequest/>
            <FriendRequest/>
        </div>
    )
}

function FriendRequest(props) {
    return (
    <div class="friend-request">
        <span class="request-span"><a>DEMO DEMO DEMO</a></span>
        <span class="request-span"><button id="accept-request">Accept</button></span>
        <span class="request-span"><button id="decline-request">Decline</button></span>
    </div>
    )
}