import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from '../assets/shaders/rgbshiftShader.js';
import { CopyShader } from '../assets/shaders/CopyShader.js';
import { AdditiveShader } from '../assets/shaders/additiveShader.js';
import { thresholdShader } from '../assets/shaders/threshold.js';
import { ScanlinesShader } from '../assets/shaders/ScanlinesShader.js';
import { HorizontalBlurShader } from 'three/examples/jsm/shaders/HorizontalBlurShader.js';
import { VerticalBlurShader } from 'three/examples/jsm/shaders/VerticalBlurShader.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { NumbersService } from './numbers.service';
import { Vec2 } from 'three';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'threejsexperiments';
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  renderer = new THREE.WebGLRenderer({ antialias: true });
  composer = new EffectComposer( this.renderer );
  controls = new OrbitControls( this.camera, this.renderer.domElement );

  group = new THREE.Group();
  digits = [];
  flickerCells = [];
  digitLookup = [];
  timeShaders = [];
  frame = 0;
  digitCount = 5;
  loadingBarGroup = null;
  rgbShiftPassEnabled = true;
  scanlinePassEnabled = false;
  glitchPassEnabled = false;

  constructor(private numberService: NumbersService) { }

  ngOnInit() {

    // this.camera.position.z = 25;
    RectAreaLightUniformsLib.init();
    this.camera.position.z = 150;
    this.controls.update();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.composer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x111111, 1);
    document.body.appendChild( this.renderer.domElement );
    // document.body.appendChild( this.glowRenderer.domElement );
    // handle resize window
    window.addEventListener('resize', () => {
      this.handleResize();
    });
    // this.addSomeStuff();
    this.addNumbers(65);
    // this.digits.forEach((digit) => {
    //   this.generateLilNumber(digit);
    // });
    this.loadingBar();
    for (let xIndex = -400; xIndex < 400; xIndex += 30) {
      for (let yIndex = -400; yIndex < 400; yIndex += 30) {
        this.generateSkullWidget(new THREE.Vector2(xIndex, yIndex)); 
      }
    }
    this.backgroundShape();
    this.addPasses();
    this.animate();
    // this.addAmbientLight();
    this.digitLookup = this.numberService.getDigitLookup();
    // this.addRectLight();
  }
  addAmbientLight() {
    const ambient = new THREE.AmbientLight( 0xffffff, 4 );
    this.scene.add(ambient);
  }
  handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.setSize(width, height);
    this.composer.setSize( width, height );
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  addNumbers(digitWidth) {
    this.digits = [];
    for (let index = 0; index < this.digitCount; index++) {
      const digitMesh = this.numberService.generateDigit(this.numberService.getRandomInt(10));
      digitMesh.position.x += (index * digitWidth) - (.5 * digitWidth * this.digitCount);
      this.digits.push(digitMesh);
      this.scene.add(digitMesh);
      this.generateLilNumber(digitMesh);
    }
  }
  loadingBar() {
    const loadingBarGroup = new THREE.Group();
    const segmentCount = 20;
    const segmentLength = 40;
    const segmentOffset = 10;
    const segmentHeight = 10;
    for (let index = 0; index < segmentCount; index++) {
      const loadingThing = new THREE.Shape([
        new THREE.Vector2(0, 0),
        new THREE.Vector2(segmentLength - segmentOffset, 0),
        new THREE.Vector2(segmentLength, segmentHeight),
        new THREE.Vector2(segmentOffset, segmentHeight),
      ]);
      const loadingThingGeometry = new THREE.ShapeGeometry(loadingThing);
      const loadingThingMesh = new THREE.Mesh(loadingThingGeometry, this.numberService.materialON);
      loadingThingMesh.position.x += (index * segmentLength) - .5 * segmentLength * segmentCount;
      loadingBarGroup.add(loadingThingMesh);
    }

    loadingBarGroup.position.y -= 20;
    this.loadingBarGroup = loadingBarGroup;
    this.scene.add(loadingBarGroup);
  }
  backgroundShape() {
    const bevelSize = 30;
    const width = 400;
    const height = 200;
    const backdrop = new THREE.Shape([
      new THREE.Vector2(0, 0),
      new THREE.Vector2(width - bevelSize, 0),
      new THREE.Vector2(width, bevelSize),
      new THREE.Vector2(width, height - bevelSize),
      new THREE.Vector2(width - bevelSize, height),
      new THREE.Vector2(bevelSize, height),
      new THREE.Vector2(0, height - bevelSize),
      // new THREE.Vector2(0, bevelSize),
    ]);
    const backdropGeometry = new THREE.ShapeGeometry(backdrop);
    backdropGeometry.translate((-.5 * width), (-.5*height), -10);
    const backdropMesh = new THREE.Mesh(backdropGeometry, new THREE.MeshBasicMaterial({ color: 0x555555 }));
    this.scene.add(backdropMesh);
  }
  updateLoadingBar() {
    if (this.loadingBarGroup) {
      this.loadingBarGroup.children.forEach((child) => {
        child.position.x += .5;
        if (child.position.x > 400) {
          child.position.x = -300;
        }
      });
    }
  }
  addRectLight() {
    const width = 10;
    const height = 10;
    const intensity = 100;
    const rectLight = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
    rectLight.position.set( 5, 5, 10 );
    rectLight.lookAt( 0, 0, 0 );
    this.scene.add( rectLight );


    const rectLightHelper = new THREE.RectAreaLightHelper( rectLight );
    rectLight.add( rectLightHelper );
  }
  addSomeStuff() {
    let debug = false;

    // create cube
    const geometry = new THREE.BoxGeometry(7, 7, 7);
    // materials/color/texture

    // box and square together
    const boxAndSquare = new THREE.Group();

    const faceMaterials = [
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('assets/face.png'),
        side: THREE.DoubleSide
      }),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('assets/face.png'),
        side: THREE.DoubleSide
      }),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('assets/face.png'),
        side: THREE.DoubleSide
      }),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('assets/face.png'),
        side: THREE.DoubleSide
      }),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('assets/face.png'),
        side: THREE.DoubleSide
      }),
      new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('assets/face.png'),
        side: THREE.DoubleSide
      }),

    ];
    // var material = new THREE.MeshBasicMaterial(faceMaterials)
    const cube = new THREE.Mesh(geometry, faceMaterials);

    // scene.add(cube);

    const lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    const lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(new THREE.Vector3( -10, 0, 0) );
    lineGeometry.vertices.push(new THREE.Vector3( 0, 10, 0) );
    lineGeometry.vertices.push(new THREE.Vector3( 10, 0, 0) );
    lineGeometry.vertices.push(new THREE.Vector3( 0, -10, 0) );
    lineGeometry.vertices.push(new THREE.Vector3( -10, 0, 0) );
    const line = new THREE.Line( lineGeometry, lineMaterial );
    // scene.add( line );

    this.group.add(cube);
    this.group.add(line);
    this.scene.add(this.group);

    const lineGeometry2 = new THREE.Geometry();
    lineGeometry2.vertices.push(new THREE.Vector3( -10, 0, 0) );
    lineGeometry2.vertices.push(new THREE.Vector3( 0, 0, 10) );
    lineGeometry2.vertices.push(new THREE.Vector3( 10, 0, 0) );
    lineGeometry2.vertices.push(new THREE.Vector3( 0, 0, -10) );
    lineGeometry2.vertices.push(new THREE.Vector3( -10, 0, 0) );
    const line2 = new THREE.Line(lineGeometry2, new THREE.LineBasicMaterial({ color: 0x00ff00 }));
    this.group.add(line2);


    const lineGeometry3 = new THREE.Geometry();
    lineGeometry3.vertices.push(new THREE.Vector3( 0, 10, 0) );
    lineGeometry3.vertices.push(new THREE.Vector3( 0, 0, -10) );
    lineGeometry3.vertices.push(new THREE.Vector3( 0, -10, 0) );
    lineGeometry3.vertices.push(new THREE.Vector3( 0, 0, 10) );
    lineGeometry3.vertices.push(new THREE.Vector3( 0, 10, 0) );
    const line3 = new THREE.Line(lineGeometry3, new THREE.LineBasicMaterial({ color: 0xff0000 }));
    this.group.add(line3);


    const PlaneGeometry = new THREE.PlaneGeometry( 90, 70 );
    const planeMaterial = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('assets/kiss.jpeg'), side: THREE.DoubleSide} );
    const plane = new THREE.Mesh( PlaneGeometry, planeMaterial );
    plane.position.z -= 40;
    this.scene.add( plane );

    if (debug) {
        const axesHelper = new THREE.AxesHelper( 5 );
        this.scene.add( axesHelper );
    }
  }


  // game logic
  updateDigits = function() {
    this.digits.forEach((digit) => {
      if (this.numberService.getRandomInt(1000) < 1) {
        const newDigit = this.numberService.getRandomInt(10);
        digit.userData.digit = newDigit;
        digit.children.forEach((child, digitChildIndex) => {
          if (child.type === 'Mesh') {
            if (this.digitLookup[newDigit][digitChildIndex]) {
              child.visible = true;
            } else {
              child.visible = false;
            }
          }
        });
        this.generateLilNumber(digit);
      }
    });
    // this.flickerDigits();
  };

  generateLilNumber(targetDigitGroup) {
    const existingLN = targetDigitGroup.getObjectByName('lilNumber');
    const loader = new THREE.FontLoader();
    const localScene = this.scene;
    const materialOn = new THREE.MeshBasicMaterial({color: 0xffffff});
    loader.load( '/assets/droid_sans_mono_regular.typeface.json', ( font ) => {
      const textGeometry =  new THREE.TextGeometry( '0' + String(targetDigitGroup.userData.digit), {
        font,
        size: 5,
        height: 0.1,
        bevelEnabled: false,
      } );
      textGeometry.rotateZ(1.5708);
      textGeometry.translate(58, 67, 0);
      let lilNumberGroup = new THREE.Group();
      if (existingLN) {
        lilNumberGroup = existingLN;
      }
      if (existingLN) {
        existingLN.remove(existingLN.children[0]);
      }
      lilNumberGroup.add(new THREE.Mesh(textGeometry, materialOn));
      lilNumberGroup.name = 'lilNumber';
      if (!existingLN) {
        targetDigitGroup.add(lilNumberGroup);
      }
      // localScene.add(numberMesh);
    });
  }
  flickerDigits = function() {
    // flicker stuff
    if (this.numberService.getRandomInt(100) < 3) {
      const digit = this.digits[this.numberService.getRandomInt(this.digits.length)];
      const flickerCell = digit.children[this.numberService.getRandomInt(11)];
      this.flickerCells.push(flickerCell);
    }
    if (this.frame % 10 === 0) {
      this.flickerCells.forEach((flickerCell) => {
        flickerCell.material = flickerCell.material.name === 'OFF' ? this.numberService.materialON : this.numberService.materialOFF;
      });
    }
    if (this.numberService.getRandomInt(100) < 5 && this.flickerCells.length) {
      this.flickerCells.shift();
    }
  };

  updateTimeShaders() {
    this.timeShaders.forEach((timeShader) => {
      timeShader.uniforms.time.value = this.frame;
    });
  }

  update = () => {
    this.updateDigits();
    this.updateLoadingBar();
    this.updateTimeShaders();
    this.frame += 1;
  }

  animate = () => {
    requestAnimationFrame( this.animate );
    this.controls.update();
    this.update();

    this.composer.render();
  }
  generateSkullWidget(coords: Vec2) {
    
    const skullShape = new THREE.Shape([
      new THREE.Vector2(2,0),
      new THREE.Vector2(4,0),
      new THREE.Vector2(4,1),
      new THREE.Vector2(5,1),
      new THREE.Vector2(5,2),
      new THREE.Vector2(5,0),
      new THREE.Vector2(6,0),
      new THREE.Vector2(6,1),
      new THREE.Vector2(7,1),
      new THREE.Vector2(7,2),
      new THREE.Vector2(8,2),
      new THREE.Vector2(8,3),
      new THREE.Vector2(8,6),
      new THREE.Vector2(7,6),
      new THREE.Vector2(7,7),
      new THREE.Vector2(1,7),
      new THREE.Vector2(1,6),
      new THREE.Vector2(0,6),
      new THREE.Vector2(0,2),
      new THREE.Vector2(1,2),
      new THREE.Vector2(1,1),
      new THREE.Vector2(2,1)
    ]);
    const leftEye = new THREE.Shape([
      new THREE.Vector2(1,3),
      new THREE.Vector2(3,3),
      new THREE.Vector2(3,5),
      new THREE.Vector2(1,5),
    ]);
    const rightEye = new THREE.Shape([
      new THREE.Vector2(5,3),
      new THREE.Vector2(7,3),
      new THREE.Vector2(7,5),
      new THREE.Vector2(5,5),
    ]);
    skullShape.holes.push(leftEye)
    skullShape.holes.push(rightEye)
    console.log(skullShape);
    const skullGeometry = new THREE.ShapeGeometry(skullShape);
    skullGeometry.scale(2,2,0);
    skullGeometry.translate(coords.x, coords.y, 5);
    const skullMesh = new THREE.Mesh(skullGeometry, new THREE.MeshBasicMaterial({ color: 0xff4444, transparent: true, opacity: 0.5 }));
    skullMesh.translateY(-30);
    this.scene.add(skullMesh);
  }

  addPasses = () => {
    const renderPass = new RenderPass( this.scene, this.camera );
    this.composer.addPass( renderPass );

    // const additivePass = new ShaderPass(AdditiveShader);
    // this.composer.addPass(additivePass);
    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    bloomPass.strength = .3;
    bloomPass.threshold = .4;
    this.composer.addPass(bloomPass);

    if (this.glitchPassEnabled) {
      const glitchPass = new GlitchPass();
      this.composer.addPass(glitchPass);
    }
    if (this.rgbShiftPassEnabled) {
      RGBShiftShader.uniforms.amount.value = 0.0015;
      const rgbshiftPass = new ShaderPass( RGBShiftShader );
      this.composer.addPass( rgbshiftPass );
    }

    if (this.scanlinePassEnabled) {
      ScanlinesShader.uniforms.height.value = 50;
      ScanlinesShader.uniforms.count.value = 400;
      const scanlinePass = new ShaderPass( ScanlinesShader );
      this.composer.addPass( scanlinePass );
      this.timeShaders.push(scanlinePass);
    }
  }







}
