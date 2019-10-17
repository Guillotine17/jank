import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import * as THREE from 'three';
import { AlphaFormat } from 'three';
@Component({
  selector: 'app-textcanvas',
  templateUrl: './textcanvas.component.html',
  styleUrls: ['./textcanvas.component.less']
})

// TODO create canvas/determine size in the component
export class TextcanvasComponent implements AfterViewInit {
  @Input() scene: THREE.Scene;
  canvasId = 'canvasId';
  canvas = null;
  constructor() { }

  ngAfterViewInit() {
    this.canvasId = 'canvasId';
    this.canvas = document.getElementById(this.canvasId);
    console.log(this.canvas);
    this.populateCanvas();
  }
  populateCanvas() {
    const ctx = this.canvas.getContext('2d');
    // ctx.fillStyle("blue");
    console.log(ctx);
    ctx.clearRect(0, 0, 100, 100);
    ctx.font = '20px Georgia';
    ctx.fillStyle = "rgb(0,150,0)";
    ctx.fillText('Hoes Mad!', 12, 50);

    this.addCanvasPlane();
  }
  addCanvasPlane() {
    const planeGeometry = new THREE.PlaneGeometry( 100, 100);
    const canvasElement = document.getElementById('canvasId') as HTMLCanvasElement;
    const canvasTexture = new THREE.CanvasTexture(canvasElement);
    canvasTexture.minFilter = THREE.LinearFilter;
    canvasTexture.wrapS = THREE.ClampToEdgeWrapping;
    canvasTexture.wrapT = THREE.ClampToEdgeWrapping;

    canvasTexture.needsUpdate = true;
    const canvasMaterial = new THREE.MeshBasicMaterial({
      map: canvasTexture,
      side: THREE.FrontSide,
      blending: THREE.NormalBlending,
      transparent: true
    });
    const canvasMesh = new THREE.Mesh(planeGeometry, canvasMaterial);
    canvasMesh.translateZ(20);
    this.scene.add(canvasMesh);
  }
}
