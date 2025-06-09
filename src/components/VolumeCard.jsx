import { Card } from "react-bootstrap";

function VolumeCard({ volume }) {
  return (
    <Card className="h-100 bg-dark text-white card-hover-effect">
      {volume.imageUrl && (
        <Card.Img
          variant="top"
          src={volume.imageUrl}
          alt={volume.name}
          style={{ borderRadius: "6px 6px 0 0", background: "#fff" }}
        />
      )}

      <Card.Body
        className="d-flex flex-column justify-content-between"
        style={{
          background: "transparent",
          borderRadius: "6px",
          minHeight: 140,
          position: "relative",
          paddingBottom: 40,
        }}
      >
        <div>
          <Card.Title style={{ color: "#fff" }}>{volume.name}</Card.Title>
          <Card.Text style={{ marginBottom: 0 }}>
            <strong>Publisher:</strong> {volume.publisher}
            <br />
            <strong>Issues:</strong> {volume.issueCount}
          </Card.Text>
        </div>

        <div
          style={{
            position: "absolute",
            right: 16,
            bottom: 12,
            color: "#FFC107",
            fontWeight: 600,
            fontSize: 15,
            letterSpacing: 1,
            opacity: 0.95,
          }}
        >
          <span>Start Year: {volume.startYear}</span>
        </div>
      </Card.Body>
    </Card>
  );
}

export default VolumeCard;
