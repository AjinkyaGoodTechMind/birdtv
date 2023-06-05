import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../../components/Navbar/Navbar";
import Sidebar from "../../../components/Sidebar/Sidebar";
import axios from "axios";
import { setCurrentDomain, setNewDomain } from "../../../slices/sessionSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

export default function AddDomain() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [domain, setDomain] = useState("");
  const [gaCode, setGaCode] = useState("");
  const [error, setError] = useState("");
  const [error2, setError2] = useState("");

  const validateDomain = () => {
    const domainRegex = /^(http:\/\/|https:\/\/)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = domainRegex.test(domain);
    if (!isValid) {
      setError("Invalid domain");
    } else {
      setError("");
    }
  };

  useEffect(() => {
    validateDomain();
  }, [domain]);

  const handleSavePlayer = async () => {
    if (!error && domain) {
      setError("");
      setError2("");
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "/api/session/addDomain",
        data: { domain, gaCode },
      };

      await axios
        .request(config)
        .then(({ data }) => {
          dispatch(setNewDomain(data));
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setError2("Valid Domain is Required");
    }
  };

  return (
    <div className="addPlayer">
      <Navbar />

      <div className="addPlayer-main">
        <Sidebar />
        <div className="addPlayer-main-container" style={{ padding: "40px", paddingLeft: "60px" }}>
          <div className="addPlayer-inputsContainer">
            <div className="addPlayer-inputs" style={{ width: "800px" }}>
              <h2 style={{ width: "140px" }}>New Domain</h2>
              <input style={{ width: "500px" }} type="text" value={domain} onChange={(e) => setDomain(e.target.value)} />
              {domain && error && <span style={{ color: "red" }}>{error}</span>}
            </div>
            <hr />
            <div className="addPlayer-inputs">
              <h2 style={{ width: "140px" }}>GA Code</h2>
              <input type="text" value={gaCode} onChange={(e) => setGaCode(e.target.value)} />
            </div>
            {error2 && <span style={{ color: "red", marginTop: "20px" }}>{error2}</span>}
            <span className="newPlayerButton" style={{ marginTop: "30px" }} onClick={handleSavePlayer}>
              Save Domain
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
