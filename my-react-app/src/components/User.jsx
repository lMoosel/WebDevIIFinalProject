import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation } from '@apollo/client';
import queries from '../graphQL/index.js';  
import { useCookies } from 'react-cookie';
import Chart from "react-apexcharts";
import { TopInfo } from './TopInfo.jsx';

export function User(props) {
    const [cookies] = useCookies(['user']);
    const user = cookies.user;
    const {userid} = useParams();
    let compare = false;
    let isFriend = false;
    let friendRequest = false;

    // I Should use useLazyQuery but I could not get everything working together
    const { data: userData, loading: userLoading, error: userError } = useQuery(queries.GET_USER, {
        variables: {
            id: user._id,
        }
    });

    const { data: friendData, loading: friendLoading, error: friendError, refetch } = useQuery(queries.GET_USER, {
        variables: {
            id: userid,
        }
    });

    const { data: userStatsData, loading: userStatsLoading, error: userStatsError } = useQuery(queries.GET_USER_STATS, {
        variables: {
            id: user._id,
        }
    });

    const { data: friendStatsData, loading: friendStatsLoading, error: friendStatsError } = useQuery(queries.GET_USER_STATS, {
        variables: {
            id: userid,
        }
    });

    const { data: onlineFriendsData, loading: onlineFriendsLoading, error: onlineFriendsError } = useQuery(queries.GET_ONLINE_FRIENDS, {
        variables: {
            id: user._id,
        }
    });

    const [sendFriendRequestMutation] = useMutation(queries.SEND_FRIEND_REQUEST);

    const sendFriendRequest = async (friendid) => {
        try {
            await sendFriendRequestMutation({
                variables: {
                    userId: user._id,
                    friendId: friendid
                }
            });
            alert("Friend request has been sent!")
            refetch();
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    if (userLoading || friendLoading || userStatsLoading || friendStatsLoading || onlineFriendsLoading) return <p>Loading...</p>;
    if (userError || friendError || userStatsError || friendStatsError || onlineFriendsError) return <p>404 Error : Please try again</p>;

    let userInfo, userStats, friendInfo, friendStats, onlineFriend;

    userInfo = userData?.getUser;
    userStats = userStatsData?.getUserStats;
    friendInfo = friendData?.getUser;
    friendStats = friendStatsData?.getUserStats;
    onlineFriend = onlineFriendsData?.getOnlineFriends.find(friend => friend._id === userid);

    // Visiting not your own user page
    if (userid !== user._id) {
        compare = true;
    }

    // Visiting not your friend page
    if (userInfo.friends.some(id => id === userid)) {
        isFriend = true;
    }

    // Sent request already
    if (friendInfo.friendRequests.some(id => id === user._id)) {
        friendRequest = true;
    }

    let userChartData = {
        options: {
            chart: {
                id: "basic-bar"
            },
            fill: {
                colors: "#1DB954"
            },
            xaxis: {
                categories: [
                    "Acousticness",
                    "Danceability",
                    "Energy",
                    "Instrumentalness",
                    "Liveness",
                    "Mode",
                    "Speechful",
                    "Valence"
                ],
                labels: {
                    style: {
                        colors : "#1DB954"
                    }
                }
            },
            yaxis: {
                min: 0,
                max: 1,
                labels: {
                    style: {
                        colors: "#1DB954"
                    },
                    formatter: function (val) { // Custom formatter for y-axis labels
                        return val.toFixed(2); // Format labels to two decimal places
                    }
                }
            },
            title: {
                text: userInfo.username + "'s Stats",
                style: {
                    color: "#1DB954"
                }
            },
            dataLabels: {
                enabled: false
            }
        },
        series: [
            {
                data: [
                    userStats.acousticness,
                    userStats.danceability,
                    userStats.energy,
                    userStats.instrumentalness,
                    userStats.liveness,
                    userStats.mode,
                    userStats.speechiness,
                    userStats.valence
                ]
            }
        ]
    };

    let friendChartData = {
        options: {
            chart: {
                id: "basic-bar"
            },
            fill: {
                colors: "#1DB954"
            },
            xaxis: {
                categories: [
                    "Acousticness",
                    "Danceability",
                    "Energy",
                    "Instrumentalness",
                    "Liveness",
                    "Mode",
                    "Speechful",
                    "Valence"
                ],
                labels: {
                    style: {
                        colors : "#1DB954"
                    }
                }
            },
            yaxis: {
                min: 0,
                max: 1,
                labels: {
                    style: {
                        colors: "#1DB954"
                    },
                    formatter: function (val) { // Custom formatter for y-axis labels
                        return val.toFixed(2); // Format labels to two decimal places
                    }
                }
            },
            title: {
                text: friendInfo.username + "'s Stats",
                style: {
                    color: "#1DB954"
                }
            },
            dataLabels: {
                enabled: false
            }
        },
        series: [
            {
                data: [
                    friendStats.acousticness,
                    friendStats.danceability,
                    friendStats.energy,
                    friendStats.instrumentalness,
                    friendStats.liveness,
                    friendStats.mode,
                    friendStats.speechiness,
                    friendStats.valence
                ]
            }
        ]
    };

    return (
        <div className="user-container">
            <div className="user-info">
                <h1>User Information</h1>
                <p>Username: {userInfo.username}</p>
                <TopInfo userId={user._id} />
                <p>Tempo: {userStats.tempo}</p>
                <p>Duration (ms): {userStats.duration_ms}</p>
                <p>Loudness (dB): {userStats.loudness}</p>
                <p>Key: {userStats.key}</p>
                <p>Time Signature: {userStats.time_signature}</p>
                {userChartData && (
                    <Chart
                        options={userChartData.options}
                        series={userChartData.series}
                        type="bar"
                        width="400"
                        height="400"
                    />
                )}
            </div>
            {compare && (
                <div className="friend-info">
                    <h1>Other User Information</h1>
                    <p>Username: {friendInfo.username}</p>
                    <TopInfo userId={userid} />
                    <p>Tempo: {friendStats.tempo}</p>
                    <p>Duration (ms): {friendStats.duration_ms}</p>
                    <p>Loudness (dB): {friendStats.loudness}</p>
                    <p>Key: {friendStats.key}</p>
                    <p>Time Signature: {friendStats.time_signature}</p>
                    {isFriend && (
                    <Chart
                        options={friendChartData.options}
                        series={friendChartData.series}
                        type="bar"
                        width="400"
                        height="400"
                    />
                    )}
                    {!isFriend && <>
                        <h1>You have to be friends to view their chart!</h1>
                        {!friendRequest && <>
                            <FriendRequest 
                                name={friendInfo.username}
                                _id={friendInfo._id}
                                sendFriendRequest={sendFriendRequest}
                            />
                        </>}
                    </>}
                </div>
            )}
        </div>
    );
}

function FriendRequest(props) {
    return (
        <div className="suggested-friend friend-request"> 
            <span className="request-span"><button onClick={() => props.sendFriendRequest(props._id)}>Send Request</button></span>
        </div>
    )
}