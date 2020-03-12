precision highp float;

#define sat(x) clamp(x, .0, 1.)

varying vec2 vUv;

uniform sampler2D uTexture;
uniform float uDegrade;
uniform float uAlpha;

vec2 N22(vec2 p) {
  vec3 a = fract(p.xyx * vec3(123.34, 234.34, 345.65));
  a += dot(a, a + 34.45);
  return fract(vec2(a.x * a.y, a.y * a.z));
}

void main() {
  vec2 uv = vUv;

  vec4 texture = texture2D(uTexture, uv);

  float degradeFactor = uDegrade * 0.4;
  float degradePoint = 0.;
  float blur = 0.1;

  for (float i = 0.; i < 10.; i++) {
    vec2 point = N22(vec2(i));
    float dist = length(uv - point);
    degradePoint += smoothstep(degradeFactor, degradeFactor - blur, dist);
  }

  texture.a = max(0., 1. - degradePoint) * uAlpha;

  gl_FragColor = texture;
}