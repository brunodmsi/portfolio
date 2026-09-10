import { Color, ShaderMaterial, type ColorRepresentation } from "three";

type MetalOptions = {
  color: ColorRepresentation;
  accent?: ColorRepresentation;
  roughness?: number;
  glow?: number;
  low?: boolean;
};

/**
 * Self-lit, procedural metal for the walker. The studio strips are calculated
 * from the reflection ray so the sculpt keeps its volume without an env map or
 * scene lights. The glints stay continuous (no derivatives or stepped bands).
 */
export function createMetalMaterial({
  color,
  accent = "#66dcb7",
  roughness = 0.2,
  glow = 0,
  low = false,
}: MetalOptions) {
  return new ShaderMaterial({
    defines: low ? { CONDUCTOR_LOW: 1 } : undefined,
    uniforms: {
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uColor: { value: new Color(color) },
      uAccent: { value: new Color(accent) },
      uRoughness: { value: roughness },
      uGlow: { value: glow },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vWorld;
      varying vec3 vView;
      varying vec3 vObject;

      void main() {
        vObject = position;
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorld = world.xyz;
        vNormal = normalize(mat3(modelMatrix) * normal);
        vView = cameraPosition - world.xyz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform float uPulse;
      uniform float uRoughness;
      uniform float uGlow;
      uniform vec3 uColor;
      uniform vec3 uAccent;
      varying vec3 vNormal;
      varying vec3 vWorld;
      varying vec3 vView;
      varying vec3 vObject;

      // A dark cyclorama, a long softbox and a low cyan horizon. This is an
      // authored reflection field rather than a dependency on Canvas lighting.
      vec3 studio(vec3 ray) {
        float upperBox = pow(max(0.0, 1.0 - abs(ray.y * 0.68 - ray.x * 0.36 - 0.47)), 9.0);
        float sideBox = pow(max(0.0, 1.0 - abs(ray.z * 0.78 + ray.x * 0.52 + 0.12)), 15.0);
        float horizon = pow(max(0.0, 1.0 - abs(ray.y)), 7.0);
        return vec3(0.004, 0.009, 0.009)
          + vec3(0.68, 0.82, 0.78) * upperBox
          + vec3(0.13, 0.70, 0.61) * sideBox
          + vec3(0.015, 0.13, 0.13) * horizon;
      }

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 view = normalize(vView);
        if (!gl_FrontFacing) normal *= -1.0;
        float ndv = clamp(dot(normal, view), 0.0, 1.0);
        float fresnel = 0.035 + 0.965 * pow(1.0 - ndv, 4.2);
        vec3 reflected = studio(reflect(-view, normal));

        // The hue shifts only at angular highlights, like a thin oxide layer
        // over mercury; it is deliberately restrained on the graphite visor.
        float angular = dot(normalize(vObject + vec3(0.31, 0.17, -0.23)), view);
        float glint = 0.5 + 0.5 * sin(angular * 20.0 + uTime * 0.23);
        #ifdef CONDUCTOR_LOW
          glint = 0.5 + 0.5 * sin(angular * 14.0);
        #endif
        vec3 film = mix(uAccent * vec3(0.58, 1.0, 0.92), vec3(0.41, 0.72, 0.77), glint);
        float key = 0.18 + 0.82 * max(0.0, dot(normal, normalize(vec3(-0.42, 0.83, 0.61))));
        vec3 base = uColor * key * (0.28 + uRoughness * 0.52);
        vec3 metal = base + reflected * (0.38 + fresnel * 1.28);
        metal = mix(metal, metal + film * 0.3, fresnel * (1.0 - uRoughness) * 0.62);
        metal += uAccent * uGlow * (0.22 + fresnel * 1.4 + uPulse * 0.6);
        float distanceMist = 1.0 - exp(-length(vView) * 0.055);
        metal = mix(metal, vec3(0.005, 0.01, 0.01), distanceMist * 0.18);
        gl_FragColor = vec4(metal, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
}
