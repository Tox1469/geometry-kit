export interface Point { x: number; y: number }
export interface BBox { x: number; y: number; width: number; height: number }
export interface Line { a: Point; b: Point }

export function pointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const pi = polygon[i], pj = polygon[j];
    const intersect = ((pi.y > point.y) !== (pj.y > point.y)) &&
      (point.x < ((pj.x - pi.x) * (point.y - pi.y)) / (pj.y - pi.y) + pi.x);
    if (intersect) inside = !inside;
  }
  return inside;
}

export function lineIntersection(l1: Line, l2: Line): Point | null {
  const x1 = l1.a.x, y1 = l1.a.y, x2 = l1.b.x, y2 = l1.b.y;
  const x3 = l2.a.x, y3 = l2.a.y, x4 = l2.b.x, y4 = l2.b.y;
  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (denom === 0) return null;
  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;
  return { x: x1 + t * (x2 - x1), y: y1 + t * (y2 - y1) };
}

export function bbox(points: Point[]): BBox {
  if (points.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
  let minX = points[0].x, maxX = minX, minY = points[0].y, maxY = minY;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

export function bboxIntersect(a: BBox, b: BBox): boolean {
  return !(b.x > a.x + a.width || b.x + b.width < a.x || b.y > a.y + a.height || b.y + b.height < a.y);
}

export function pointInBBox(p: Point, b: BBox): boolean {
  return p.x >= b.x && p.x <= b.x + b.width && p.y >= b.y && p.y <= b.y + b.height;
}

export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function polygonArea(polygon: Point[]): number {
  let area = 0;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    area += (polygon[j].x + polygon[i].x) * (polygon[j].y - polygon[i].y);
  }
  return Math.abs(area / 2);
}

export function polygonCentroid(polygon: Point[]): Point {
  let x = 0, y = 0;
  for (const p of polygon) { x += p.x; y += p.y; }
  return { x: x / polygon.length, y: y / polygon.length };
}
