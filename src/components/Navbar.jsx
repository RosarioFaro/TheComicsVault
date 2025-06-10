import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import logo from "../assets/logo.png";
import { logout } from "../redux/action";
import { Navbar as CustomNavbar, Nav, Container, Dropdown, Image } from "react-bootstrap";
import { useState } from "react";
import "../App.css";

function Navbar() {
  const token = useSelector((state) => state.login.token);
  const username = useSelector((state) => state.login.username);
  const avatarRedux = useSelector((state) => state.login.avatar);

  const avatar = avatarRedux || localStorage.getItem("avatar") || "/avatars/avatar1.png";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <CustomNavbar expand="lg" bg="warning" className="px-3 align-items-center sticky-top">
      <Container fluid>
        <Link className="navbar-brand" to="/homepage">
          <img src={logo} alt="logo" style={{ height: "60px" }} />
        </Link>
        {token && (
          <Nav className="d-none d-lg-flex align-items-center" style={{ marginLeft: 16 }}>
            <Nav.Link
              as={NavLink}
              to="/volumes"
              className="text-black"
              style={({ isActive }) => ({
                background: isActive ? "#fffde4" : "transparent", // Giallo chiaro custom
                color: "#181818", // Testo scuro
                borderRadius: 8,
                fontWeight: isActive ? 700 : 500,
                boxShadow: isActive ? "0 2px 10px #ffc10733" : "none",
                border: isActive ? "2px solid #ffc107" : "2px solid transparent",
                padding: "6px 18px",
                transition: "all 0.15s",
              })}
            >
              Volumes
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/library"
              className="text-black"
              style={({ isActive }) => ({
                background: isActive ? "#fffde4" : "transparent",
                color: "#181818",
                borderRadius: 8,
                fontWeight: isActive ? 700 : 500,
                boxShadow: isActive ? "0 2px 10px #ffc10733" : "none",
                border: isActive ? "2px solid #ffc107" : "2px solid transparent",
                padding: "6px 18px",
                transition: "all 0.15s",
              })}
            >
              Vault
            </Nav.Link>
          </Nav>
        )}

        <div className="ms-auto d-none d-lg-flex align-items-center" style={{ gap: 8 }}>
          {token && (
            <Dropdown align="end" show={dropdownOpen} onToggle={(isOpen) => setDropdownOpen(isOpen)}>
              <Dropdown.Toggle as="div" style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                <Image
                  src={avatar}
                  alt={username}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #343a40",
                    background: "#fff",
                    cursor: "pointer",
                    transition: "box-shadow 0.2s",
                  }}
                />
                <svg
                  style={{
                    width: 20,
                    height: 20,
                    marginLeft: 4,
                    transition: "transform 0.3s",
                    transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    color: "#343a40",
                  }}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/profile">
                  Profile
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                <Dropdown.Divider />
                <span className="dropdown-item-text text-muted small">Welcome {username}!</span>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>

        <div className="ms-auto d-lg-none d-flex align-items-center" style={{ gap: 8 }}>
          {token && (
            <Dropdown align="end" show={dropdownOpen} onToggle={(isOpen) => setDropdownOpen(isOpen)}>
              <Dropdown.Toggle as="div" style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                <Image
                  src={avatar}
                  alt={username}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #343a40",
                    background: "#fff",
                    cursor: "pointer",
                    transition: "box-shadow 0.2s",
                  }}
                />
                <svg
                  style={{
                    width: 20,
                    height: 20,
                    marginLeft: 4,
                    transition: "transform 0.3s",
                    transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    color: "#343a40",
                  }}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/profile">
                  Profile
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/volumes">
                  Volumes
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/library">
                  Vault
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                <Dropdown.Divider />
                <span className="dropdown-item-text text-muted small">Welcome {username}!</span>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>

        {!token && (
          <div className="ms-auto d-none d-lg-flex align-items-center">
            <Nav>
              <Nav.Link as={Link} className="text-black" to="/">
                Login
              </Nav.Link>
            </Nav>
          </div>
        )}

        {!token && (
          <div className="ms-auto d-lg-none d-flex align-items-center">
            <Nav>
              <Nav.Link as={Link} className="text-black" to="/">
                Login
              </Nav.Link>
            </Nav>
          </div>
        )}
      </Container>
    </CustomNavbar>
  );
}

export default Navbar;
