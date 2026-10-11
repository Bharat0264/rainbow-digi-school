export function BentoGrid({
  children,
  className = "",
  columns = 12,
  gap = "var(--bento-gap, 28px)",
  style = {},
  ...props
}) {
  return (
    <div
      className={`bento-grid ${className}`.trim()}
      style={{
        "--bento-cols": columns,
        "--bento-gap": typeof gap === "number" ? `${gap}px` : gap,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function BentoItem({
  children,
  colSpan = 12,
  colSpanMd,
  colSpanLg,
  className = "",
  style = {},
  ...props
}) {
  const customStyle = {
    "--item-col-span": colSpan,
    ...(colSpanMd ? { "--item-col-span-md": colSpanMd } : {}),
    ...(colSpanLg ? { "--item-col-span-lg": colSpanLg } : {}),
    ...style,
  };

  return (
    <div
      className={`bento-item ${className}`.trim()}
      style={customStyle}
      {...props}
    >
      {children}
    </div>
  );
}

export default BentoGrid;
