import { CookiesProvider, useCookies } from 'react-cookie';
import { useQuery, useMutation } from '@apollo/client';
import queries from '../graphQL/index.js';
import { Link } from 'react-router-dom';

export function SocialHub(props) {
    const [cookies, setCookie] = useCookies(['user']);
    const userid = cookies.user._id;

    const { data: friendRequestsData, loading: friendRequestsLoading, error: friendRequestsError, refetch: refreshFriendRequestsData } = useQuery(queries.GET_FRIEND_REQUESTS, {
        variables: { id: userid }
    });

    const { data: onlineFriendsData, loading: onlineFriendsLoading, error: onlineFriendsError, refetch: refreshOnlineFriendsError } = useQuery(queries.GET_ONLINE_FRIENDS, {
        variables: { id: userid },
        pollInterval: 30000
    });

    const { data: suggestedFriendsData, loading: suggestedFriendsLoading, error: suggestedFriendsError, refetch: refreshSuggestedFriends } = useQuery(queries.GET_SUGGESTED_FRIENDS, {
        variables: { id: userid }
    });

    const [sendFriendRequestMutation] = useMutation(queries.SEND_FRIEND_REQUEST);
    
    const sendFriendRequest = async (friendid) => {
        try {
            await sendFriendRequestMutation({
                variables: {
                    userId: userid,
                    friendId: friendid
                }
            });
            console.log('Friend request sent successfully');
            alert("Friend request has been sent!")
            refreshSuggestedFriends();
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    const [handleFriendRequestMutation] = useMutation(queries.HANDLE_FRIEND_REQUEST);
    
    const handleFriendRequest = async (friendid, action) => {
        console.log(friendid)
        console.log(action)
        try {
            await handleFriendRequestMutation({
                variables: {
                    userId: userid,
                    friendId: friendid,
                    action: action
                }
            });
            refreshSuggestedFriends();
            refreshFriendRequestsData();
            refreshOnlineFriendsError();
        } catch (error) {
            console.error('Error handling friend request:', error);
        }
    };

    if (friendRequestsLoading || onlineFriendsLoading || suggestedFriendsLoading) {
        return <p>Loading...</p>;
    }
    if (friendRequestsError || onlineFriendsError || suggestedFriendsError) {
        return <p>Error: Please try again</p>;
    }

    return (
        <div id="Social-hub-div">
            {!props.hideInfo && <button className="info-button" onClick={() => {location.href="/socialhub"}}>i</button>}
            <h1>SOCIAL HUB</h1>

            <h3>Online Friends:</h3>
            {
                onlineFriendsData?.getOnlineFriends.map((friend, index) => (
                    <OnlineFriend 
                        key={index}
                        name={friend.username}
                        currentSong={friend.track_name} 
                        songId={friend.trackid}/>
                ))
            }

            <h3>Incoming Friend Requests:</h3>
            {
                friendRequestsData?.getFriendRequests.map((friend, index) => (
                    <FriendRequest 
                        key={index}
                        name={friend.username}
                        _id={friend._id}
                        handleFriendRequest={handleFriendRequest}
                    />
                ))
            }

            <h3>Suggested Friends:</h3>
            {
                suggestedFriendsData?.getSuggestedFriends.map((friend, index) => (
                    <SuggestedFriend 
                        key={index}
                        name={friend.username}
                        _id={friend._id}
                        sendFriendRequest={sendFriendRequest}
                    />
                ))
            }
        </div>
    )
}

function FriendRequest(props) {
    return (
    <div className="friend-request">
        <span className="request-span"><a>{props.name}</a></span>
        <span className="request-span"><button id="accept-request" onClick={() => props.handleFriendRequest(props._id, "accept")}>Accept</button></span>
        <span className="request-span"><button id="decline-request" onClick={() => props.handleFriendRequest(props._id, "reject")}>Reject</button></span>
    </div>
    )
}

function OnlineFriend(props) {
    return(
        <div className="online-friend friend-request">
            <a>{`${props.name} is currently listening to`} <Link to={`/track/${props.songId}`}>{props.currentSong}</Link> </a>
        </div>
    )
}

function SuggestedFriend(props) {
    return (
        <div className="suggested-friend friend-request"> 
            <span><a>{props.name}</a></span>
            <span className="request-span"><button onClick={() => props.sendFriendRequest(props._id)}>Send Request</button></span>
        </div>

    )
}