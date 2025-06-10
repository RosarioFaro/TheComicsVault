import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch } from "react-redux";
import { login, register } from "../redux/action";
import { Link, useNavigate } from "react-router-dom";
import { Container, Modal } from "react-bootstrap";

const avatarList = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png",
  "/avatars/avatar7.png",
  "/avatars/avatar8.png",
  "/avatars/avatar9.png",
  "/avatars/avatar10.png",
  "/avatars/avatar11.png",
  "/avatars/avatar12.png",
  "/avatars/avatar13.png",
  "/avatars/avatar14.png",
  "/avatars/avatar15.png",
  "/avatars/avatar16.png",
];

function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState(false);

  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    avatar: avatarList[0],
  });

  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/homepage");
    }
  }, [navigate]);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setLoginError(false);

    const result = await dispatch(login(loginForm));
    if (result?.success) {
      navigate("/homepage");
    } else {
      setLoginError(true);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setRegisterError("");
    setRegisterSuccess(false);

    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError("Passwords do not match.");
      return;
    }

    const result = await dispatch(register(registerForm));
    if (result?.success) {
      setRegisterSuccess(true);
      setMode("login");
    } else {
      setRegisterError("Registration failed.");
    }
  };

  return (
    <Container className="mt-5 volume-detail-bg custom-container">
      <div className="text-center mb-4">
        <h3>Welcome to TheComicVault!</h3>
        <p>Login to your account or register to start building your comic library.</p>
      </div>
      <div className="d-flex justify-content-center mb-4">
        <Button
          variant={mode === "login" ? "primary" : "outline-primary"}
          className="me-2"
          onClick={() => setMode("login")}
        >
          Login
        </Button>
        <Button variant={mode === "register" ? "primary" : "outline-primary"} onClick={() => setMode("register")}>
          Register
        </Button>
      </div>

      {mode === "login" ? (
        <Form
          onSubmit={handleLoginSubmit}
          className="d-flex flex-column justify-content-center align-items-center text-center"
        >
          <Form.Group controlId="loginUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Username"
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
            />
          </Form.Group>

          <Form.Group controlId="loginPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            />
          </Form.Group>

          {loginError && <p className="text-danger mt-2">Invalid credentials</p>}

          <Button className="mt-3 bg-primary" type="submit">
            Login
          </Button>
        </Form>
      ) : (
        <Form
          onSubmit={handleRegisterSubmit}
          className="d-flex flex-column justify-content-center align-items-center text-center"
        >
          <Form.Group controlId="registerUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Username"
              value={registerForm.username}
              onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
            />
          </Form.Group>

          <Form.Group controlId="registerPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
            />
          </Form.Group>

          <Form.Group controlId="registerConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Confirm Password"
              value={registerForm.confirmPassword}
              onChange={(e) =>
                setRegisterForm({
                  ...registerForm,
                  confirmPassword: e.target.value,
                })
              }
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Choose your avatar</Form.Label>
            <div className="d-flex flex-column align-items-center mb-3">
              <img
                src={registerForm.avatar}
                alt="Selected avatar"
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: "50%",
                  border: "3px solid #0dcaf0",
                  cursor: "pointer",
                  objectFit: "cover",
                }}
                onClick={() => setShowAvatarModal(true)}
                title="Click to change avatar"
              />
              <small className="text-secondary d-block text-center mt-1">Click on the avatar to choose</small>
            </div>
          </Form.Group>

          {registerError && <p className="text-danger mt-2">{registerError}</p>}
          {registerSuccess && <p className="text-success mt-2">Registration successful! You can now login.</p>}

          <Button className="mt-3 bg-primary" type="submit">
            Register
          </Button>
        </Form>
      )}

      <Modal show={showAvatarModal} onHide={() => setShowAvatarModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Choose your avatar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              {avatarList.map((src) => (
                <div className="col-3 text-center mb-3" key={src}>
                  <img
                    src={src}
                    alt="Avatar"
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: "50%",
                      border: registerForm.avatar === src ? "3px solid #0dcaf0" : "2px solid #666",
                      cursor: "pointer",
                      objectFit: "cover",
                      transition: "border 0.2s",
                      boxShadow: registerForm.avatar === src ? "0 0 8px #0dcaf0" : "none",
                    }}
                    onClick={() => {
                      setRegisterForm((f) => ({ ...f, avatar: src }));
                      setShowAvatarModal(false);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default AuthPage;
