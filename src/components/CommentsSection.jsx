import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import axios from "axios";

function CommentsSection({ volumeId }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const currentUsername = localStorage.getItem("username");

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    axios
      .get(`/api/comments/${volumeId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        setComments(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [volumeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "/api/comments",
        {
          volumeId,
          text: commentText,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments((prev) => [res.data, ...prev]);
      setCommentText("");
    } catch (e) {
      setError(e?.response?.data?.message || "Errore nell'invio del commento");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (commentId) => {
    setCommentToDelete(commentId);
    setShowDeleteModal(true);
  };

  const handleDelete = async (commentId) => {
    const token = localStorage.getItem("token");
    setDeletingId(commentId);
    try {
      await axios.delete(`/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (e) {
      setError(e?.response?.data?.message || "Errore nell'eliminazione.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "32px auto 0 auto" }}>
      <h3>Commenti</h3>
      <Form onSubmit={handleSubmit} className="mb-3">
        <Form.Group>
          <Form.Control
            as="textarea"
            rows={2}
            placeholder="Scrivi un commento..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
            disabled={saving}
          />
        </Form.Group>
        <Button type="submit" variant="primary" disabled={saving || !commentText.trim()} className="mt-2">
          {saving ? "Invio..." : "Invia"}
        </Button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </Form>

      {loading ? (
        <div>Caricamento commenti...</div>
      ) : (
        <div>
          {comments.length === 0 && <div>Nessun commento ancora.</div>}
          {comments.map((c) => (
            <div
              key={c.id}
              style={{
                borderBottom: "1px solid #222",
                padding: "8px 0",
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <b>{c.username}</b>{" "}
                <span style={{ color: "#888", fontSize: 12 }}>{c.timestamp?.replace("T", " ").slice(0, 16)}</span>
                <div>{c.text}</div>
              </div>
              {c.username === currentUsername && (
                <Button
                  variant="danger"
                  size="sm"
                  style={{ minWidth: 50 }}
                  disabled={deletingId === c.id}
                  onClick={() => confirmDelete(c.id)}
                >
                  {deletingId === c.id ? "..." : "Elimina"}
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Comment?</Modal.Title>
        </Modal.Header>
        <Modal.Body closeButton>Are you sure you want to delete this comment?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={async () => {
              setShowDeleteModal(false);
              await handleDelete(commentToDelete);
            }}
            disabled={deletingId === commentToDelete}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CommentsSection;
