const ScanlinesShader = {
    uniforms: {
      tDiffuse: {
        value: null
      },
      time: {
        value: 0
      },
      noiseAmount: {
        value: 0.8
      },
      linesAmount: {
        value: 0.40
      },
      count: {
        value: 4096
      },
      height: {
        value: 4096
      }
    },
    vertexShader: [
        'varying vec2 vUv;',
        'void main() {',
        'vUv = uv;',
        'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        '}'
    ].join('\n'),
    fragmentShader: [
        'uniform sampler2D tDiffuse;',
        'uniform float time;',
        'uniform float count;',
        'uniform float noiseAmount;',
        'uniform float linesAmount;',
        'uniform float height;',
        'varying vec2 vUv;',
        '#define PI 3.14159265359',
        'highp float rand( const in vec2 uv ) {',
        'const highp float a = 12.9898, b = 78.233, c = 43758.5453;',
        'highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );',
        'return fract(sin(sn) * c);',
        '}',
        'void main() {',
        'vec4 cTextureScreen = texture2D( tDiffuse, vUv );',
        'float dx = rand( vUv + time );',
        'vec3 cResult = cTextureScreen.rgb * dx * noiseAmount;',
        'float lineAmount = height * 1.8 * count;',
        'vec2 sc = vec2( sin( vUv.y * lineAmount), cos( vUv.y * lineAmount) );',
        'cResult += cTextureScreen.rgb * vec3( sc.x, sc.y, sc.x ) * linesAmount;',
        'cResult = cTextureScreen.rgb + ( cResult );',
        'gl_FragColor =  vec4( cResult, cTextureScreen.a );',
        '}'
    ].join('\n')
};

export { ScanlinesShader };
