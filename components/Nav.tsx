export default function Nav() {
  return (
    <header className="nav" data-reveal="fade-down">
      <a href="#top" className="brand">
        MONOLITH ATELIER
      </a>
      <nav className="nav-links" aria-label="Primary">
        <a href="#services">Practice</a>
        <a href="#about">Studio</a>
        <a href="#work">Works</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}
