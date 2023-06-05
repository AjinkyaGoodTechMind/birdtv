import React, { useEffect, useState } from "react";
import "./memberRegister.css";
import { Link, useNavigate } from "react-router-dom";

import Loader from "../../components/Loader/Loader";

import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSessionUser } from "../../slices/sessionSlice";

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error2, setError2] = useState("");

  const [error3, setError3] = useState("");

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    reEnterPassword: "",
    domain: "",
    gaCode: "",
  });

  const [error, setError] = useState("");

  const validateDomain = () => {
    const domainRegex = /^(http:\/\/|https:\/\/)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = domainRegex.test(user.domain);
    if (!isValid) {
      setError("Invalid domain");
    } else {
      setError("");
    }
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(user.email);
    if (!isValid) {
      setError3("Invalid email");
    } else {
      setError3("");
    }
    return isValid;
  };

  useEffect(() => {
    validateEmail();
  }, [user.email]);

  useEffect(() => {
    validateDomain();
  }, [user.domain]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!error && !error3) {
      setError("");
      setError2("");
      await axios
        .post(`/api/session/register`, user)
        .then(({ data }) => {
          dispatch(setSessionUser(data));
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setError2("Please Enter Valid Information");
    }
  };

  return (
    <div className="background">
      {/* <Navbar /> */}

      <div className="memberRegister">
        <div className="register w-1/2 h-96 ml-24">
          <h1 className="text-2xl font-semibold">Signup</h1>
          <form onSubmit={handleRegister}>
            <input type="text" required={true} name="username" value={user.username} placeholder="Enter Name" onChange={handleChange}></input>
            <input type="text" required={true} name="email" value={user.email} placeholder="Enter Email" onChange={handleChange}></input>
            {user?.email && error3 && <span style={{ color: "red" }}>{error3}</span>}
            <input type="text" required={true} name="domain" value={user.domain} placeholder="Enter Domain" onChange={handleChange}></input>

            {user?.domain && error && <span style={{ color: "red" }}>{error}</span>}

            <input type="text" required={true} name="gaCode" value={user.gaCode} placeholder="Enter GA Code" onChange={handleChange}></input>

            <input type="password" required={true} name="password" value={user.password} placeholder="Password" onChange={handleChange}></input>
            <input
              type="password"
              required={true}
              name="reEnterPassword"
              value={user.reEnterPassword}
              placeholder="Re-enter Password"
              onChange={handleChange}
            ></input>
            {error2 && <span style={{ color: "red", marginTop: "20px" }}>{error2}</span>}
            <button className="p-2 pl-24 pr-24 clicabledivRegsiter bg-blue-500 h-10 rounded-md text-white  text-xl ">Register</button>
          </form>
          <div>OR</div>
          <Link to="/login">
            <button className="p-2 pl-36 pr-28 clicablediv bg-blue-500 h-10 rounded-md text-white  text-xl ">Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
