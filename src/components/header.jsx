import SoundControls from "./soundcontrols.jsx";

function Header({ showSound = true, showBrand = true }) {
  return (
    <header className="header">
      {showSound && <SoundControls />}
      {showBrand && <p className="brand">Victoria’s Secret</p>}
    </header>
  );
}

export default Header;
