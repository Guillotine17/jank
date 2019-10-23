import { Injectable } from '@angular/core';
import { NumbersService } from './numbers.service';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {
  constructor(private numberService: NumbersService) { }
  generateSkullWidget({
    coords,
    scene,
  }) {
    const skullShape = new THREE.Shape([
      new THREE.Vector2(2, 0),
      new THREE.Vector2(4, 0),
      new THREE.Vector2(4, 1),
      new THREE.Vector2(5, 1),
      new THREE.Vector2(5, 2),
      new THREE.Vector2(5, 0),
      new THREE.Vector2(6, 0),
      new THREE.Vector2(6, 1),
      new THREE.Vector2(7, 1),
      new THREE.Vector2(7, 2),
      new THREE.Vector2(8, 2),
      new THREE.Vector2(8, 3),
      new THREE.Vector2(8, 6),
      new THREE.Vector2(7, 6),
      new THREE.Vector2(7, 7),
      new THREE.Vector2(1, 7),
      new THREE.Vector2(1, 6),
      new THREE.Vector2(0, 6),
      new THREE.Vector2(0, 2),
      new THREE.Vector2(1, 2),
      new THREE.Vector2(1, 1),
      new THREE.Vector2(2, 1)
    ]);
    const leftEye = new THREE.Shape([
      new THREE.Vector2(1, 3),
      new THREE.Vector2(3, 3),
      new THREE.Vector2(3, 5),
      new THREE.Vector2(1, 5),
    ]);
    const rightEye = new THREE.Shape([
      new THREE.Vector2(5, 3),
      new THREE.Vector2(7, 3),
      new THREE.Vector2(7, 5),
      new THREE.Vector2(5, 5),
    ]);
    skullShape.holes.push(leftEye);
    skullShape.holes.push(rightEye);
    console.log(skullShape);
    const skullGeometry = new THREE.ShapeGeometry(skullShape);
    skullGeometry.scale(2, 2, 0);
    skullGeometry.translate(coords.x, coords.y, 5);
    const skullMesh = new THREE.Mesh(skullGeometry, new THREE.MeshBasicMaterial({ color: 0xff0012, transparent: true, opacity: 0.8 }));
    skullMesh.translateY(-30);
    skullMesh.visible = false;
    skullMesh.name = 'skull';
    scene.add(skullMesh);
    return skullMesh;
  }
  updateSkulls({
    skullies,
    frame
  }) {
    const skullBlinkFrequency = 30;
    const addSkullFrequency = 50;
    if (frame % addSkullFrequency === 0) {
      const randomSkull = skullies[this.numberService.getRandomInt(skullies.length)];
      if (!randomSkull.userData.blinking) {
        randomSkull.userData.blinking = true;
      }
    }
    if (frame % skullBlinkFrequency === 0) {
      skullies.filter((skull) => {
        return skull.userData.blinking;
      }).forEach((skull) => {
        skull.visible = !skull.visible;
      });
    }
  }
  backgroundShape(scene: THREE.Scene) {
    const bevelSize = 30;
    const width = 360;
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
    backdropGeometry.translate((-.5 * width), (-.5 * height), -10);
    const backdropMesh = new THREE.Mesh(backdropGeometry, new THREE.MeshBasicMaterial({ color: 0x555555 }));
    scene.add(backdropMesh);
  }
  drawGameboy(scene: THREE.Scene) {
    const bevel = 30;
    const frameShape = new THREE.Shape([
      new THREE.Vector2(-220 + bevel, -400),
      new THREE.Vector2(220 - bevel, -400),
      new THREE.Vector2(220, -400 + bevel),
      new THREE.Vector2(220, 200 - bevel),
      new THREE.Vector2(220 - bevel, 200),
      new THREE.Vector2(-220 + bevel, 200),
      new THREE.Vector2(-220, 200 - bevel),
      new THREE.Vector2(-220, -400 + bevel),
    ]);
    const windowShape = new THREE.Shape([
      new THREE.Vector2(-200, -120),
      new THREE.Vector2(200, -120),
      new THREE.Vector2(200, 120),
      new THREE.Vector2(-200, 120),
    ]);
    frameShape.holes.push(windowShape);
    const extrudesettings = {
      steps: 1,
      depth: 100,
      bevelEnabled: false
    };
    const backGeometry = new THREE.ShapeGeometry(windowShape);
    backGeometry.translate(0, 0, -40);
    scene.add(
      new THREE.Mesh(backGeometry, new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.DoubleSide}))
    );
    const frameGeometry = new THREE.ExtrudeBufferGeometry(frameShape, extrudesettings);
    frameGeometry.translate(0, 0, -40);
    // const wireframeGeo = new WireframeGeometry2( frameGeometry );

    // const wireframe = new Wireframe(wireframeGeo, new LineMaterial( {
    //   color: 0x222222,
    //   linewidth: 1,
    //   dashed: false
    // }));
    // wireframe.computeLineDistances();
    // wireframe.scale.set(1, 1, 1);
    // this.scene.add(wireframe);
    const frameMesh = new THREE.Mesh(frameGeometry, new THREE.MeshStandardMaterial({
      color: 0xD2B48C,
      roughness: 1,
      // metalness: 1,
      // flatShading: true,
    }));
    scene.add(frameMesh);
    console.log(frameMesh);
  }
  loadingBar(scene: THREE.Scene) {
    const loadingBarGroup = new THREE.Group();
    const segmentCount = 17;
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
    scene.add(loadingBarGroup);
    return loadingBarGroup;
  }
  updateLoadingBar(loadingBarGroup: THREE.Group) {
    if (loadingBarGroup) {
      loadingBarGroup.children.forEach((child) => {
        child.position.x += .5;
        if (child.position.x > 380) {
          child.position.x = -300;
        }
      });
    }
  }
}
