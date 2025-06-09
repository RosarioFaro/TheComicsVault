import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import { fetchVolumi, fetchRecommendedVolumes } from "../redux/action";
import { Link } from "react-router-dom";

function HomePage() {
  const dispatch = useDispatch();
  const [visibleLatest, setVisibleLatest] = useState(5);
  const [visibleRecommended, setVisibleRecommended] = useState(5);

  const volumes = useSelector((state) => state.volumi.content.slice(0, 10));
  const recommended = useSelector((state) => state.volumi.recommended.slice(0, 10));
  const loading = useSelector((state) => state.volumi.loading);

  useEffect(() => {
    dispatch(fetchVolumi(0, 20, "", "startYear,desc"));
    dispatch(fetchRecommendedVolumes([7257, 44417, 6209, 28590, 108799, 81837, 26303, 119845, 132199, 18867]));
  }, [dispatch]);

  return (
    <Container className="my-5 text-light volume-detail-bg custom-container">
      <h2 className="text-center mb-4">Welcome To TheComicsVault</h2>
      <br />
      <h4 className="text-center mb-4">
        Find your next favorite comic, log your progress, and expand your personal vault.
      </h4>
      <Row>
        <Col md={6}>
          <h4 className="mb-3">Latest Volumes</h4>
          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status" />
              <div>Loading...</div>
            </div>
          ) : (
            <>
              <div className="d-flex flex-column gap-3">
                {volumes.slice(0, visibleLatest).map((volume) => (
                  <Card key={volume.id} className="bg-dark text-white card-hover-effect">
                    <Link to={`/volumes/${volume.comicVineId}`} className="text-decoration-none text-white">
                      <div className="d-flex align-items-center p-2">
                        <img
                          src={volume.imageUrl}
                          alt={volume.name}
                          style={{ width: 64, height: 96, objectFit: "cover", borderRadius: 6 }}
                          className="me-3"
                        />
                        <div>
                          <strong>{volume.name}</strong>
                          <div className="text-warning" style={{ fontSize: "0.9rem" }}>
                            {volume.startYear}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-3 d-flex justify-content-center gap-2">
                {visibleLatest < 10 && (
                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={() => setVisibleLatest((n) => Math.min(n + 5, 10))}
                  >
                    Show More
                  </Button>
                )}
                {visibleLatest > 5 && (
                  <Button variant="outline-light" size="sm" onClick={() => setVisibleLatest(5)}>
                    Show Less
                  </Button>
                )}
              </div>
            </>
          )}
        </Col>

        <Col md={6}>
          <h4 className="mb-3">Recommended</h4>
          {recommended.length === 0 ? (
            <p>No recommendations available.</p>
          ) : (
            <>
              <div className="d-flex flex-column gap-3">
                {recommended.slice(0, visibleRecommended).map((rec) => (
                  <Card key={rec.id} className="bg-dark text-white card-hover-effect">
                    <Link to={`/volumes/${rec.comicVineId}`} className="text-decoration-none text-white">
                      <div className="d-flex align-items-center p-2">
                        <img
                          src={rec.imageUrl}
                          alt={rec.name}
                          style={{ width: 64, height: 96, objectFit: "cover", borderRadius: 6 }}
                          className="me-3"
                        />
                        <div>
                          <strong>{rec.name}</strong>
                          <div className="text-warning" style={{ fontSize: "0.9rem" }}>
                            {rec.startYear}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-3 d-flex justify-content-center gap-2">
                {visibleRecommended < 10 && (
                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={() => setVisibleRecommended((n) => Math.min(n + 5, 10))}
                  >
                    Show More
                  </Button>
                )}
                {visibleRecommended > 5 && (
                  <Button variant="outline-light" size="sm" onClick={() => setVisibleRecommended(5)}>
                    Show Less
                  </Button>
                )}
              </div>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
