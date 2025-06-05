import { useState } from "react";
import { Card } from "react-bootstrap";

function VolumeCard({ volume }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      className="h-100 border-2 shadow-sm transition-card"
      style={{
        transform: hovered ? "scale(1.03)" : "scale(1)",
        border: hovered ? "3px solid #FFC107" : "3px solid transparent",
        boxShadow: hovered ? "0 0 24px 2px #f8e82555" : "0 1px 6px 0 #0000001a",
        color: "#fff",
        background: "#181818",
        transition:
          "transform 0.25s cubic-bezier(.4,2,.6,1), border 0.2s, box-shadow 0.2s, color 0.2s, background 0.25s",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {volume.imageUrl && (
        <Card.Img
          variant="top"
          src={volume.imageUrl}
          alt={volume.name}
          style={{ borderRadius: "6px 6px 0 0", background: "#fff" }}
        />
      )}
      <Card.Body
        className="bg-dark d-flex flex-column justify-content-between"
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
