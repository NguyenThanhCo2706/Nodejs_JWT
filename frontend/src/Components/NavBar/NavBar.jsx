import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import "./navbar.css";
import { logoutUser } from "../../redux/apiRequest";
import { createAxios } from "../../axiosInstance"
import { logoutSuccess } from "../../redux/authSlice";


const NavBar = () => {
  const user = useSelector((state) => state.auth.login.currentUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const accessToken = user?.accesstoken
  const id = user?._id
  let axiosJWT = createAxios(user, dispatch, logoutSuccess)

  const handleLogout = () => {
    logoutUser(dispatch, navigate, accessToken, axiosJWT)
  }
  return (
    <nav className="navbar-container">
      <Link to="/" className="navbar-home"> Home </Link>
      {user ? (
        <>
          <p className="navbar-user">Hi, <span> {user.username}  </span> </p>
          <Link to="/logout" className="navbar-logout" onClick={handleLogout}> Log out</Link>
        </>
      ) : (
        <>
          <Link to="/login" className="navbar-login"> Login </Link>
          <Link to="/register" className="navbar-register"> Register</Link>
        </>
      )}
    </nav>
  );
};

export default NavBar;
