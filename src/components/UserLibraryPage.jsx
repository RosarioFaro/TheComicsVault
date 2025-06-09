import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

import pencilIcon from "../assets/icons/pencil.png";
import binIcon from "../assets/icons/recycle-bin.png";

function UserLibraryPage() {
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [form, setForm] = useState({
    status: "PLANNED",
    userScore: "",
    currentIssue: "",
  });
  const [saving, setSaving] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteEntryId, setDeleteEntryId] = useState(null);

  useEffect(() => {
    fetchLibrary();
  }, []);

  const fetchLibrary = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/user-library", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Errore nel caricamento della libreria");
      const data = await res.json();
      setLibrary(data);
      setLoading(false);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  const handleEdit = (entry) => {
    setEditEntry(entry);
    setForm({
      status: entry.status,
      userScore: entry.userScore || "",
      currentIssue: entry.currentIssue || "",
    });
    setShowModal(true);
  };

  const handleDelete = (entryId) => {
    setDeleteEntryId(entryId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("token");
    await fetch(`/api/user-library/${deleteEntryId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setShowDeleteModal(false);
    setDeleteEntryId(null);
    fetchLibrary();
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "currentIssue") {
      let max = editEntry?.issueCount || 1;
      let val = value === "" ? "" : Math.max(1, Math.min(Number(value), max));
      setForm((f) => ({ ...f, currentIssue: val }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "PLANNED":
        return { background: "#0dcaf0", color: "#181818", borderRadius: 8, padding: "2px 10px", fontWeight: 600 };
      case "READING":
        return { background: "#ffc107", color: "#181818", borderRadius: 8, padding: "2px 10px", fontWeight: 600 };
      case "COMPLETED":
        return { background: "#198754", color: "#fff", borderRadius: 8, padding: "2px 10px", fontWeight: 600 };
      case "DROPPED":
        return { background: "#dc3545", color: "#fff", borderRadius: 8, padding: "2px 10px", fontWeight: 600 };
      default:
        return {};
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const token = localStorage.getItem("token");

    const params = new URLSearchParams({
      comicVineId: editEntry.comicVineId,
      status: form.status,
      score: form.userScore,
      issue: form.currentIssue,
    }).toString();

    const res = await fetch("/api/user-library?" + params, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    setSaving(false);
    if (!res.ok) {
      setError("Errore nel salvataggio.");
      return;
    }
    setShowModal(false);
    setEditEntry(null);
    fetchLibrary();
  };

  const [statusFilter, setStatusFilter] = useState("");
  const statusOrder = ["READING", "COMPLETED", "PLANNED", "DROPPED"];

  const filteredAndSortedLibrary = library
    .filter((entry) => !statusFilter || entry.status === statusFilter)
    .sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="volume-detail-bg mt-4 custom-container">
      <h2>Your Vault</h2>
      <div className="mb-3 d-flex gap-2 flex-wrap">
        <Button variant={statusFilter === "" ? "outline-light" : "light"} size="sm" onClick={() => setStatusFilter("")}>
          All
        </Button>
        <Button
          variant={statusFilter === "READING" ? "warning" : "outline-warning"}
          size="sm"
          onClick={() => setStatusFilter("READING")}
        >
          Reading
        </Button>
        <Button
          variant={statusFilter === "COMPLETED" ? "success" : "outline-success"}
          size="sm"
          onClick={() => setStatusFilter("COMPLETED")}
        >
          Completed
        </Button>
        <Button
          variant={statusFilter === "PLANNED" ? "primary" : "outline-primary"}
          size="sm"
          onClick={() => setStatusFilter("PLANNED")}
        >
          Planned
        </Button>
        <Button
          variant={statusFilter === "DROPPED" ? "danger" : "outline-danger"}
          size="sm"
          onClick={() => setStatusFilter("DROPPED")}
        >
          Dropped
        </Button>
      </div>
      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          tableLayout: "auto",
        }}
      >
        <thead>
          <tr>
            <th className="td-title">Title</th>
            <th>Status</th>
            <th>Rating</th>
            <th>Issue</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedLibrary.map((entry) => (
            <tr key={entry.id}>
              <td className="td-title">
                <Link
                  to={`/volumes/${entry.comicVineId}`}
                  style={{ color: "#ffc107", fontWeight: 500, textDecoration: "none" }}
                >
                  {entry.volumeName}
                </Link>
              </td>
              <td>
                <span style={getStatusStyle(entry.status)}>{entry.status}</span>
              </td>
              <td>{entry.userScore ?? "-"}</td>
              <td>{entry.currentIssue ?? "-"}</td>
              <td>
                <div className="d-flex gap-2 justify-content-end">
                  <img
                    src={pencilIcon}
                    alt="Edit"
                    title="Edit"
                    onClick={() => handleEdit(entry)}
                    style={{
                      width: 45,
                      cursor: "pointer",
                      background: "#ffc107",
                      padding: 4,
                      borderRadius: 8,
                      border: "2px solid #ffc107",
                      marginRight: 6,
                      transition: "transform 0.13s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.12)")}
                    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                  <img
                    src={binIcon}
                    alt="Delete"
                    title="Delete"
                    onClick={() => handleDelete(entry.id)}
                    style={{
                      width: 45,
                      cursor: "pointer",
                      background: "#dc3545",
                      padding: 4,
                      borderRadius: 8,
                      transition: "transform 0.13s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.12)")}
                    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="bg-dark text-white">
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton closeVariant="white" className="bg-dark text-white border-0">
            <Modal.Title className="text-white">Edit entry in your library</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-white">
            <Form.Group className="mb-3">
              <Form.Label className="text-white">Reading Status</Form.Label>
              <Form.Select
                name="status"
                className="bg-dark text-white border-secondary"
                value={form.status}
                onChange={handleFormChange}
                required
              >
                <option value="PLANNED">Planned</option>
                <option value="READING">Reading</option>
                <option value="COMPLETED">Completed</option>
                <option value="DROPPED">Dropped</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-white">Rating (1-10)</Form.Label>
              <Form.Control
                type="number"
                name="userScore"
                className="bg-dark text-white border-secondary"
                value={form.userScore}
                min="1"
                max="10"
                onChange={handleFormChange}
                placeholder="(opzionale)"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-white">
                Issue <span style={{ color: "#ccc", fontSize: 13 }}>(max {editEntry?.issueCount || 1})</span>
              </Form.Label>
              <Form.Control
                type="number"
                name="currentIssue"
                className="bg-dark text-white border-secondary"
                value={form.currentIssue}
                min="1"
                max={editEntry?.issueCount || 1}
                onChange={(e) => {
                  let max = editEntry?.issueCount || 1;
                  let val = e.target.value === "" ? "" : Math.max(1, Math.min(Number(e.target.value), max));
                  setForm((f) => ({
                    ...f,
                    currentIssue: val,
                    status: val === max ? "COMPLETED" : f.status === "COMPLETED" ? "READING" : f.status,
                  }));
                }}
                placeholder={`(max ${editEntry?.issueCount || 1})`}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="bg-dark border-0">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Return
            </Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? <Spinner size="sm" animation="border" /> : "Save"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Comic?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this comic?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={async () => {
              setShowDeleteModal(false);
              await confirmDelete();
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserLibraryPage;
