import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

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

  const handleDelete = async (entryId) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Sicuro di voler eliminare questa entry?")) return;
    await fetch(`/api/user-library/${entryId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchLibrary();
  };

  const handleFormChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
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
    <div style={{ maxWidth: 800, margin: "0 auto" }} className="volume-detail-bg mt-4">
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
      <table border="1" cellPadding="8" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Rating</th>
            <th>Issue</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedLibrary.map((entry) => (
            <tr key={entry.id}>
              <td>
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
                <div className="d-flex gap-2">
                  <Button size="sm" variant="primary" onClick={() => handleEdit(entry)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(entry.id)}>
                    Delete
                  </Button>
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
              <Form.Label className="text-white">Issue</Form.Label>
              <Form.Control
                type="number"
                name="currentIssue"
                className="bg-dark text-white border-secondary"
                value={form.currentIssue}
                min="1"
                onChange={handleFormChange}
                placeholder="(opzionale)"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="bg-dark border-0">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Return
            </Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? <Spinner size="sm" animation="border" /> : "Salva"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default UserLibraryPage;
