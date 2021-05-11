// attribute vec4 a_color;
attribute vec3 a_position;
attribute vec2 a_uv;

uniform mat3 translationMatrix;
uniform mat3 projectionMatrix;

varying vec2 v_uv;
varying vec4 v_color;

void main() {
    v_uv = a_uv;
	// v_color = a_color;
    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(a_position)).xy, 0.0, 1.0);
}