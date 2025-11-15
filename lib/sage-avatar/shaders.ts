// WebGL Shaders for Nebula Effects (Three.js)

export const nebulaVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const nebulaFragmentShader = `
uniform float uTime;
uniform vec3 uColorInner;
uniform vec3 uColorOuter;

varying vec2 vUv;

float noise(vec2 p) {
  // Simple fake noise using sin; can be replaced with proper Perlin/Simplex noise
  return 0.5 + 0.5 * sin(p.x * 5.3 + p.y * 7.7 + uTime * 0.4);
}

void main() {
  vec2 centered = vUv - 0.5;
  float r = length(centered) * 2.0;

  // Base radial falloff
  float radial = smoothstep(1.2, 0.0, r);

  // Swirl noise pattern
  float n = noise(centered * 3.0);
  float mixed = mix(radial * 0.6, radial, n);

  // Color gradient from inner to outer
  vec3 color = mix(uColorOuter, uColorInner, mixed);

  // Soft edge fade
  float alpha = mixed * smoothstep(1.1, 0.6, 1.0 - r);

  gl_FragColor = vec4(color, alpha);
}
`;

// Shader uniforms type
export interface NebulaUniforms {
  uTime: { value: number };
  uColorInner: { value: [number, number, number] };
  uColorOuter: { value: [number, number, number] };
}
