import { useState, useRef, useEffect } from "react";
import "../styles/navbar.css";

export default function Navbar() {
  const [mallOpen, setMallOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const mallRef = useRef();
  const langRef = useRef();
  const notifRef = useRef();
  const profileRef = useRef();

  // Close all dropdowns when clicking outside
  useEffect(() => {
    function closeAll(e) {
      if (mallRef.current && !mallRef.current.contains(e.target)) setMallOpen(false);
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", closeAll);
    return () => document.removeEventListener("mousedown", closeAll);
  }, []);

  return (
    <nav className="navbar">
      {/* Left Section */}
      <div className="nav-left">
        <div className="nav-title">Crowd Solutions</div>

        {/* Avenue Mall with Dropdown */}
        <div className="mall-wrapper" ref={mallRef}>
          <button 
            className="mall-button"
            onClick={() => setMallOpen(!mallOpen)}
          >
            Avenue Mall ▼
          </button>

          {mallOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item">Mall Overview</button>
              <button className="dropdown-item">Shops</button>
              <button className="dropdown-item">Events</button>
            </div>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="nav-right">
        {/* Language Selector */}
        <div className="lang-wrapper" ref={langRef}>
          <button 
            className="nav-button"
            onClick={() => setLangOpen(!langOpen)}
          >
            ENG ▼
          </button>

          {langOpen && (
            <div className="dropdown-menu right">
              <button className="dropdown-item">ENG</button>
              <button className="dropdown-item">AR</button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="notif-wrapper" ref={notifRef}>
          <button 
            className="nav-button icon-button"
            onClick={() => setNotifOpen(!notifOpen)}
          >
            🔔
          </button>

          {notifOpen && (
            <div className="dropdown-menu right">
              <p className="dropdown-item">No new notifications</p>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="profile-wrapper" ref={profileRef}>
          <img 
            src="https://via.placeholder.com/32"
            className="profile-pic"
            onClick={() => setProfileOpen(!profileOpen)}
            alt="Profile"
          />

          {profileOpen && (
            <div className="dropdown-menu right">
              <button className="dropdown-item">My Profile</button>
              <button className="dropdown-item">Settings</button>
              <button className="dropdown-item">Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}