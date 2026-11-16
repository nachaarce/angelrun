import Header from "../components/header.jsx";
import MainContent from "../components/maincontent.jsx";
import Button from "../components/button.jsx";
import Footer from "../components/footer.jsx";

function Home({ onPlay, onInstructions }) {
  return (
    <div className="screen">
      <Header />
      <MainContent>
        <Button onClick={onPlay}>JUGAR</Button>
        <Button variant="secondary" onClick={onInstructions}>
          CÓMO JUGAR
        </Button>
      </MainContent>
      <Footer />
    </div>
  );
}

export default Home;
