import { useEffect } from "react";
import { deleteUser, getAllUsers } from "../../redux/apiRequest";
import "./home.css";
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import jwt_decode from "jwt-decode"
import { loginSuccess } from "../../redux/authSlice";
import { createAxios } from "../../axiosInstance"

const HomePage = () => {
  const user = useSelector((state) => state.auth.login?.currentUser)
  const userList = useSelector((state) => state.user.users?.allUsers)
  const message = useSelector((state) => state.user?.message)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  let axiosJWT = createAxios(user, dispatch, loginSuccess)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
    if (user?.accesstoken) {
      console.log(user.accesstoken)
      getAllUsers(user.accesstoken, dispatch, axiosJWT)
    }
  }, [])

  const handleDelete = (id) => {
    console.log(id)
    deleteUser(user?.accesstoken, dispatch, id, axiosJWT)
  }

  return (
    <main className="home-container">
      <div className="home-title">User List</div>
      <div className="home-role">
        {`Your role: ${user?.admin ? `Admin` : `User`}`}
      </div>
      <div className="home-userlist">
        {userList?.map((user, index) => {
          return (
            <div className="user-container" key={index}>
              <div className="home-user">{user.username}</div>
              <div className="delete-user" onClick={() => handleDelete(user._id)}> Delete </div>
            </div>
          );
        })}
      </div>
      <div className="errorMsg">{message}</div>
    </main>
  );
};

export default HomePage;
