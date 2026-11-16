function MainContent({
  children,
  tagline = "¡Unite al Runway y recolecta la magia!",
}) {
  return (
    <main className="main">
      <h1 className="title">Angel Run</h1>
      <p className="tagline">{tagline}</p>
      <div className="actions">{children}</div>
    </main>
  );
}

export default MainContent;
