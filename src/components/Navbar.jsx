import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/navbar.css";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);      // avatar dropdown
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu

  useEffect(() => {
    if (token) {
      api.get("/auth/profile").then((res) => {
        setUser(res.data);
      });
    }
  }, [token]);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h2>LB Blogs</h2>
      </div>

      {/* HAMBURGER */}
      <div
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>

      <div className={`nav-right ${menuOpen ? "active" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>

        {token ? (
          <>
            <Link to="/create" onClick={() => setMenuOpen(false)}>
              Create
            </Link>

            {/* AVATAR */}
            <div className="avatar-wrapper">
              <div
                className="user-box"
                onClick={() => setOpen(!open)}
              >
                {user?.profileImage ? (
                  <img
                    src={`http://localhost:5000/${user.profileImage}`}
                    className="user-img"
                    alt="profile"
                  />
                ) : (
                  <div className="user-letter">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {open && (
                <div className="dropdown">
                  <Link to="/profile" onClick={() => setOpen(false)}>
                    My Profile
                  </Link>
                  <Link to="/create" onClick={() => setOpen(false)}>
                    Create Blog
                  </Link>
                  <button onClick={logoutHandler}>Logout</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
