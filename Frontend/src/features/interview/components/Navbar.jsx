import React from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../auth/hooks/useAuth";
import "./navbar.scss";

const Navbar = ({ showBack = false }) => {
  const { handleLogout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="top-nav">
      <div className="top-nav__left">
        <Link to="/" className="top-nav__logo">GenAI Resume</Link>
        {showBack && (
          <button onClick={() => navigate("/")} className="back-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Dashboard
          </button>
        )}
      </div>
      <div className="top-nav__actions">
        <span className="user-name">Hello, {user?.username || "User"}</span>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
