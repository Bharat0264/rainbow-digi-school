import { Link } from "react-router-dom";

export default function ClayButton({
  children,
  color = "yellow",
  to,
  href,
  className = "",
  style = {},
  disabled = false,
  ...props
}) {
  const fullClassName = `clay-btn clay-btn-${color} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={fullClassName} style={style} {...props}>
        <span>{children}</span>
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={fullClassName} style={style} {...props}>
        <span>{children}</span>
      </a>
    );
  }

  return (
    <button className={fullClassName} style={style} disabled={disabled} {...props}>
      <span>{children}</span>
    </button>
  );
}
