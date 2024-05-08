import {useQuery, useMutation} from '@apollo/client';

import queries from "../graphQL/index.js";

function DeleteUser (props) {
    
    let { user, logoutFunc } = props;

    const [deleteUserMutation] = useMutation(queries.DELETE_USER);

    const onSubmitDeleteArtist = (e) => {
        e.preventDefault();
        let confirmR = confirm("Are you sure you want to delete your user (deactivating your account)? This effect is permanent!");
        if (!confirmR) return;
        let r = deleteUserMutation({
            variables: {
                _id: user._id
            }
        });
        logoutFunc();
        alert("User has been deleted.");
    }

    return (
        <div>
            <h1>Delete User</h1>
            <form className="form" id="deleteUserForm" onSubmit={onSubmitDeleteArtist}>
                <button className='button add-button' type='submit'>Delete</button>
            </form>
        </div>
    );

}

export default DeleteUser;