import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import safeDescription from "../utils/safeDescription.jsx";
import amazonImg from "../assets/amazon.png";
import ebayImg from "../assets/ebay.png";
import CommentsSection from "./CommentsSection.jsx";

function VolumeDetailPage() {
  const { id } = useParams();
  const [volume, setVolume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [libraryEntry, setLibraryEntry] = useState(null);
  const [libraryLoading, setLibraryLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [libraryRefresh, setLibraryRefresh] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    status: "PLANNED",
    score: "",
    issue: "",
  });

  useEffect(() => {
    if (!id || id === "null" || isNaN(Number(id))) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    setLoading(true);
    setNotFound(false);
    const token = localStorage.getItem("token");
    axios
      .get(`/api/volumes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setVolume(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          axios
            .get(`/api/volumes/search-comicvine?id=${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
              setVolume(res.data);
              setLoading(false);
            })
            .catch(() => {
              setNotFound(true);
              setLoading(false);
            });
        } else {
          setNotFound(true);
          setLoading(false);
        }
      });
  }, [id]);

  useEffect(() => {
    if (!volume || !volume.comicVineId) {
      setLibraryEntry(null);
      setLibraryLoading(false);
      return;
    }
    setLibraryLoading(true);
    setActionError(null);
    const token = localStorage.getItem("token");
    axios
      .get(`/api/user-library/${volume.comicVineId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setLibraryEntry(res.data);
        setLibraryLoading(false);
      })
      .catch(() => {
        setLibraryEntry(null);
        setLibraryLoading(false);
      });
  }, [volume, libraryRefresh]);

  const openModal = () => {
    if (libraryEntry) {
      setForm({
        status: libraryEntry.status || "PLANNED",
        score: libraryEntry.userScore ?? "",
        issue: libraryEntry.currentIssue ?? "",
      });
    } else {
      setForm({
        status: "PLANNED",
        score: "",
        issue: "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleAddOrEdit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setActionError(null);
    const token = localStorage.getItem("token");
    try {
      await axios.post(`/api/user-library`, null, {
        params: {
          comicVineId: volume.comicVineId,
          status: form.status,
          score: form.score !== "" ? form.score : undefined,
          issue: form.issue !== "" ? form.issue : undefined,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setActionLoading(false);
      setLibraryRefresh((r) => r + 1);
      setShowModal(false);
    } catch (e) {
      console.log(e);
      setActionError("Error during saving.");
      setActionLoading(false);
    }
  };

  const handleRemove = async () => {
    setActionLoading(true);
    setActionError(null);
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/api/user-library/${libraryEntry.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActionLoading(false);
      setLibraryRefresh((r) => r + 1);
      setShowModal(false);
    } catch (e) {
      console.log(e);
      setActionError("Error while removing from library.");
      setActionLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading volume...</p>;
  if (notFound || !volume) return <p className="text-center mt-5">Volume not found.</p>;

  const amazonUrl = `https://www.amazon.it/s?k=${encodeURIComponent(volume.name + " " + (volume.publisher || ""))}`;
  const ebayUrl = `https://www.ebay.it/sch/i.html?_nkw=${encodeURIComponent(
    volume.name + " " + (volume.publisher || "")
  )}`;

  return (
    <div className="container mt-5 volume-detail-bg">
      <h2 className="mx-5">{volume.name}</h2>
      <div className="row align-items-start my-5">
        <div className="col-md-4 d-flex flex-column align-items-center">
          <img src={volume.imageUrl} alt={volume.name} className="img-fluid mb-3" style={{ maxWidth: "300px" }} />
          <div className="w-100 mb-2" style={{ maxWidth: 300, textAlign: "left" }}>
            <p className="mb-1">
              <strong>Publisher:</strong>{" "}
              {volume.publisherId ? (
                <a href={`/publisher/${volume.publisherId}`}>{volume.publisher}</a>
              ) : (
                volume.publisher
              )}
            </p>
            <p className="mb-2">
              <strong>Total Issues:</strong> {volume.issueCount}
            </p>
          </div>
          <div className="d-flex flex-wrap align-items-center gap-2 mb-3 w-100" style={{ maxWidth: 300 }}>
            {libraryLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <Button variant={libraryEntry ? "warning" : "primary"} onClick={openModal} disabled={actionLoading}>
                {actionLoading
                  ? libraryEntry
                    ? "Saving..."
                    : "Adding..."
                  : libraryEntry
                  ? "Edit my library"
                  : "Add to my library"}
              </Button>
            )}

            <a
              href={amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-market btn-amazon d-flex align-items-center gap-2"
              style={{ minWidth: 100 }}
            >
              <img src={amazonImg} alt="Amazon" style={{ height: 30, width: "auto", objectFit: "contain" }} />
              <span>Amazon</span>
            </a>

            <a
              href={ebayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-market btn-ebay d-flex align-items-center gap-2"
              style={{ minWidth: 100 }}
            >
              <img src={ebayImg} alt="eBay" style={{ height: 30, width: "auto", objectFit: "contain" }} />
              <span>eBay</span>
            </a>
          </div>
        </div>

        <div className="col-md-8 d-flex flex-column justify-content-start">
          <div className="volume-description" style={{ minHeight: "1px" }}>
            {safeDescription(volume.description)}
          </div>

          {actionError && <div className="text-danger mt-2">{actionError}</div>}
        </div>
      </div>

      <CommentsSection volumeId={volume.id} />

      <Modal show={showModal} onHide={closeModal} centered contentClassName="bg-dark text-white">
        <Form onSubmit={handleAddOrEdit}>
          <Modal.Header closeButton closeVariant="white" className="bg-dark text-white border-0">
            <Modal.Title className="text-white">
              {libraryEntry ? "Edit your entry" : "Add volume to library"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-white">
            <Form.Group className="mb-3">
              <Form.Label className="text-white">Reading status</Form.Label>
              <Form.Select
                className="bg-dark text-white border-secondary"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
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
                className="bg-dark text-white border-secondary"
                value={form.score}
                min={1}
                max={10}
                onChange={(e) => setForm((f) => ({ ...f, score: e.target.value }))}
                placeholder="(optional)"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="text-white">Issues read</Form.Label>
              <Form.Control
                type="number"
                className="bg-dark text-white border-secondary"
                value={form.issue}
                min={0}
                max={volume.issueCount}
                onChange={(e) => {
                  let val = e.target.value;
                  if (val === "") {
                    setForm((f) => ({ ...f, issue: "" }));
                  } else {
                    let num = Math.max(0, Math.min(Number(val), volume.issueCount));
                    setForm((f) => ({ ...f, issue: num }));
                  }
                }}
                placeholder={`(max ${volume.issueCount})`}
              />
              <Form.Text className="text-secondary">Max: {volume.issueCount}</Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="bg-dark border-0">
            {libraryEntry && (
              <Button variant="danger" onClick={handleRemove} disabled={actionLoading}>
                {actionLoading ? "Removing..." : "Remove from library"}
              </Button>
            )}
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={actionLoading}>
              {actionLoading ? (libraryEntry ? "Saving..." : "Adding...") : "Save"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default VolumeDetailPage;
