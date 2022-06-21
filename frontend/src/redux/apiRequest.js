import axios from "axios";
import { loginStart, loginSuccess, loginFailed, registerStart, registerSuccess, registerFailed, logoutSuccess, logoutFailed, logoutStart } from "./authSlice";
import { getUserStart, getUserSuccess, getUserFailed, deleteUserStart, deleteUserSuccess, deleteUserFailed } from "./userSlice"
export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post("auth/login", user)
        dispatch(loginSuccess(res.data))
        navigate("/")
    }
    catch (err) {
        dispatch(loginFailed)
    }
}

export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart());
    try {
        console.log('a')

        await axios.post("auth/register", user)
        dispatch(registerSuccess())
        navigate("/login")
    }
    catch (err) {
        dispatch(registerFailed());
    }
}

export const getAllUsers = async (accessToken, dispatch, axiosJWT) => {
    dispatch(getUserStart())
    try {
        const res = await axiosJWT.get("/user/", {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(getUserSuccess(res.data))
    }
    catch (err) {
        dispatch(getUserFailed())
    }
}

export const deleteUser = async (accessToken, dispatch, id, axiosJWT) => {
    dispatch(deleteUserStart())
    try {
        const res = await axiosJWT.delete("/user/" + id, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(deleteUserSuccess(res.data))
    }
    catch (err) {
        dispatch(deleteUserFailed(err.response.data))
    }
}

export const logoutUser = async (dispatch, navigate, token, axiosJWT) => {
    dispatch(logoutStart())
    try {
        await axiosJWT.get("auth/logout", {
            headers: { token: `Bearer ${token}` },
        })
        dispatch(logoutSuccess())
        navigate("/login")
    }
    catch (err) {
        dispatch(logoutFailed())
    }
}