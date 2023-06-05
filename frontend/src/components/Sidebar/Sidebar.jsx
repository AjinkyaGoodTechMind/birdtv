import "./sidebar.css";

import LiveTvIcon from "@mui/icons-material/LiveTv";
import EngineeringIcon from "@mui/icons-material/Engineering";
import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import HttpIcon from "@mui/icons-material/Http";

import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          {/* <h3 className="sidebarTitle">Dashboard</h3> */}
          <ul className="sidebarList">
            <Link to="/videos" className="link">
              <li
                className="sidebarListItem"
                style={location.pathname === "/videos" ? { backgroundImage: "linear-gradient(135deg, #ea66cd 0%, #00cdff 100%)" } : null}
              >
                <SmartDisplayIcon className="sidebarIcon" style={location.pathname === "/videos" ? { color: "white" } : null} />
                Videos
              </li>
            </Link>
            <Link to="/mrss" className="link">
              <li
                className="sidebarListItem"
                style={location.pathname === "/mrss" ? { backgroundImage: "linear-gradient(135deg, #ea66cd 0%, #00cdff 100%)" } : null}
              >
                <SmartDisplayIcon className="sidebarIcon" style={location.pathname === "/mrss" ? { color: "white" } : null} />
                MRSS Feed
              </li>
            </Link>
            <Link to="/playlists" className="link">
              <li
                className="sidebarListItem"
                style={location.pathname === "/playlists" ? { backgroundImage: "linear-gradient(135deg, #ea66cd 0%, #00cdff 100%)" } : null}
              >
                <PlaylistPlayIcon className="sidebarIcon" style={location.pathname === "/playlists" ? { color: "white" } : null} />
                Playlists
              </li>
            </Link>
            <Link to="/" className="link">
              <li
                className="sidebarListItem"
                style={location.pathname === "/dashboard" ? { backgroundImage: "linear-gradient(135deg, #ea66cd 0%, #00cdff 100%)" } : null}
              >
                <LiveTvIcon className="sidebarIcon" style={location.pathname === "/dashboard" ? { color: "white" } : null} />
                Players
              </li>
            </Link>
            <Link to="/contentUnits" className="link">
              <li
                className="sidebarListItem"
                style={location.pathname === "/contentUnits" ? { backgroundImage: "linear-gradient(135deg, #ea66cd 0%, #00cdff 100%)" } : null}
              >
                <EngineeringIcon className="sidebarIcon" style={location.pathname === "/contentUnits" ? { color: "white" } : null} />
                Content Units
              </li>
            </Link>
            <Link to="/addDomain" className="link">
              <li
                className="sidebarListItem"
                style={location.pathname === "/addDomain" ? { backgroundImage: "linear-gradient(135deg, #ea66cd 0%, #00cdff 100%)" } : null}
              >
                <HttpIcon className="sidebarIcon" style={location.pathname === "/addDomain" ? { color: "white" } : null} />
                Add Domain
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}
