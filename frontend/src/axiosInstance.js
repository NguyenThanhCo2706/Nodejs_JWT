import axios from "axios";
import jwt_decode from "jwt-decode";
import { loginSuccess } from "./redux/authSlice"

const refreshToken = async () => {
    try {
        const res = await axios.post("/auth/refresh", {
            withCredentials: true,
        });
        return res.data
    }
    catch (err) {
        console.log(err)
    }
}

export const createAxios = (user, dispatch, stateSuccess) => {
    const newInstance = axios.create()
    newInstance.interceptors.request.use(
        async (config) => {
            let date = new Date();
            const decodeToken = jwt_decode(user?.accesstoken)
            if (decodeToken.exp < date.getTime() / 1000) {
                const data = await refreshToken()
                const refreshUser = {
                    ...user,
                    accessToken: data.accesstoken
                }
                dispatch(stateSuccess(refreshUser))
                config.headers["token"] = "Bearer " + data.accesstoken
            }
            return config
        },
        (err) => {
            return Promise.reject(err)
        }
    )
    return newInstance
}