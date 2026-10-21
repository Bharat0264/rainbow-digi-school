// Upper/lower bark landmarks in each currently rendered artwork frame.
// These are rope contact surfaces, independent of the squirrel's walking path.
const BARK = {
  compact: {
    width: 1536, height: 1024,
    points: [
      [0, 375, 440], [150, 370, 470], [240, 380, 470],
      [275, 400, 482], [325, 412, 498], [355, 418, 515],
      [411, 423, 535], [450, 422, 550], [550, 413, 526],
      [650, 430, 500], [800, 438, 488], [900, 430, 515],
      [1000, 430, 535], [1100, 432, 550], [1125, 437, 554],
      [1180, 440, 540], [1210, 444, 530], [1261, 433, 518],
      [1320, 407, 490], [1400, 390, 480], [1536, 390, 450],
    ],
  },
  wide: {
    width: 2172, height: 430,
    // Trace the replacement log itself, excluding twigs and hanging leaves.
    // Keep the house-rail interval unchanged: its connectors have fixed mounts.
    points: [
      [0, 245, 300], [100, 242, 306], [150, 233, 297],
      [189, 231, 304], [230, 236, 318], [308, 254, 333],
      [400, 273, 344], [434, 273, 347], [500, 273, 362],
      [553, 277, 377], [650, 293, 361], [679, 298, 363],
      [750, 294, 355], [798, 289, 355], [850, 281, 350],
      [950, 280, 344], [1086, 285, 338], [1250, 290, 342],
      [1320, 302, 355], [1374, 305, 362], [1450, 295, 368],
      [1493, 293, 366], [1550, 299, 365], [1619, 309, 358],
      [1738, 286, 355], [1820, 270, 348], [1864, 262, 345],
      [1920, 250, 337], [1983, 246, 326], [2020, 241, 316],
      [2100, 236, 303], [2172, 245, 300],
    ],
  },
};

function barkAt(x, art) {
  const source = art.compact ? BARK.compact : BARK.wide;
  const nativeX = Math.max(0, Math.min(source.width, (x - art.x) / art.width * source.width));
  const end = source.points.findIndex(point => point[0] >= nativeX);
  const a = source.points[Math.max(0, end - 1)];
  const b = source.points[Math.max(1, end)];
  const t = (nativeX - a[0]) / (b[0] - a[0]);
  const y = edge => art.y + (a[edge] + (b[edge] - a[edge]) * t) / source.height * art.height;
  return { top: y(1), under: y(2) };
}

export function ropeSurface(x, art) {
  const source = art.compact ? BARK.compact : BARK.wide;
  // Average over the width of a coil rather than using a single short segment.
  const radius = 24 / source.width * art.width;
  const left = barkAt(x - radius, art), right = barkAt(x + radius, art);
  const slope = ((right.top + right.under) - (left.top + left.under)) / (4 * radius);
  const angle = Math.atan(slope) * 180 / Math.PI;
  const { under } = barkAt(x, art);
  let top = barkAt(x, art).top;
  // Intersect the upper bark with the normal through the lower rope anchor.
  // The coil leans around the branch; the strand below it remains at x.
  for (let i = 0; i < 5; i++) top = barkAt(x + slope * (under - top), art).top;
  const thickness = under - top;
  return { top, under, angle, thickness, centerY: (top + under) / 2 };
}

export function ropeWrapFit(x, top, under, angle, ropeThickness) {
  const radians = angle * Math.PI / 180;
  const joinY = under + ropeThickness * .42;
  // Source loop crown and lower turn are y=60 and y=980 respectively.
  // Dividing by cos keeps both bark contacts fitted after rotating the coil.
  const bodyHeight = (under - top + ropeThickness * .84) / Math.cos(radians);
  const width = ropeThickness * 4;
  return { x: x - width / 2, y: joinY - bodyHeight, width,
    height: bodyHeight * 940 / 920, joinY, bodyHeight,
    transform: `rotate(${angle} ${x} ${joinY})` };
}
