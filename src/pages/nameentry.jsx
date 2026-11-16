import { useState } from "react";
import Header from "../components/header.jsx";
import MainContent from "../components/maincontent.jsx";
import Button from "../components/button.jsx";
import Wing from "../components/wing.jsx";
import Footer from "../components/footer.jsx";

function NameEntry({ onStart, onBack }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const clean = name.trim();
    if (clean) onStart(clean);
  };

  return (
    <div className="screen">
      <Header />
      <MainContent tagline="¿Cuál es tu nombre Angel?">
        <form className="name-form" onSubmit={handleSubmit}>
          <input
            className="name-input"
            type="text"
            placeholder=""
            aria-label="Tu nombre"
            maxLength={12}
            autoFocus
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="cta-wrap">
            <Wing side="left" />
            <Button type="submit" variant="cta">
              ¡A JUGAR!
            </Button>
            <Wing side="right" />
          </div>

          <Button variant="secondary" size="sm" onClick={onBack}>
            VOLVER
          </Button>
        </form>
      </MainContent>
      <Footer />
    </div>
  );
}

export default NameEntry;
