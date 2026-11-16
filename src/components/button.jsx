import { audio } from "../game/audio.js";

// sound: nombre del sonido al hacer clic. Por defecto "click" (secundarios)
// o "select" (el resto). Con sound="none" no suena nada.
function Button({
  children,
  variant = "primary",
  type = "button",
  size,
  onClick,
  sound,
}) {
  const sizeClass = size === "sm" ? " btn-sm" : "";

  const handleClick = (e) => {
    audio.play(sound ?? (variant === "secondary" ? "click" : "select"));
    if (onClick) onClick(e);
  };

  return (
    <button
      type={type}
      className={`btn btn-${variant}${sizeClass}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

export default Button;
