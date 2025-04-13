uniform sampler2D uTexture;
uniform vec2 uOffset;
uniform float uAlpha;
varying vec2 vUv;

vec3 rgbShift( sampler2D textureImg , vec2 uv , vec2 offset) {
    float r = texture2D(textureImg , uv + offset).r;
    vec2 gb = texture2D(textureImg , uv).gb;
    return vec3(r,gb);
}

void main() {
    // vec4 color = texture2D(uTexture, vUv);
    vec3 color = rgbShift(uTexture, vUv , uOffset);
    gl_FragColor = vec4(color, uAlpha);
}

