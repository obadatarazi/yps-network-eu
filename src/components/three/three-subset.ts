/**
 * Only the Three.js pieces the network globe uses. Importing these by name
 * (instead of `import("three")` as a whole namespace) lets the bundler drop
 * the rest of the library from the globe chunk.
 */
export {
  BackSide,
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Raycaster,
  RingGeometry,
  Scene,
  SphereGeometry,
  Timer,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
