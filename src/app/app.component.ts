import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
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
  renderer = new THREE.WebGLRenderer();
  group = new THREE.Group();
  composer = new EffectComposer( this.renderer );
  digits = [];
  flickerCells = [];
  digitLookup = [];
  frame = 0;
  loadingBarGroup = null;
  constructor(private numberService: NumbersService) { }

  ngOnInit() {
    // this.camera.position.z = 25;
    this.camera.position.z = 150;
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.setClearColor(0x111111, 1);
    document.body.appendChild( this.renderer.domElement );
    // handle resize window
    window.addEventListener('resize', () => {
      this.handleResize();
    });
    // this.addSomeStuff();
    this.addNumbers();
    this.loadingBar();
    this.addPasses();
    this.generateLilNumber(0);
    this.animate();
    // this.GameLoop();
    this.digitLookup = this.numberService.getDigitLookup();
  }

  handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.setSize(width,height);
    this.camera.aspect = width/height;
    this.camera.updateProjectionMatrix();
  }

  addNumbers() {
    this.digits = [];
    const digitCount = 5;
    const digitWidth = 65;
    for (let index = 0; index < digitCount; index++) {
      var digitMesh = this.numberService.generateDigit(this.numberService.getRandomInt(10));
      digitMesh.position.x += (index * digitWidth) - (.5*digitWidth*digitCount);
      this.digits.push(digitMesh);
      console.log(digitMesh);
      this.scene.add(digitMesh);
    }
  }
  loadingBar() {
    var loadingBarGroup = new THREE.Group();
    var segmentCount = 50;
    for (let index = 0; index < segmentCount; index++) {
      var loadingThing = new THREE.Shape([
        new THREE.Vector2(0,0),
        new THREE.Vector2(10, 0),
        new THREE.Vector2(15, 10),
        new THREE.Vector2(5, 10),
      ]);
      var loadingThingGeometry = new THREE.ShapeGeometry(loadingThing);
      var loadingThingMesh = new THREE.Mesh(loadingThingGeometry, this.numberService.materialON);
      loadingThingMesh.position.x += (index * 12) - 6* segmentCount;
      loadingBarGroup.add(loadingThingMesh);
    }

    loadingBarGroup.position.y -= 20;
    this.loadingBarGroup = loadingBarGroup;
    this.scene.add(loadingBarGroup);
  } 
  updateLoadingBar() {
    this.loadingBarGroup.children.forEach((child) => {
      child.position.x += .5;
      if (child.position.x > 400) {
        child.position.x = -200;
      }
    })
  }
  addSomeStuff() {
    var debug = false;

    // create cube
    var geometry = new THREE.BoxGeometry(7,7,7);
    // materials/color/texture
    
    // box and square together
    var boxAndSquare = new THREE.Group();
    
    var faceMaterials = [
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
    var cube = new THREE.Mesh(geometry, faceMaterials);
    
    // scene.add(cube);
    
    var lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    var lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(new THREE.Vector3( -10, 0, 0) );
    lineGeometry.vertices.push(new THREE.Vector3( 0, 10, 0) );
    lineGeometry.vertices.push(new THREE.Vector3( 10, 0, 0) );
    lineGeometry.vertices.push(new THREE.Vector3( 0, -10, 0) );
    lineGeometry.vertices.push(new THREE.Vector3( -10, 0, 0) );
    var line = new THREE.Line( lineGeometry, lineMaterial );
    // scene.add( line );
    
    this.group.add(cube);
    this.group.add(line);
    this.scene.add(this.group);

    var lineGeometry2 = new THREE.Geometry();
    lineGeometry2.vertices.push(new THREE.Vector3( -10, 0, 0) );
    lineGeometry2.vertices.push(new THREE.Vector3( 0, 0, 10) );
    lineGeometry2.vertices.push(new THREE.Vector3( 10, 0, 0) );
    lineGeometry2.vertices.push(new THREE.Vector3( 0, 0, -10) );
    lineGeometry2.vertices.push(new THREE.Vector3( -10, 0, 0) );
    var line2 = new THREE.Line(lineGeometry2, new THREE.LineBasicMaterial({ color: 0x00ff00 }));
    this.group.add(line2);


    var lineGeometry3 = new THREE.Geometry();
    lineGeometry3.vertices.push(new THREE.Vector3( 0, 10, 0) );
    lineGeometry3.vertices.push(new THREE.Vector3( 0, 0, -10) );
    lineGeometry3.vertices.push(new THREE.Vector3( 0, -10, 0) );
    lineGeometry3.vertices.push(new THREE.Vector3( 0, 0, 10) );
    lineGeometry3.vertices.push(new THREE.Vector3( 0, 10, 0) );
    var line3 = new THREE.Line(lineGeometry3, new THREE.LineBasicMaterial({ color: 0xff0000 }));
    this.group.add(line3);


    var PlaneGeometry = new THREE.PlaneGeometry( 90, 70 );
    var planeMaterial = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load('assets/kiss.jpeg'), side: THREE.DoubleSide} );
    var plane = new THREE.Mesh( PlaneGeometry, planeMaterial );
    plane.position.z -= 40;
    this.scene.add( plane );
    
    if (debug) {
        var axesHelper = new THREE.AxesHelper( 5 );
        this.scene.add( axesHelper );
    }
  }


  // game logic
  updateDigits = function() {
    this.digits.forEach((digit, index) => {

      if (this.numberService.getRandomInt(100) < 1) {
        var newDigit = this.numberService.getRandomInt(10);
        digit.children.forEach((child, index) => {
          if (child.type === "Mesh") {
            if (this.digitLookup[newDigit][index]) {
              child.material = this.numberService.materialON;
            } else {
              child.material = this.numberService.materialOFF;
            }
          }
        })
      }
      
      // digit.position.z += (this.numberService.getRandomInt(50) -25) /100; 
      // digit.position.y += (this.numberService.getRandomInt(50) -25) /100; 
      // digit.position.x += (this.numberService.getRandomInt(50) -25) /100; 
    });
    this.flickerDigits();
  }
  generateLilNumber(this, digit) {
    '0' + String(digit)
    var loader = new THREE.FontLoader();
    var localScene = this.scene;
    var materialOn = new THREE.MeshBasicMaterial({color: 0xffffff});
    loader.load( '/assets/droid_sans_mono_regular.typeface.json', function ( font ) {
      var textGeometry =  new THREE.TextGeometry( '0' + String(digit), {
        font: font,
        size: 5,
        height: 0.1,
        bevelEnabled: false,
      } );
      var numberMesh = new THREE.Mesh(textGeometry, materialOn);
      numberMesh.position.x += 155;
      numberMesh.position.y += 65;
      numberMesh.rotateZ(1.5708);
      localScene.add(numberMesh);
    });
  }
  flickerDigits = function() {
    // flicker stuff
    if (this.numberService.getRandomInt(100) < 3) {
      var digit = this.digits[this.numberService.getRandomInt(this.digits.length)];
      var flickerCell = digit.children[this.numberService.getRandomInt(11)];
      this.flickerCells.push(flickerCell);
    }
    if (this.frame % 10 === 0) {
      this.flickerCells.forEach((flickerCell) => {
        flickerCell.material = flickerCell.material.name === "OFF" ? this.numberService.materialON : this.numberService.materialOFF; 
      })
    }
    if (this.numberService.getRandomInt(100) < 5 && this.flickerCells.length) {
      this.flickerCells.shift();
    }
  }
  update = () => {
    this.updateDigits();
    this.updateLoadingBar()
    this.frame += 1;

    // do stuff with numbers
    // this.group.rotation.x += 0.01;
      // this.group.rotation.y += 0.001; 
  };
  
  animate = () => {

    requestAnimationFrame( this.animate );
    this.update();
    this.composer.render();
  
  }

  // draw scene
  render = () => {
      this.renderer.render(this.scene, this.camera);
  };
  
  // run game loop
  GameLoop = () => {
      requestAnimationFrame(this.GameLoop);
      this.update();
      this.render();
  }
  addPasses = () => {
    var renderPass = new RenderPass( this.scene, this.camera );
    this.composer.addPass( renderPass );

    // var glitchPass = new GlitchPass(1080);
    // this.composer.addPass( glitchPass );
  }







}
