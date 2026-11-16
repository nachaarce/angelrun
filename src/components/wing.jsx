function Wing({ side = "left" }) {
  return (
    <svg
      className={`wing wing-${side}`}
      width="48"
      height="48"
      viewBox="0 0 60 60"
      aria-hidden="true"
    >
      <path d="M58 52 C40 48 14 30 6 4 C28 10 50 28 58 52Z" fill="#ff8cc6" />
      <path d="M58 52 C36 50 10 44 2 24 C24 26 46 36 58 52Z" fill="#ff5fae" />
      <path d="M58 52 C40 54 20 56 10 46 C28 44 46 46 58 52Z" fill="#ff2a8a" />
    </svg>
  );
}

export default Wing;
