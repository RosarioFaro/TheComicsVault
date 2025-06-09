import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { LOGIN } from "../redux/action";

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

function ProfileEditPage() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    avatar: avatarList[0],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showRedirectModal, setShowRedirectModal] = useState(false); // NEW

  useEffect(() => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    if (!username || !token) return;
    axios
      .get(`/api/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setForm((f) => ({
          ...f,
          username: res.data.username,
          avatar: res.data.avatar || avatarList[0],
        }));
      })
      .catch(() => setError("Unable to load profile."))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleAvatarSelect = (avatar) => {
    setForm((f) => ({ ...f, avatar }));
    setShowAvatarModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    const token = localStorage.getItem("token");
    const currentUsername = localStorage.getItem("username");

    try {
      await axios.put(
        `/api/users/${currentUsername}`,
        {
          username: form.username,
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
          avatar: form.avatar,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (form.username !== currentUsername) {
        setSuccess(true);
        localStorage.setItem("username", form.username);
        localStorage.setItem("avatar", form.avatar);
        dispatch({ type: LOGIN, payload: { token, username: form.username, avatar: form.avatar } });

        setShowRedirectModal(true); // Mostra modale "Redirecting..."

        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          localStorage.removeItem("avatar");
          dispatch({ type: LOGIN, payload: { token: "", username: "", avatar: "" } });
          window.location.href = "/";
        }, 2000);
      } else {
        setSuccess(true);
        localStorage.setItem("avatar", form.avatar);
        dispatch({ type: LOGIN, payload: { token, username: form.username, avatar: form.avatar } });
        setForm((f) => ({ ...f, currentPassword: "", newPassword: "" }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Update failed (controlla la password attuale o il nome utente)");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <Container className="my-5 volume-detail-bg custom-container" style={{ maxWidth: 500 }}>
      <h2 className="mb-4 text-center">Edit Profile</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" name="username" value={form.username} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Current Password</Form.Label>
          <Form.Control
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            required
            placeholder="Enter your current password"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="Leave blank to keep current"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Avatar</Form.Label>
          <div className="d-flex align-items-center gap-3">
            <img
              src={form.avatar}
              alt="Selected avatar"
              style={{
                width: 54,
                height: 54,
                borderRadius: "50%",
                border: "3px solid #0dcaf0",
                objectFit: "cover",
                background: "#fff",
              }}
            />
            <Button variant="outline-info" onClick={() => setShowAvatarModal(true)}>
              Change Avatar
            </Button>
          </div>
        </Form.Group>
        {error && <div className="text-danger mb-2">{error}</div>}
        {success && <div className="text-success mb-2">Profile updated successfully!</div>}
        <Button type="submit" variant="primary">
          Save Changes
        </Button>
      </Form>

      {/* Avatar selection modal */}
      <Modal show={showAvatarModal} onHide={() => setShowAvatarModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Choose your avatar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-wrap justify-content-center gap-4">
            {avatarList.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`Avatar ${i + 1}`}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  border: form.avatar === src ? "4px solid #0dcaf0" : "2px solid #666",
                  cursor: "pointer",
                  objectFit: "cover",
                  margin: 8,
                  transition: "border 0.2s",
                }}
                onClick={() => handleAvatarSelect(src)}
              />
            ))}
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showRedirectModal} centered backdrop="static" keyboard={false}>
        <Modal.Body className="text-center py-4 text-black">
          <h4>Username changed</h4>
          <p className="text-black">Redirecting to login...</p>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default ProfileEditPage;
