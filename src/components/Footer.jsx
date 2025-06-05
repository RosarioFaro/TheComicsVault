function Footer() {
  return (
    <footer className="bg-dark text-light text-center py-3 mt-5">
      <small>
        © {new Date().getFullYear()} TheComicsVault – Capstone Project / Comic data provided by{" "}
        <a href="https://comicvine.gamespot.com/api/" target="_blank" rel="noreferrer" className="text-warning">
          ComicVine
        </a>{" "}
        / Icons by{" "}
        <a
          href="https://www.flaticon.com/free-icons/ebay"
          title="ebay icons"
          target="_blank"
          rel="noreferrer"
          className="text-info"
        >
          Freepik - Flaticon
        </a>
        .
      </small>
    </footer>
  );
}

export default Footer;
