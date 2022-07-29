export const loadImage = function (
  path: string,
  width: number,
  height: number
): HTMLImageElement | undefined {
  const img = new Image(width, height);
  img.src = path;
  return img;
};
