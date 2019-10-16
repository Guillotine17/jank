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
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

import { NumbersService } from './numbers.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'threejsexperiments';
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  renderer = new THREE.WebGLRenderer({ });
  glowRenderer = new THREE.WebGLRenderer({ });
  composer = new EffectComposer( this.renderer );

  renderTargetParameters = { };
  renderTargetGlow = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, this.renderTargetParameters );
  glowComposer = new EffectComposer(this.glowRenderer, this.renderTargetGlow);

  group = new THREE.Group();
  digits = [];
  flickerCells = [];
  digitLookup = [];
  timeShaders = [];
  frame = 0;
  digitCount = 5;
  loadingBarGroup = null;
  rgbShiftpassEnabled = false;
  scanlinePassEnabled = false;

  constructor(private numberService: NumbersService) { }

  ngOnInit() {
    // this.camera.position.z = 25;
    RectAreaLightUniformsLib.init();
    this.camera.position.z = 150;
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.glowRenderer.setSize( window.innerWidth, window.innerHeight );
    this.composer.setSize( window.innerWidth, window.innerHeight );
    this.glowComposer.setSize( window.innerWidth, window.innerHeight );
    this.glowRenderer.setPixelRatio(window.devicePixelRatio);
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
    this.addPasses();
    this.backgroundShape();
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
    this.glowComposer.setSize( width, height );
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  addNumbers(digitWidth) {
    this.digits = [];
    for (let index = 0; index < this.digitCount; index++) {
      const digitMesh = this.numberService.generateDigit(this.numberService.getRandomInt(10));
      console.log(digitMesh);
      digitMesh.position.x += (index * digitWidth) - (.5 * digitWidth * this.digitCount);
      this.digits.push(digitMesh);
      console.log(digitMesh);
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
    const bevelSize = 10;
    const width = 400;
    const height = 150;
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
    console.log(rectLight);
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
      console.log(targetDigitGroup.position.x);
      textGeometry.rotateZ(1.5708);
      // textGeometry.translate(targetDigitGroup.position.x, targetDigitGroup.position.y, targetDigitGroup.position.z);
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

    // do stuff with numbers
    // this.group.rotation.x += 0.01;
      // this.group.rotation.y += 0.001;
  }

  animate = () => {
    requestAnimationFrame( this.animate );
    this.update();
    this.glowComposer.render();
    this.composer.render();
  }


  addPasses = () => {
    const renderPass = new RenderPass( this.scene, this.camera );
    const glowRenderPass = new RenderPass( this.scene, this.camera );
    this.composer.addPass( renderPass );
    this.glowComposer.addPass( glowRenderPass );

    const thresholdPass = new ShaderPass(thresholdShader);
    this.glowComposer.addPass(thresholdPass);
    const horizontalBlurPass = new ShaderPass(HorizontalBlurShader);
    this.glowComposer.addPass(horizontalBlurPass);
    const verticalBlurPass = new ShaderPass(VerticalBlurShader);
    this.glowComposer.addPass(verticalBlurPass);

    AdditiveShader.uniforms.tGlow.value = this.glowComposer.renderTarget1;
    const additivePass = new ShaderPass(AdditiveShader);
    this.composer.addPass(additivePass);

    if (this.rgbShiftpassEnabled) {
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


    // console.log(this.composer);
    // var glitchPass = new GlitchPass();
    // this.composer.addPass( glitchPass );
  }







}
