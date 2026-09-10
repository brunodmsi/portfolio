/**
 * The simplex lattice adapts Ashima Arts / Stefan Gustavson's MIT-licensed
 * webgl-noise construction (full notice in public/licenses.txt). The deformation, conducting pulse,
 * environmental refraction and angular thin-film model are specific to this scene.
 */
export const simplex3D = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

// Continuous 3D simplex noise: four tetrahedral corners, no texture lookup.
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
  m *= m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

// Curl of A=(n,n,n), estimated with central differences. This inexpensive
// divergence-free field tensions a bundle without inflating it like a blob.
vec3 curlNoise(vec3 p) {
  const float e = 0.12;
  float dx = (snoise(p + vec3(e,0,0)) - snoise(p - vec3(e,0,0))) / (2.0*e);
  float dy = (snoise(p + vec3(0,e,0)) - snoise(p - vec3(0,e,0))) / (2.0*e);
  float dz = (snoise(p + vec3(0,0,e)) - snoise(p - vec3(0,0,e))) / (2.0*e);
  return vec3(dy-dz, dz-dx, dx-dy) * 0.26;
}
`;

export const filamentVertex = /* glsl */ `
${simplex3D}
uniform float uTime;
uniform float uDepth;
uniform float uMotion;
uniform float uTension;
uniform vec2 uPointer;
varying vec3 vNormal;
varying vec3 vWorld;
varying vec3 vView;
varying vec2 vUv;
varying float vNoise;

void main() {
  vUv = uv;
  vec3 p = position;
  float slowTime = uTime * 0.075;
  // Scroll changes the width of the flow as the camera travels down its spine.
  float breath = sin(slowTime + p.y * 0.2) * 0.04;
  #ifdef LOW_QUALITY
  // One simplex sample, reused for optical variation, keeps the full silhouette,
  // pointer tension and pulse while removing six finite-difference evaluations.
  float cheapNoise = snoise(p * 0.36 + vec3(slowTime, 0.0, -slowTime));
  vec3 flow = vec3(cheapNoise, sin(p.y * 0.35) * cheapNoise, cos(p.x * 0.24) * cheapNoise) * 0.35;
  vNoise = cheapNoise;
  #else
  vec3 flow = curlNoise(p * 0.36 + vec3(slowTime, 0.0, -slowTime));
  vNoise = snoise(position * 0.55);
  #endif
  p += flow * uMotion * (0.065 + breath * 0.35);
  float distanceToPointer = length(p.xy - uPointer * vec2(8.0, 5.0));
  float pull = exp(-distanceToPointer * distanceToPointer * 0.06);
  p.xy += (uPointer * vec2(0.4, 0.3) - p.xy * 0.018) * pull * uTension;
  p.z += sin(p.y * 0.28 + uDepth * 1.4) * 0.12 * uMotion;
  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorld = world.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vView = cameraPosition - world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

export const filamentFragment = /* glsl */ `
uniform float uTime;
uniform float uPulse;
uniform float uDepth;
uniform float uGlow;
uniform float uIridescence;
uniform vec3 uColor;
varying vec3 vNormal;
varying vec3 vWorld;
varying vec3 vView;
varying vec2 vUv;
varying float vNoise;

// A procedural photographic environment: broad black ground, a long softbox,
// and a cyan-green horizon. Refraction samples this environment, not the DOM.
vec3 environment(vec3 ray) {
  float strip = pow(max(0.0, 1.0 - abs(ray.y * 0.9 + ray.x * 0.35 - 0.3)), 11.0);
  float horizon = pow(1.0 - abs(ray.y), 6.0);
  return vec3(0.012,0.027,0.019) + vec3(0.7,0.95,0.83)*strip + vec3(0.025,0.14,0.12)*horizon;
}

void main() {
  vec3 n = normalize(vNormal);
  vec3 view = normalize(vView);
  if (!gl_FrontFacing) n *= -1.0;
  float incidence = clamp(abs(dot(n, view)), 0.0, 1.0);
  // Schlick-style Fresnel keeps the wet edges bright while the core stays dark.
  float fresnel = 0.04 + 0.96 * pow(1.0 - incidence, 3.0);
  vec3 reflected = environment(reflect(-view, n));
  vec3 refractedRay = refract(-view, n, 1.0 / 1.38);
  vec3 transmitted = environment(refractedRay) * exp(-vec3(0.25,0.07,0.12) * (1.0-incidence));
  // Angular optical path difference produces thin-film interference. Wavelength
  // bands are compressed artistically toward green, cyan, cobalt and pearl.
  float film = 1.1 + vNoise * 0.12 + uDepth * 0.07;
  vec3 interference = 0.5 + 0.5 * cos(6.2831853 * (film * incidence * vec3(1.0,1.28,1.55) + vec3(0.12,0.0,0.18)));
  vec3 iridescent = mix(uColor, interference * vec3(0.5,0.94,0.87), uIridescence * fresnel);
  float key = 0.3 + 0.7 * max(0.0, dot(n, normalize(vec3(-0.5,0.9,0.8))));
  vec3 color = iridescent * key * 0.32 + reflected * (0.66 + fresnel*1.25) + transmitted * 0.18;
  // One impulse travels outward, then returns more slowly and dimly. The tail
  // fades continuously; there are no flashes, cuts, or periodic strobing.
  float age = uTime - uPulse;
  float outward = exp(-pow((vUv.x - age * 0.34) * 35.0, 2.0)) * step(0.0, age) * (1.0-step(3.1,age));
  float returning = exp(-pow((vUv.x - (1.0-(age-3.1)*0.22)) * 25.0, 2.0)) * step(3.1,age) * (1.0-step(7.8,age));
  color += vec3(0.21,1.0,0.5) * (outward * 1.8 + returning * 0.7);
  color += uColor * uGlow * (0.3 + fresnel);
  // Distance absorption gives depth without making HTML content less readable.
  float fog = 1.0 - exp(-length(vView) * 0.017);
  color = mix(color, vec3(0.008,0.014,0.01), fog * 0.45);
  gl_FragColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export const finishFragment = /* glsl */ `
uniform float uTime;
uniform float uGrain;
float hash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7))) * 43758.5453); }
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 centered = uv - 0.5;
  float edge = smoothstep(0.31,0.7,length(centered));
  // Subpixel fringing lives at the lens boundary only. The semantic HTML layer
  // is composed after this pass and is never chromatically displaced.
  vec2 shift = centered * edge * 0.0015;
  vec3 color = inputColor.rgb;
  color.r = mix(color.r, texture2D(inputBuffer, uv + shift).r, edge * 0.7);
  color.b = mix(color.b, texture2D(inputBuffer, uv - shift).b, edge * 0.7);
  float grain = hash(floor(uv * resolution) + floor(uTime * 12.0)) - 0.5;
  color += grain * uGrain;
  color *= 1.0 - edge * 0.15;
  outputColor = vec4(max(color,vec3(0.0)), inputColor.a);
}
`;
