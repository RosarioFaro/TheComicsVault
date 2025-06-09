import { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Card, Form, Spinner, ListGroup, Pagination } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchVolumi } from "../redux/action";
import { Link } from "react-router-dom";
import axios from "axios";
import VolumeCard from "./VolumeCard";

function VolumesPage() {
  const dispatch = useDispatch();
  const volumi = useSelector((state) => state.volumi.content);
  const loadingDb = useSelector((state) => state.volumi.loading);
  const totalPages = useSelector((state) => state.volumi.totalPages || 1);
  const reduxPage = useSelector((state) => state.volumi.page || 0);

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("startYear,desc");
  const [comicvineResults, setComicvineResults] = useState([]);
  const [loadingComicvine, setLoadingComicvine] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(24);
  const [publisher, setPublisher] = useState("");
  const [publishers, setPublishers] = useState([]);

  const debounceRef = useRef();
  const suggestionsRef = useRef();

  useEffect(() => {
    setPage(reduxPage);
  }, [reduxPage]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("/api/volumes/publishers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setPublishers(res.data))
      .catch(() => setPublishers([]));
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setComicvineResults([]);
      dispatch(fetchVolumi(page, size, "", sort, publisher));
      setShowSuggestions(false);
    }
  }, [dispatch, page, size, query, sort, publisher]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    if (showSuggestions) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSuggestions]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (value.trim().length > 2) {
        setLoadingComicvine(true);
        setShowSuggestions(true);
        const token = localStorage.getItem("token");
        axios
          .get(`/api/volumes/search-comicvine?query=${encodeURIComponent(value)}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => setComicvineResults(res.data))
          .catch(() => setComicvineResults([]))
          .finally(() => setLoadingComicvine(false));
      } else {
        setComicvineResults([]);
        setLoadingComicvine(false);
        dispatch(fetchVolumi(0, size, "", sort, publisher));
        setShowSuggestions(false);
      }
    }, 500);
  };

  const isSearching = query.trim().length > 2;

  const handlePageChange = (p) => {
    setPage(p);
    dispatch(fetchVolumi(p, size, query, sort, publisher));
  };

  const handleSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setSize(newSize);
    setPage(0);
    dispatch(fetchVolumi(0, newSize, query, sort, publisher));
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSort(newSort);
    setPage(0);
    dispatch(fetchVolumi(0, size, query, newSort, publisher));
  };

  return (
    <Container className="my-4 volume-detail-bg p-5 custom-container" style={{ position: "relative" }}>
      <h2 className="mb-4 text-center">Volumes</h2>
      <Form.Control
        type="text"
        placeholder="Search for a volume..."
        value={query}
        onChange={handleChange}
        className="bg-white text-dark mb-4"
        style={{ color: "#222" }}
        onFocus={() => {
          if (comicvineResults.length > 0) setShowSuggestions(true);
        }}
      />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Select
          className="w-auto bg-dark text-white"
          value={sort}
          onChange={handleSortChange}
          style={{ display: "inline-block", width: "auto" }}
        >
          <option value="startYear,desc">Newest</option>
          <option value="startYear,asc">Oldest</option>
          <option value="name,asc">A-Z</option>
          <option value="name,desc">Z-A</option>
          <option value="issueCount,desc">Most Issues</option>
          <option value="issueCount,asc">Less Issues</option>
        </Form.Select>
        <Form.Select
          className="w-auto bg-dark text-white"
          value={publisher}
          onChange={(e) => {
            setPublisher(e.target.value);
            setPage(0);
            dispatch(fetchVolumi(0, size, query, sort, e.target.value));
          }}
          style={{ width: "auto", minWidth: 120, marginRight: 8 }}
        >
          <option value="">All Publishers</option>
          {publishers.map((pub) => (
            <option value={pub.id} key={pub.id}>
              {pub.name}
            </option>
          ))}
        </Form.Select>
        <Form.Select className="w-auto bg-dark text-white" value={size} onChange={handleSizeChange}>
          <option value={12}>12 per page</option>
          <option value={24}>24 per page</option>
          <option value={48}>48 per page</option>
        </Form.Select>
      </div>
      <div style={{ position: "relative" }} ref={suggestionsRef}>
        {isSearching && showSuggestions && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 100,
              background: "#222",
              border: "1px solid #444",
              borderTop: "none",
              maxHeight: 400,
              overflowY: "auto",
              color: "#fff",
            }}
          >
            {loadingComicvine ? (
              <div className="p-3 text-center">
                <Spinner animation="border" size="sm" /> Loading suggestions...
              </div>
            ) : comicvineResults.length > 0 ? (
              <ListGroup variant="flush">
                {comicvineResults.map((v) => (
                  <ListGroup.Item
                    key={v.comicVineId || v.id}
                    style={{
                      background: "#222",
                      color: "#fff",
                      borderBottom: "1px solid #333",
                    }}
                    className="d-flex align-items-center"
                  >
                    <Link
                      to={`/volumes/${v.comicVineId}`}
                      className="text-decoration-none d-flex align-items-center"
                      style={{ color: "#fff", width: "100%" }}
                      onClick={() => setShowSuggestions(false)}
                    >
                      {v.imageUrl && (
                        <img
                          src={v.imageUrl}
                          alt={v.name}
                          style={{
                            width: 64,
                            height: 96,
                            objectFit: "cover",
                            marginRight: 16,
                            borderRadius: 6,
                            background: "#fff",
                          }}
                        />
                      )}
                      <div>
                        <strong>{v.name}</strong>
                        {v.startYear ? ` (${v.startYear})` : ""}{" "}
                        <div className="text-muted" style={{ fontSize: 13 }}>
                          {v.publisher}
                        </div>
                      </div>
                    </Link>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <div className="p-3 text-center text-muted">No ComicVine results.</div>
            )}
          </div>
        )}
      </div>
      {loadingDb && !isSearching ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" />
          <div>Loading Volumes...</div>
        </div>
      ) : (
        <Row xs={1} md={3} lg={4} className="g-4 mt-3">
          {volumi.map((volume) => (
            <Col key={volume.id || volume.name}>
              <Link to={`/volumes/${volume.comicVineId}`} className="text-decoration-none text-dark">
                <VolumeCard volume={volume} />
              </Link>
            </Col>
          ))}
        </Row>
      )}
      {!loadingDb && !isSearching && volumi.length === 0 && <div className="text-center mt-5">No volumes found.</div>}
      {!loadingDb && !isSearching && totalPages > 1 && (
        <Pagination className="justify-content-center mt-4 custom-pagination">
          <Pagination.Prev disabled={page === 0} onClick={() => handlePageChange(page - 1)} />
          {[...Array(totalPages).keys()].map((p) =>
            Math.abs(p - page) <= 2 || p === 0 || p === totalPages - 1 ? (
              <Pagination.Item key={p} active={p === page} onClick={() => handlePageChange(p)}>
                {p + 1}
              </Pagination.Item>
            ) : (
              (p === page - 3 || p === page + 3) && <Pagination.Ellipsis key={p} />
            )
          )}
          <Pagination.Next disabled={page === totalPages - 1} onClick={() => handlePageChange(page + 1)} />
        </Pagination>
      )}
    </Container>
  );
}

export default VolumesPage;
