import {useQuery, useMutation} from '@apollo/client';
import { CookiesProvider, useCookies } from 'react-cookie';

import queries from "../graphQL/index.js";

let isValidEmail = function (email) {
    let emailRegex =
    /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
    if (!emailRegex.test(email.toLowerCase())) {
        throw new Error("Email is in invalid format!");
    }
}

function validatePassword(password) {
    if (typeof password != "string") throw new Error("password must be a string!");
    password = password.trim();
    if (password.length < 8) throw new Error("Password must be at least 8 characters long.");
    if (!/[A-Z]/.test(password)) throw new Error("Password must contain at least one uppercase letter.");
    if (!/[0-9]/.test(password)) throw new Error("Password must contain at least one number.");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) throw new Error("Password must contain at least one special character.");
}

function EditUser (props) {

    const [cookies, setCookie] = useCookies(['user']);

    let { user } = props;

    const [editUserMutation] = useMutation(queries.EDIT_USER);

    const onSubmitEditArtist = async (e) => {
        e.preventDefault();
        let emailInput = document.getElementById("editUserEmailInput");
        let newPasswordInput = document.getElementById("editUserNewPasswordInput");
        let newEmail, newPassword;
        try {
            newEmail = emailInput.value.trim();
            isValidEmail(newEmail);
            newPassword = newPasswordInput.value;
            newPassword = newPassword.trim();
            validatePassword(newPassword);
        } catch (e) {
            console.log(e);
            alert(e);
            return;
        }
        let r = await editUserMutation({
            variables: {
                _id: user._id,
                newEmail,
                newPassword
            }
        });
        let newUserCookie = cookies.user;
        newUserCookie.email = newEmail;
        setCookie('user', newUserCookie, { path: '/' });
        newPasswordInput.value = "";
        alert("User has been edited.");
    }

    return (
        <div>
            <h5>Edit User</h5>
            <form className="form" id="editUserForm" onSubmit={onSubmitEditArtist}>
                <div className='form-group'>
                    <label>
                        Email:
                        <br />
                        <input id="editUserEmailInput" required autoFocus={true} defaultValue={user.email} />
                    </label>
                </div>
                <div className='form-group'>
                    <label>
                        New password:
                        <br />
                        <input id="editUserNewPasswordInput" required autoFocus={true} type="password" />
                    </label>
                </div>
                <button className='button add-button' type='submit'>Edit</button>
                <button className='button add-button' type='reset'>Cancel</button>
            </form>
        </div>
    );

}

export default EditUser;