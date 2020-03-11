precision highp float;

#define sat(x) clamp(x, .0, 1.)

varying vec2 vUv;

uniform sampler2D uTexture;
uniform float uDegrade;
uniform float uAlpha;

// 2D Random
float random (in vec2 st) {
  return fract(
    sin(
      dot(st.xy, vec2(12.9898,78.233))
    ) * 43758.5453123
  );
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  // Four corners in 2D of a tile
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  // Smooth Interpolation

  // Cubic Hermine Curve.  Same as SmoothStep()
  vec2 u = f*f*(3.0-2.0*f);
  u = smoothstep(0.,1.,f);

  // Mix 4 coorners percentages
  return mix(a, b, u.x) +
    (c - a)* u.y * (1.0 - u.x) +
    (d - b) * u.x * u.y;
}

void main() {
  vec2 uv = vUv;

  vec4 texture = texture2D(uTexture, uv);
  vec2 point = vec2(uv * 5.);
  float n = noise(point);
  float alpha = smoothstep(1., n, uDegrade);

  texture.a = max(0., alpha) * uAlpha;

  gl_FragColor = texture;
}