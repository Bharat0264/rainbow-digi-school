export default function GlassCard({
  children,
  variant = "glass",
  className = "",
  interactive = false,
  as: Component = "div",
  style = {},
  ...props
}) {
  const variantClass = {
    glass: "glass-card",
    matte: "glass-card glass-card--matte",
    orange: "glass-card glass-card--orange",
    green: "glass-card glass-card--green",
  }[variant] || "glass-card";

  const interactiveClass = interactive ? "glass-card--interactive" : "";

  return (
    <Component
      className={`${variantClass} ${interactiveClass} ${className}`.trim()}
      style={style}
      {...props}
    >
      {/* Specular top-left light sheen overlay */}
      <span className="glass-specular" aria-hidden="true" />
      {variant === "green" && <span className="glass-silk-wave" aria-hidden="true" />}
      <div className="glass-card-content">{children}</div>
    </Component>
  );
}
