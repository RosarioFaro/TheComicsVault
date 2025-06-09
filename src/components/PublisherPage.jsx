import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import safeDescription from "../utils/safeDescription.jsx";
import axios from "axios";
import { Placeholder } from "react-bootstrap";
import { Link } from "react-router-dom";

function PublisherPage() {
  const { id } = useParams();
  const [publisher, setPublisher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    console.log("[DEBUG] PublisherPage mounted con id:", id);
    if (!id || id === "null" || isNaN(Number(id))) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    setLoading(true);
    setNotFound(false);
    const token = localStorage.getItem("token");

    axios
      .get(`/api/publisher/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPublisher(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Errore PRIMA fetch:", err?.response?.status, err?.response);
        if (err.response && err.response.status === 404) {
          axios
            .get(`/api/publisher/search-comicvine?id=${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
              setPublisher(res.data);
              setLoading(false);
            })
            .catch((err) => {
              console.log("Errore SECONDA fetch:", err?.response?.status, err?.response);
              setNotFound(true);
              setLoading(false);
            });
        } else {
          setNotFound(true);
          setLoading(false);
        }
      });
  }, [id]);

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
  if (notFound || !publisher) return <p className="text-center mt-5">Publisher non trovato.</p>;

  return (
    <div className="container mt-5 volume-detail-bg custom-container">
      <h2 className="text-start mb-4" style={{ marginLeft: 0 }}>
        {publisher.name}
      </h2>
      <div className="publisher-media-grid">
        <img src={publisher.imageUrl} alt={publisher.name} className="publisher-img" />
        <div className="publisher-description">{safeDescription(publisher.description)}</div>
      </div>
    </div>
  );
}

export default PublisherPage;
