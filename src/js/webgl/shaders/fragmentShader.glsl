precision highp float;

#define sat(x) clamp(x, .0, 1.)

varying vec2 vUv;

uniform sampler2D texture1;
uniform sampler2D texture2;
uniform float degrade;

vec2 N22(vec2 p) {
  vec3 a = fract(p.xyx * vec3(123.34, 234.34, 345.65));
  a += dot(a, a + 34.45);
  return fract(vec2(a.x * a.y, a.y * a.z));
}

void main() {
  vec2 uv = vUv;

  vec4 texture1 = texture2D(texture1, uv);
  vec4 texture2 = texture2D(texture2, uv);

  float alpha = 0.;

  for (float i = 0.; i < 20.; i++) {
    vec2 point = N22(vec2(i));
    float d = length(uv - point);
    alpha += smoothstep(degrade, 0., d);
  }

  texture1.a = max(0., 1. - alpha);
  texture2.a = alpha * 0.1;

  gl_FragColor = mix(texture1, texture2, min(1., alpha));
}