/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */



var thresholdShader = {

	uniforms: {

		"tDiffuse": { value: null },
		"opacity": { value: 1.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

		"	vUv = uv;",
		"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform float opacity;",

		"uniform sampler2D tDiffuse;",
		
		"varying vec2 vUv;",
		
		"void main() {",
		"	vec4 texel = texture2D( tDiffuse, vUv );",
		"   float bright = dot(texel.rgb, vec3(0.2627, 0.6780, 0.0593));",
		
		"	gl_FragColor = (bright > 0.5) ? opacity * texel : vec4(.0);",

		"}"

	].join( "\n" )

};

export { thresholdShader };
