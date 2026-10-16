// Upper/lower bark landmarks traced in each original image's pixel coordinates.
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
    points: [
      [0, 245, 300], [100, 245, 300], [150, 235, 325],
      [230, 242, 333], [300, 260, 345], [400, 286, 349],
      [500, 278, 357], [550, 272, 371], [650, 281, 354],
      [750, 282, 346], [850, 289, 346], [950, 280, 344],
      [1086, 285, 338], [1250, 290, 342], [1350, 290, 351],
      [1450, 295, 357], [1550, 281, 364], [1620, 280, 372],
      [1720, 287, 353], [1820, 264, 350], [1920, 247, 326],
      [2020, 226, 313], [2100, 245, 300], [2172, 245, 300],
    ],
  },
};

export function ropeSurface(x, art) {
  const source = art.compact ? BARK.compact : BARK.wide;
  const nativeX = Math.max(0, Math.min(source.width, (x - art.x) / art.width * source.width));
  const end = source.points.findIndex(point => point[0] >= nativeX);
  const a = source.points[Math.max(0, end - 1)];
  const b = source.points[Math.max(1, end)];
  const t = (nativeX - a[0]) / (b[0] - a[0]);
  const y = edge => art.y + (a[edge] + (b[edge] - a[edge]) * t) / source.height * art.height;
  const dx = (b[0] - a[0]) / source.width * art.width;
  const dy = (b[1] - a[1]) / source.height * art.height;
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  return { top: y(1), under: y(2), angle };
}
