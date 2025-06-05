import { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

function ScrollToTopButton() {
  const [show, setShow] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return show ? (
    <button
      onClick={scrollToTop}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed",
        bottom: "40px",
        right: "40px",
        zIndex: 999,
        border: "none",
        outline: "none",
        background: hovered ? "#ffc107" : "#0d6efd",
        color: hovered ? "#222" : "#fff",
        borderRadius: "50%",
        width: "48px",
        height: "48px",
        boxShadow: "0 2px 8px #000a",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.7rem",
        opacity: 0.85,
        transition: "background 0.2s, color 0.2s, opacity 0.2s",
      }}
      title="Torna su"
      aria-label="Torna su"
    >
      <FaArrowUp />
    </button>
  ) : null;
}

export default ScrollToTopButton;
