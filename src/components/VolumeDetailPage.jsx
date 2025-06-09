import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Modal, Button, Form, Spinner, Placeholder } from "react-bootstrap";
import safeDescription from "../utils/safeDescription.jsx";
import amazonImg from "../assets/amazon.png";
import ebayImg from "../assets/ebay.png";
import vaultChest from "../assets/treasure.png";
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

  // Nuovo stato per la modale di conferma
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  // Solo apre la modale di conferma, NON cancella direttamente
  const handleRemove = () => {
    setShowDeleteModal(true);
  };

  // Solo dopo la conferma si elimina davvero
  const confirmDelete = async () => {
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
      setShowDeleteModal(false);
    } catch (e) {
      console.log(e);
      setActionError("Error while removing from library.");
      setActionLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 volume-detail-bg custom-container">
        <div className="row align-items-start my-5">
          <div className="col-md-4 d-flex flex-column align-items-center">
            <Placeholder
              as="div"
              animation="wave"
              style={{
                width: 220,
                height: 330,
                borderRadius: 12,
                marginBottom: 18,
                background: "#B6B6B6",
              }}
            />
            <Placeholder
              animation="wave"
              style={{ width: 140, height: 22, marginBottom: 10, borderRadius: 6, background: "#B6B6B6" }}
            />
            <Placeholder
              animation="wave"
              style={{ width: 90, height: 18, marginBottom: 18, borderRadius: 5, background: "#B6B6B6" }}
            />
            <div className="d-flex gap-2 mb-3 w-100" style={{ maxWidth: 300 }}>
              <Placeholder.Button
                animation="wave"
                style={{ width: 120, height: 38, borderRadius: 20, background: "#B6B6B6" }}
              />
              <Placeholder.Button
                animation="wave"
                style={{ width: 120, height: 38, borderRadius: 20, background: "#B6B6B6" }}
              />
            </div>
          </div>
          <div className="col-md-8">
            <Placeholder
              as="h2"
              animation="wave"
              style={{ width: 300, height: 44, marginBottom: 32, borderRadius: 10, background: "#B6B6B6" }}
            />
            <div>
              <div>
                <Placeholder
                  animation="wave"
                  xs={9}
                  style={{ height: 16, marginBottom: 7, borderRadius: 4, background: "#B6B6B6" }}
                />
                <Placeholder
                  animation="wave"
                  xs={11}
                  style={{ height: 16, marginBottom: 7, marginTop: 45, borderRadius: 4, background: "#B6B6B6" }}
                />
                <Placeholder
                  animation="wave"
                  xs={7}
                  style={{ height: 16, marginBottom: 7, borderRadius: 4, background: "#B6B6B6" }}
                />
                <Placeholder
                  animation="wave"
                  xs={12}
                  style={{ height: 16, marginBottom: 7, borderRadius: 4, background: "#B6B6B6" }}
                />
                <Placeholder
                  animation="wave"
                  xs={10}
                  style={{ height: 16, marginBottom: 7, borderRadius: 4, background: "#B6B6B6" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !volume) return <p className="text-center mt-5">Volume not found.</p>;

  const amazonUrl = `https://www.amazon.it/s?k=${encodeURIComponent(volume.name + " " + (volume.publisher || ""))}`;
  const ebayUrl = `https://www.ebay.it/sch/i.html?_nkw=${encodeURIComponent(
    volume.name + " " + (volume.publisher || "")
  )}`;

  return (
    <div className="container mt-5 volume-detail-bg custom-container">
      <h2 className="mx-5">{volume.name}</h2>
      <div className="row align-items-start my-5">
        <div className="col-lg-4 d-flex flex-column align-items-center">
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
          <div className="responsive-action-buttons mb-3 w-100" style={{ maxWidth: 300, width: "100%" }}>
            {libraryLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <Button
                variant={libraryEntry ? "warning" : "primary"}
                onClick={openModal}
                disabled={actionLoading}
                className="btn-market btn-vault d-flex align-items-center justify-content-center gap-2"
                style={{ height: 44, fontWeight: 600, fontSize: 17, flex: 1, minWidth: 0 }}
              >
                <img
                  src={vaultChest}
                  alt="Vault"
                  style={{
                    height: 30,
                    width: "auto",
                    objectFit: "contain",
                  }}
                />
                <span className="button-icon-text">
                  {actionLoading
                    ? libraryEntry
                      ? "Saving..."
                      : "Adding..."
                    : libraryEntry
                    ? "Edit my Vault"
                    : "Add to my Vault"}
                </span>
              </Button>
            )}

            <a
              href={amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-market btn-amazon d-flex align-items-center justify-content-center gap-2"
              style={{ height: 44, fontWeight: 600, fontSize: 17, flex: 1, minWidth: 0 }}
            >
              <img src={amazonImg} alt="Amazon" style={{ height: 30, width: "auto", objectFit: "contain" }} />
              <span className="button-icon-text">Amazon</span>
            </a>

            <a
              href={ebayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-market btn-ebay d-flex align-items-center justify-content-center gap-2"
              style={{ height: 44, fontWeight: 600, fontSize: 17, flex: 1, minWidth: 0 }}
            >
              <img src={ebayImg} alt="eBay" style={{ height: 30, width: "auto", objectFit: "contain" }} />
              <span className="button-icon-text">eBay</span>
            </a>
          </div>
        </div>

        <div className="col-lg-8 d-flex flex-column justify-content-start">
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
              {libraryEntry ? "Edit your entry" : "Add volume to the Vault"}
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
                max={volume.issueCount || 1}
                onChange={(e) => {
                  const max = volume.issueCount || 1;
                  let val = e.target.value === "" ? "" : Math.max(0, Math.min(Number(e.target.value), max));
                  setForm((f) => ({
                    ...f,
                    issue: val,
                    status:
                      val !== "" && Number(val) === max ? "COMPLETED" : f.status === "COMPLETED" ? "READING" : f.status,
                  }));
                }}
                placeholder={`(max ${volume.issueCount || 1})`}
              />
              <Form.Text className="text-secondary">Max: {volume.issueCount}</Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="bg-dark border-0">
            {libraryEntry && (
              <Button variant="danger" onClick={handleRemove} disabled={actionLoading}>
                Remove from library
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

      {/* MODALE DI CONFERMA ELIMINAZIONE */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Remove from Library?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to remove this volume from your library?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={actionLoading}>
            {actionLoading ? "Removing..." : "Remove"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default VolumeDetailPage;
