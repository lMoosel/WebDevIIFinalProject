import { CookiesProvider, useCookies } from 'react-cookie';
import { useQuery, useMutation } from '@apollo/client';
import queries from '../graphQL/index.js';
import mutations from '../graphQL/index.js';

export function SocialHub(props) {
    const [cookies, setCookie] = useCookies(['user']);
    const userid = cookies.user._id;

    const { data: userData, loading: userLoading, error: userError } = useQuery(queries.GET_USER, {
        variables: { id: userid }
    });

    const { data: onlineFriendsData, loading: onlineFriendsLoading, error: onlineFriendsError } = useQuery(queries.GET_ONLINE_FRIENDS, {
        variables: { id: userid },
        pollInterval: 30000
    });

    const { data: suggestedFriendsData, loading: suggestedFriendsLoading, error: suggestedFriendsError } = useQuery(queries.GET_SUGGESTED_FRIENDS, {
        variables: { id: userid }
    });

    const [sendFriendRequestMutation] = useMutation(mutations.SEND_FRIEND_REQUEST);
    
    const sendFriendRequest = async (friendid) => {
        try {
            await sendFriendRequestMutation({
                variables: {
                    userId: userid,
                    friendId: friendid
                }
            });
            console.log('Friend request sent successfully');
            // Optionally, you can update your UI to reflect the sent friend request
        } catch (error) {
            console.error('Error sending friend request:', error);
            // Handle error accordingly
        }
    };

    if (userLoading || onlineFriendsLoading || suggestedFriendsLoading) {
        return <p>Loading...</p>;
    }
    if (userError || onlineFriendsError || suggestedFriendsError) {
        return <p>Error: Please try again</p>;
    }

    return (
        <div id="Social-hub-div">
            {!props.hideInfo && <button className="info-button" onClick={() => {location.href="/socialhub"}}>i</button>}
            <h1>SOCIAL HUB</h1>

            <h3>Online Friends:</h3>
            {
                onlineFriendsData?.getOnlineFriends.map((friend, index) => (
                    <OnlineFriend key={index} name={friend.username} currentSong={friend.track_name} />
                ))
            }

            <h3>Incoming Friend requests:</h3>
            {
                userData?.getUser.friendRequests.map((friend, index) => (
                    <FriendRequest key={index} name={friend}/>
                ))
            }

            <h3>Suggested Friends:</h3>
            {
                suggestedFriendsData?.getSuggestedFriends.map((friend, index) => (
                    <SuggestedFriend 
                        key={index}
                        name={friend.username}
                        _id={friend._id}
                        sendFriendRequest={sendFriendRequest}/>
                ))
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
            <span><button onClick={() => props.sendFriendRequest(props._id)}>Send Request</button></span>
        </div>

    )
}