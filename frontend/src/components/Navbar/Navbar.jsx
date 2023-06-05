import React from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import GtmLogo from "../../assets/Rectangle 2.png";
import { useDispatch, useSelector } from "react-redux";
import { clearSession, setCurrentDomain, setSessionUser } from "../../slices/sessionSlice";
import axios from "axios";

function Navbar() {
  const { sessionUser, domains, currentDomain } = useSelector((state) => state.sessionSlice);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await axios.get(`/api/session/logout`);
    dispatch(clearSession());
    navigate("/login");
  };

  const handleChangeDomain = (id) => {
    let current = domains.filter((e) => e._id.toString() === id.toString());
    dispatch(setCurrentDomain(current[0]));
  };

  const Options = () => {
    return (
      <div className="navbar-options">
        {/* <Link to="/"> Home </Link> */}

        {sessionUser && sessionUser.email ? (
          <>
            <select className="domainSelect" value={currentDomain._id} onChange={(e) => handleChangeDomain(e.target.value)}>
              <option value="" disabled selected hidden>
                Please Choose...
              </option>
              {domains.map((e) => {
                return <option value={e._id}>{e.domain}</option>;
              })}
            </select>
            {/* <Link to="/dashboard">Dashboard</Link> */}
            <span className="loginButtonNAv" onClick={handleLogout}>
              Logout
            </span>
          </>
        ) : (
          <Link to="/login" className="loginButtonNAv">
            Login / Signup
          </Link>
        )}
      </div>
    );
  };

  return (
    <div className="navbar">
      <img src={GtmLogo} alt="" />
      <Options />
    </div>
  );
}

export default Navbar;
