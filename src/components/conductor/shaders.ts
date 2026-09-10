/**
 * A walkable ribbon is a bundle of conducting strands, not a textured plane.
 * Vertex density is concentrated along the path so pressure can bend the floor.
 * No shadow map, transmission buffer, external texture or full-screen pass.
 */
export const strandVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  uniform vec2 uPlayer;
  varying vec2 vUv;
  varying vec3 vWorld;
  void main() {
    vec3 p = position;
    float pressure = exp(-dot(p.xz-uPlayer, p.xz-uPlayer)*2.2);
    p.y -= pressure * (0.045 + uSpeed * 0.025);
    // This floor undulation is world-space: overlapping joins sample the same
    // height rather than fighting because their local ribbon UV distances vary.
    p.y += sin((p.x * 0.43 + p.z * 0.51) * 1.7-uTime*1.1) * 0.014;
    vUv = uv;
    vWorld = (modelMatrix * vec4(p,1.0)).xyz;
    gl_Position = projectionMatrix * viewMatrix * vec4(vWorld,1.0);
  }
`;

export const strandFragment = /* glsl */ `
  uniform float uTime;
  uniform float uAwake;
  uniform float uPulseAge;
  uniform float uComplete;
  uniform float uLetter;
  uniform float uJoinEnabled;
  uniform float uRibbonHalfWidth;
  uniform vec2 uPulseOrigin;
  uniform vec2 uPlayer;
  uniform vec4 uJoinSegments[18];
  uniform vec4 uJoinCenters[2];
  varying vec2 vUv;
  varying vec3 vWorld;
  void main() {
    // At the b/d stem contact, two coplanar ribbon faces can cover a pixel.
    // Both use this closest-centerline field, so depth ordering cannot expose
    // mismatched local UV stripes. The 18 segments run only in two small disks.
    float joinBlend = 0.0;
    if (uJoinEnabled > 0.5) {
      for (int center = 0; center < 2; center++) {
        float distanceToCenter = length(vWorld.xz - uJoinCenters[center].xy);
        joinBlend = max(joinBlend, 1.0 - smoothstep(uJoinCenters[center].z, uJoinCenters[center].w, distanceToCenter));
      }
    }
    // Fold the original coordinate to the same unsigned half before blending.
    // The absolute sine is symmetric, so this preserves the untouched strands
    // and avoids sweeping through unrelated stripe phases in the blend annulus.
    float crossUv = 0.5 + abs(vUv.x - 0.5);
    if (joinBlend > 0.0) {
      float nearest = 1000.0;
      for (int segment = 0; segment < 18; segment++) {
        vec2 from = uJoinSegments[segment].xy;
        vec2 to = uJoinSegments[segment].zw;
        vec2 direction = to - from;
        float projection = clamp(dot(vWorld.xz - from, direction) / max(dot(direction, direction), 0.0001), 0.0, 1.0);
        nearest = min(nearest, length(vWorld.xz - (from + direction * projection)));
      }
      // Unsigned distance makes both sides of either centerline sample the
      // same nine-filament field, symmetric about the ribbon midpoint.
      float sharedUv = 0.5 + 0.5 * clamp(nearest / max(uRibbonHalfWidth, 0.0001), 0.0, 1.0);
      crossUv = mix(crossUv, sharedUv, joinBlend);
    }
    // Nine longitudinal filaments. Derivative AA keeps their silver edges
    // stable at distance and at the lower DPR tier.
    float rib = abs(sin(crossUv*9.0*3.14159265));
    float aa = max(fwidth(rib),0.03);
    float filament = 1.0-smoothstep(0.17-aa,0.17+aa,rib);
    float edge = pow(abs(crossUv*2.0-1.0),16.0);
    vec3 view = normalize(cameraPosition-vWorld);
    float fresnel = pow(1.0-abs(view.y),3.0);
    // Optical phases are world-space as well: coincident b/d fragments keep
    // one silver/cyan field regardless of which triangle wins depth testing.
    float opticalPhase = dot(vWorld.xz, vec2(0.61, 0.43));
    vec3 film = 0.5+0.5*cos(vec3(0.2,1.7,3.5)+view.y*7.0+opticalPhase*0.23);
    vec3 silver = mix(vec3(0.31,0.48,0.4),vec3(0.63,0.83,0.72),fresnel);
    silver += film * fresnel * 0.16;
    float glint = pow(0.5+0.5*sin(opticalPhase*0.7-uTime*0.24),12.0);
    float pulseDistance = length(vWorld.xz-uPulseOrigin);
    float wave = exp(-pow((pulseDistance-uPulseAge*7.0)*2.0,2.0));
    wave *= step(0.0,uPulseAge)*(1.0-smoothstep(0.2,2.8,uPulseAge));
    float vicinity = exp(-length(vWorld.xz-uPlayer)*0.27);
    float power = mix(0.1,0.85,uAwake);
    vec3 color = vec3(0.006,0.016,0.012) + silver*(filament*0.64+edge*0.36)*power;
    color += vec3(0.35,0.95,0.62)*(wave*0.9+glint*0.11*uAwake)*filament;
    color += vec3(0.07,0.23,0.14)*vicinity*uAwake*(0.2+filament);
    // After the camera rises, only the letterforms retain full intensity.
    color *= mix(1.0,mix(0.08,1.45,uLetter),uComplete);
    gl_FragColor = vec4(color,mix(1.0-uComplete,1.0,uLetter));
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export const trailVertex = /* glsl */ `
  attribute float born;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vLife;
  void main() {
    vLife = clamp(1.0-(uTime-born)/2.5,0.0,1.0);
    vec4 mv = modelViewMatrix*vec4(position,1.0);
    gl_PointSize = min(16.0,55.0*uPixelRatio/max(1.0,-mv.z))*vLife;
    gl_Position = projectionMatrix*mv;
  }
`;

export const trailFragment = /* glsl */ `
  varying float vLife;
  void main() {
    float radius = length(gl_PointCoord-0.5)*2.0;
    float glow = exp(-radius*radius*5.0)*vLife;
    gl_FragColor = vec4(0.49,1.0,0.72,glow*0.75);
    #include <colorspace_fragment>
  }
`;
