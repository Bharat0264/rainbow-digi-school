import { Link } from "react-router-dom";

export default function GlassButton({
  children,
  variant = "primary",
  to,
  href,
  className = "",
  style = {},
  ...props
}) {
  const baseClass = {
    primary: "glass-btn glass-btn--primary",
    secondary: "glass-btn glass-btn--secondary",
    pill: "glass-btn glass-btn--pill",
  }[variant] || "glass-btn glass-btn--primary";

  const fullClassName = `${baseClass} ${className}`.trim();

  const content = (
    <>
      <span className="glass-btn-reflection" aria-hidden="true" />
      <span className="glass-btn-shimmer" aria-hidden="true" />
      <span className="glass-btn-text">{children}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={fullClassName} style={style} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={fullClassName} style={style} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button className={fullClassName} style={style} {...props}>
      {content}
    </button>
  );
}
