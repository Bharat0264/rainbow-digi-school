export default function ClayCard({
  children,
  color = "cream",
  shape = "card",
  interactive = false,
  className = "",
  style = {},
  as: Component = "div",
  ...props
}) {
  const colorClass = `clay-${color}`;
  const shapeClass = shape !== "card" ? `clay-shape-${shape}` : "";
  const interactiveClass = interactive ? "clay-interactive" : "";

  return (
    <Component
      className={`clay-tile ${colorClass} ${shapeClass} ${interactiveClass} ${className}`.trim()}
      style={style}
      {...props}
    >
      <div className="clay-tile-inner">{children}</div>
    </Component>
  );
}
