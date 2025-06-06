import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import logo from "../assets/logo.png";
import { logout } from "../redux/action";

function Navbar() {
  const token = useSelector((state) => state.login.token);
  const username = useSelector((state) => state.login.username);
  const avatarRedux = useSelector((state) => state.login.avatar);

  const avatar = avatarRedux || localStorage.getItem("avatar") || "/avatars/avatar1.png";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-warning px-3 align-items-center">
      <Link className="navbar-brand" to="/">
        <img src={logo} alt="logo" style={{ height: "60px" }} />
      </Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto align-items-center">
          <li className="nav-item">
            <Link className="nav-link text-black" to="/volumes">
              Volumes
            </Link>
          </li>
          {token && (
            <li className="nav-item">
              <Link className="nav-link text-black" to="/library">
                Vault
              </Link>
            </li>
          )}
          {token ? (
            <>
              <li className="nav-item">
                <span className="nav-link text-black" style={{ cursor: "pointer" }} onClick={handleLogout}>
                  Logout
                </span>
              </li>
              {username && username !== "undefined" && username !== "" && (
                <li className="nav-item d-flex align-items-center">
                  {avatar && (
                    <Link to="/profile" style={{ display: "inline-block" }}>
                      <img
                        src={avatar}
                        alt={username}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginRight: 8,
                          border: "2px solid #343a40",
                          background: "#fff",
                          cursor: "pointer",
                          transition: "box-shadow 0.2s",
                        }}
                      />
                    </Link>
                  )}
                  <span className="nav-link text-black disabled">{username}!</span>
                </li>
              )}
            </>
          ) : (
            <li className="nav-item">
              <Link className="nav-link text-black" to="/">
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
