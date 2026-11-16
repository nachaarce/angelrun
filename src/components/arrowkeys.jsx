const ARROWS = {
  up: "M12 19V5M5 12l7-7 7 7",
  left: "M19 12H5M12 5l-7 7 7 7",
  down: "M12 5v14M5 12l7 7 7-7",
  right: "M5 12h14M12 5l7 7-7 7",
};

function ArrowKeys() {
  return (
    <div className="arrow-keys" aria-hidden="true">
      {Object.entries(ARROWS).map(([dir, path]) => (
        <span key={dir} className={`key key-${dir}`}>
          <svg viewBox="0 0 24 24">
            <path
              d={path}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}

export default ArrowKeys;
