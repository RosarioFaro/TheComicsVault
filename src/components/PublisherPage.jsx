import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import safeDescription from "../utils/safeDescription.jsx";
import axios from "axios";

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

  if (loading) return <p className="text-center mt-5">Caricamento publisher...</p>;
  if (notFound || !publisher) return <p className="text-center mt-5">Publisher non trovato.</p>;

  return (
    <div className="container mt-5 volume-detail-bg">
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
