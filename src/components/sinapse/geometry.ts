import { BufferGeometry, CatmullRomCurve3, TorusGeometry, TubeGeometry, Vector3 } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

function mergeAndDispose(parts: BufferGeometry[]) {
  const merged = mergeGeometries(parts, false);
  parts.forEach((part) => part.dispose());
  return merged;
}

/** Open, asymmetric spinal curve. Its returning loop is a bundle, never a skin. */
export function createFilaments(low: boolean) {
  const backbone = new CatmullRomCurve3([
    new Vector3(-12, -5, -3), new Vector3(-7, -3.3, -1), new Vector3(-2, -.2, .2),
    new Vector3(2.7, 3.2, -.6), new Vector3(6.1, 2.5, -.8), new Vector3(5.6, .1, 1.4),
    new Vector3(2.7, -.9, 1), new Vector3(1.1, 1.0, -.2), new Vector3(3.5, 3.8, 1),
    new Vector3(7, 5, -1), new Vector3(12, 5.2, -4),
  ]);
  const count = low ? 22 : 46;
  const segments = low ? 72 : 138;
  const pieces: BufferGeometry[] = [];
  const up = new Vector3(0, 0, 1);
  for (let i = 0; i < count; i++) {
    const points: Vector3[] = [];
    const phase = i * 2.399963;
    for (let j = 0; j <= 92; j++) {
      const t = j / 92;
      const center = backbone.getPoint(t);
      const tangent = backbone.getTangent(t);
      const normal = new Vector3().crossVectors(tangent, up).normalize();
      const binormal = new Vector3().crossVectors(tangent, normal).normalize();
      const radius = (.22 + Math.pow(Math.sin(t * Math.PI), 2) * 1.2) * (.22 + Math.sqrt(i / count) * .8);
      const angle = phase + t * 5.4;
      center.addScaledVector(normal, Math.cos(angle) * radius);
      center.addScaledVector(binormal, Math.sin(angle) * radius * .8);
      points.push(center);
    }
    pieces.push(new TubeGeometry(new CatmullRomCurve3(points), segments, i % 8 === 0 ? .04 : .013 + (i % 3) * .004, low ? 4 : 5, false));
  }
  return mergeAndDispose(pieces);
}

/** These physical conductors persist between all five camera stations. */
export function createSpine(low: boolean) {
  const parts: BufferGeometry[] = [];
  const count = low ? 7 : 13;
  for (let i = 0; i < count; i++) {
    const d = (i - count / 2) * .09;
    const points = [
      new Vector3(6 + d, 4, -3), new Vector3(7 + d * 2, -3, -1), new Vector3(-5 + d, -12, -.3),
      new Vector3(-3 + d * 4, -17, 2), new Vector3(6 + d * 2, -23, -1), new Vector3(-5 + d, -31, 0),
      new Vector3(5 + d * 3, -40, -3), new Vector3(4 + d, -49, 1), new Vector3(-3 + d, -56, -2),
    ];
    parts.push(new TubeGeometry(new CatmullRomCurve3(points), low ? 170 : 260, i % 4 === 0 ? .028 : .012, 4, false));
  }
  return mergeAndDispose(parts);
}

export function createNode(index: number, low: boolean) {
  const parts: BufferGeometry[] = [];
  if (index === 0) {
    for (let i = 0; i < 9; i++) {
      const points: Vector3[] = [];
      for (let j = 0; j <= 110; j++) {
        const t = j / 110 * Math.PI * 2;
        const radius = 1 + Math.cos(3 * t) * .28;
        points.push(new Vector3(radius * Math.cos(2 * t), radius * Math.sin(2 * t), Math.sin(3 * t) * .43 + (i - 4) * .055));
      }
      parts.push(new TubeGeometry(new CatmullRomCurve3(points, true), low ? 95 : 150, .022 + i * .001, 5, true));
    }
  } else if (index === 1) {
    for (let i = 0; i < 12; i++) {
      const points: Vector3[] = [];
      const phase = i * Math.PI * 2 / 12;
      for (let j = 0; j <= 72; j++) {
        const t = j / 72;
        const angle = t * Math.PI * 3 + phase;
        const radius = .42 + Math.sin(t * Math.PI) * .26;
        points.push(new Vector3(Math.cos(angle) * radius, (t - .5) * 3, Math.sin(angle) * radius));
      }
      parts.push(new TubeGeometry(new CatmullRomCurve3(points), low ? 60 : 90, .025, 5, false));
    }
  } else if (index === 2) {
    for (let i = 0; i < 9; i++) {
      const ring = new TorusGeometry(1 + i * .025, .018, 5, 4);
      ring.rotateZ(Math.PI / 4);
      ring.rotateY(i / 9 * Math.PI);
      ring.rotateX(.3);
      parts.push(ring);
    }
  } else {
    for (let i = 0; i < 13; i++) {
      const points: Vector3[] = [];
      for (let j = 0; j <= 90; j++) {
        const t = j / 90 * Math.PI * 2;
        const twist = (i - 6) * .085;
        points.push(new Vector3(Math.cos(t) * 1.6, Math.sin(t) * (.45 + i * .02), Math.sin(t * 2) * .28 + Math.cos(t) * twist));
      }
      parts.push(new TubeGeometry(new CatmullRomCurve3(points, true), low ? 60 : 100, .016 + (i % 3) * .006, 5, true));
    }
  }
  return mergeAndDispose(parts);
}

export function createPortal(low: boolean) {
  const parts: BufferGeometry[] = [];
  const count = low ? 10 : 19;
  for (let i = 0; i < count; i++) {
    const points: Vector3[] = [];
    for (let j = 0; j <= 92; j++) {
      const t = j / 92;
      const angle = t * Math.PI * 2.2 - .8;
      const radius = 2.4 + i * .043 + Math.sin(t * Math.PI) * .4;
      points.push(new Vector3(Math.cos(angle) * radius + t * .5, Math.sin(angle) * radius * 1.2, Math.sin(angle * 2 + i * .2) * .34));
    }
    parts.push(new TubeGeometry(new CatmullRomCurve3(points), low ? 80 : 130, i % 5 === 0 ? .035 : .016, 5, false));
  }
  return mergeAndDispose(parts);
}

export function createOrbit() {
  const points = Array.from({ length: 97 }, (_, i) => {
    const angle = i / 96 * Math.PI * 2;
    return new Vector3(Math.cos(angle), Math.sin(angle), 0);
  });
  return new TubeGeometry(new CatmullRomCurve3(points, true), 96, .003, 3, true);
}
