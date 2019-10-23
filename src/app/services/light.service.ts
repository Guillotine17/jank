import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class LightService {

  constructor() { }
  addRectLight(scene) {
    const width = 10;
    const height = 10;
    const intensity = 100;
    const rectLight = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
    rectLight.position.set( 5, 5, 10 );
    rectLight.lookAt( 0, 0, 0 );
    scene.add( rectLight );


    const rectLightHelper = new THREE.RectAreaLightHelper( rectLight );
    rectLight.add( rectLightHelper );
  }
}
