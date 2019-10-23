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
import { NumbersService } from './services/numbers.service';
import { Vec2, ShapeGeometry, ExtrudeBufferGeometry, Line3 } from 'three';
import { WidgetService } from './services/widget.service.js';
import { ChunkytextService } from './services/chunkytext.service.js';

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
  digits: THREE.Group[] = [];
  skullies = [];
  flickerCells = [];
  digitLookup = [];
  timeShaders = [];
  frame = 0;
  digitCount = 9;
  loadingBarGroup = null;
  bloomPassEnabled = false;
  rgbShiftPassEnabled = true;
  scanlinePassEnabled = false;
  glitchPassEnabled = false;
  typerGroup: THREE.Group = null;

  constructor(private numberService: NumbersService,
              private chunkyText: ChunkytextService,
              private widgetService: WidgetService) { }

  ngOnInit() {
    // this.camera.position.z = 25;
    RectAreaLightUniformsLib.init();
    this.camera.position.z = 150;
    this.controls.update();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.composer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x7fffd4, 1);
    document.body.appendChild( this.renderer.domElement );
    // document.body.appendChild( this.glowRenderer.domElement );
    // handle resize window
    window.addEventListener('resize', () => {
      this.handleResize();
    });
    // this.addSomeStuff();
    // this.addNumbers(65);
    // this.digits.forEach((digit) => {
    //   this.generateLilNumber(digit);
    // });
    // this.loadingBarGroup = this.widgetService.loadingBar(this.scene);
    // this.generateSkullGrid();
    // this.scene.add(this.chunkyText.generateCharacter('a'));
    this.typerGroup = this.chunkyText.initTyper({message: '"here\'s and interesting quote about something cool"-quote sayer.'});
    this.scene.add(this.typerGroup);
    this.widgetService.backgroundShape(this.scene);
    // this.widgetService.drawGameboy(this.scene);

    // this.addCanvasPlane();

    this.addPasses();
    this.digitLookup = this.numberService.getDigitLookup();
    this.animate();
    this.addAmbientLight();
  }

  generateSkullGrid() {
    for (let xIndex = -200; xIndex < 200; xIndex += 30) {
      for (let yIndex = -200; yIndex < 200; yIndex += 30) {
        this.skullies.push(this.widgetService.generateSkullWidget({
          coords: new THREE.Vector2(xIndex, yIndex),
          scene: this.scene
        }));
      }
    }
  }
  addAmbientLight() {
    const ambient = new THREE.AmbientLight( 0xffffff, 1 );
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
    }
  }

  updateTimeShaders() {
    this.timeShaders.forEach((timeShader) => {
      timeShader.uniforms.time.value = this.frame;
    });
  }

  update = () => {
    // this.numberService.updateDigits(this.digits);
    // this.widgetService.updateLoadingBar(this.loadingBarGroup);
    this.updateTimeShaders();
    // this.widgetService.updateSkulls({ frame: this.frame, skullies: this.skullies });
    this.chunkyText.updateTyper(this.typerGroup, this.frame);

    this.frame += 1;
  }

  animate = () => {
    requestAnimationFrame( this.animate );
    this.controls.update();
    this.update();

    this.composer.render();
  }


  addPasses = () => {
    const renderPass = new RenderPass( this.scene, this.camera );
    this.composer.addPass( renderPass );

    // const additivePass = new ShaderPass(AdditiveShader);
    // this.composer.addPass(additivePass);
    if (this.bloomPassEnabled) {
      const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
      bloomPass.strength = .3;
      bloomPass.threshold = .2;
      this.composer.addPass(bloomPass);
    }

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
