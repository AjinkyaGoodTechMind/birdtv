import { Routes, Route, BrowserRouter } from "react-router-dom";

import "./App.css";

import Login from "./pages/loginSignup/Login";
import Signup from "./pages/loginSignup/Signup";
import AddPlayer from "./pages/Dashboard/Players/AddPlayer";
import Players from "./pages/Dashboard/Players/Players";
import ContentUnits from "./pages/Dashboard/ContentUnits/ContentUnits";
import AddContentUnit from "./pages/Dashboard/ContentUnits/AddContentUnit";
import Videos from "./pages/Dashboard/Videos/Videos";
import AddVideos from "./pages/Dashboard/Videos/AddVideos";
import EditPlayer from "./pages/Dashboard/Players/EditPlayer";
import Playlist from "./pages/Dashboard/Playlist/Playlist";
import AddPlaylist from "./pages/Dashboard/Playlist/AddPlaylist";
import Analytics from "./pages/Dashboard/Analytics/Analytics";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setSessionUser } from "./slices/sessionSlice";
import AddDomain from "./pages/Dashboard/AddDomain/AddDomain";
import EditPlaylist from "./pages/Dashboard/Playlist/EditPlaylist";
import EditContentUnit from "./pages/Dashboard/ContentUnits/EditContentUnit";
import Mrss from "./pages/Dashboard/Mrss/Mrss";
import ViewMrss from "./pages/Dashboard/Mrss/ViewMrss";

function App() {
  const dispatch = useDispatch();

  const { sessionUser } = useSelector((state) => state.sessionSlice);

  useEffect(() => {
    const getUser = async () => {
      axios
        .get(`/api/session/getSession`)
        .then(({ data }) => {
          dispatch(setSessionUser(data));
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getUser();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {sessionUser && sessionUser._id && (
          <>
            <Route exact path="/dashboard" element={<Players />} />
            <Route exact path="/addPlayer" element={<AddPlayer />} />
            <Route exact path="/editPlayer" element={<EditPlayer />} />
            <Route exact path="/contentUnits" element={<ContentUnits />} />
            <Route exact path="/editContentUnits" element={<EditContentUnit />} />
            <Route exact path="/addContentUnit" element={<AddContentUnit />} />
            <Route exact path="/videos" element={<Videos />} />
            <Route exact path="/addVideos" element={<AddVideos />} />
            <Route exact path="/playlists" element={<Playlist />} />
            <Route exact path="/editPlaylist" element={<EditPlaylist />} />
            <Route exact path="/addPlaylists" element={<AddPlaylist />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/addDomain" element={<AddDomain />} />
            <Route path="/mrss" element={<Mrss />} />
            <Route path="/viewMrss" element={<ViewMrss />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
