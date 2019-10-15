import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { generate } from 'rxjs';
import { Geometry, Material, MeshBasicMaterial } from 'three';

@Injectable({
  providedIn: 'root'
})
export class NumbersService {

  constructor() { }
  materialON: MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, name: "ON" });
  materialOFF: MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0x222222, side: THREE.DoubleSide, name: "OFF"  });
  digitLookup = [
    //0
    {
        0: true,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
        7: true,
        8: true,
        9: true,
        10: true,
    },
    //1
    {
        0: true,
        1: true,
        2: true,
        3: true,
        4: true,
    },
    //2
    {
        0: true,
        1: true,
        2: true,
        4: true,
        5: true,
        6: true,
        9: true,
        10: true,
        11: true
    },
    //3
    {
        4: true,
        5: true,
        6: true,
        8: true,
        9: true,
        11: true
    },
    //4
    {
        3: true,
        4: true,
        6: true,
        7: true,
        8: true,
        9: true,
    },
    //5
    {
        3: true,
        4: true,
        5: true,
        7: true,
        8: true,
        9: true,
        10: true,
    },
    //6
    {
        0: true,
        1: true,
        2: true,
        3: true,
        4: true,
        6: true,
        7: true,
        8: true,
        9: true,
        10: true,
        11: true
    },
    //7
    {
        0: true,
        1: true,
        2: true,
        4: true,
        5: true,
        6: true,
        11: true
    },
    //8
    {
        0: true,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
        7: true,
        8: true,
        9: true,
        10: true,
        11: true
    },
    //9
    {
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
        7: true,
        8: true,
        9: true,
        11: true
    }
  ];

  getDigitLookup = function() {
    return this.digitLookup;
  }
  // materialON = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  // materialOFF = new THREE.MeshBasicMaterial({ color: 0x222222, side: THREE.DoubleSide });
  public generateDigit = function(inputDigit) {
    // lookup whatever
    const digitGroup = new THREE.Group();
    digitGroup.userData.digit = inputDigit;
    const offGroup = new THREE.Group();
    const longArm = 21.21320344;
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const lineGroup = new THREE.Group();
    const segments = [
        {
            vertices: new THREE.Shape([
                new THREE.Vector2(0, 0),

                // flair
                new THREE.Vector2(5, 0),
                new THREE.Vector2(5, 2),
                new THREE.Vector2(6, 2),
                new THREE.Vector2(6, 0),
                new THREE.Vector2(8, 0),
                new THREE.Vector2(8, 2),
                new THREE.Vector2(9, 2),
                new THREE.Vector2(9, 0),
                // end flair

                new THREE.Vector2(15, 0),
                new THREE.Vector2(15, 10),
                new THREE.Vector2(0, 10)
            ]),
            position: new THREE.Vector3(0, 0, 0)
        },
        {
            vertices: new THREE.Shape([
                new THREE.Vector2(15, 15),
                new THREE.Vector2(0, 0),
                new THREE.Vector2(15, 0),
            ]),
            position: new THREE.Vector3(0, 10, 0)
        },
        {
            vertices: new THREE.Shape([
                new THREE.Vector2(0, 15),
                new THREE.Vector2(0, 0),
                new THREE.Vector2(15, 15),
                new THREE.Vector2(15, 30),
            ]),
            position: new THREE.Vector3(0, 10, 0)
        },
        {
            vertices: new THREE.Shape([
                new THREE.Vector2(0, 0),
                new THREE.Vector2(10, 10),
                new THREE.Vector2(10, 10 + longArm),
                new THREE.Vector2(0, longArm),
            ]),
            position: new THREE.Vector3(5, 30, 0)
        },
        {
            vertices: new THREE.Shape([
                new THREE.Vector2(0, 0),
                new THREE.Vector2(10, 10),
                new THREE.Vector2(10, 25),
                new THREE.Vector2(0, 15),
            ]),
            position: new THREE.Vector3(5, 30 + longArm, 0)
        },
        {
            vertices: new THREE.Shape([
                new THREE.Vector2(0, 0),
                new THREE.Vector2(5, 5),
                new THREE.Vector2(5 + longArm, 5),
                new THREE.Vector2(15 + longArm, 15),
                new THREE.Vector2(0, 15),
            ]),
            position: new THREE.Vector3(15, 40 + longArm, 0)
        },
        {
            vertices: new THREE.Shape([
                new THREE.Vector2(0, 0),
                new THREE.Vector2(10, 10),
                new THREE.Vector2(10, 10 + longArm),
                new THREE.Vector2(0, longArm),
            ]),
            position: new THREE.Vector3(20 + longArm, 45, 0)
        },
        {
            vertices: new THREE.Shape([
                new THREE.Vector2(0, 0),
                new THREE.Vector2(10, 10),
                new THREE.Vector2(10, 50 - longArm),
                new THREE.Vector2(0, 40 - longArm),
            ]),
            position: new THREE.Vector3(20 + longArm, 5 + longArm, 0)
        },
        {
            vertices: new THREE.Shape([
                new THREE.Vector2(0, 0),
                new THREE.Vector2(15, 0),
                new THREE.Vector2(longArm + 5, longArm - 10),
                new THREE.Vector2(longArm + 5, longArm + 5)
            ]),
            position: new THREE.Vector3(25, 10, 0)
        },
        {
            vertices: new THREE.Shape([
                new THREE.Vector2(0, 0),
                new THREE.Vector2(15, 0),
                new THREE.Vector2(25, 10),
                new THREE.Vector2(0, 10)
            ]),
            position: new THREE.Vector3(15, 0, 0)
        },
        {
            vertices: new THREE.Shape([
                new THREE.Vector2(0, 0),
                new THREE.Vector2(10, 10),
                new THREE.Vector2(0, 10)
            ]),
            position: new THREE.Vector3(15, 0, 0)
        },
        {
            vertices: new THREE.Shape([
                new THREE.Vector2(0, 0),
                new THREE.Vector2(15, 15),
                new THREE.Vector2(longArm, 15),
                new THREE.Vector2(5 + longArm, 20),
                new THREE.Vector2(5 + longArm, 20 + longArm),
                new THREE.Vector2(0, 15)
            ]),
            position: new THREE.Vector3(15, 25, 0)
        }
    ];
    segments.forEach((segment, index) => {
        console.log(index);
        const geometry = new THREE.ShapeGeometry(segment.vertices);
        console.log(geometry);
        geometry.computeBoundingBox();

        geometry.scale(.95, .95, 1);
        // geometry.center();
        geometry.translate(segment.position.x, segment.position.y, segment.position.z);

        // const materialToUse = (this.digitLookup[inputDigit][index]) ? this.materialON : this.materialOFF;
        const segmentMesh = new THREE.Mesh(geometry, this.materialON);
        segmentMesh.visible = (this.digitLookup[inputDigit][index]) ? true : false;

        segmentMesh.material['opacity'] = 0.9;
        segmentMesh.material['transparent'] = true;
        digitGroup.add(segmentMesh);

        const offGeometry = geometry.clone();
        offGeometry.translate(-1, -1, -1);
        const offMesh = new THREE.Mesh(offGeometry, this.materialOFF);
        offGroup.add(offMesh);
        // draw lines around
        // var lineGeometry = new THREE.Geometry();
        // lineGeometry.vertices = [...segment.vertices, segment.vertices[0]];
        // lineGeometry.vertices = lineGeometry.vertices.map((vertex) => {
        //     return this.addVectors(vertex, segment.position);
        // });

        // lineGroup.add(new THREE.Line(lineGeometry, lineMaterial));
    });
    digitGroup.add(offGroup);
    digitGroup.add(lineGroup);
    // guide lines
    const guideLines = [
        {
            vertices: [
                new THREE.Vector3(15, 0, 0),
                new THREE.Vector3(115, 100, 0)
            ]
        },
        {
            vertices: [
                new THREE.Vector3(0, 10 , 0),
                new THREE.Vector3(100, 110, 0)
            ]
        },
        {
            vertices: [
                new THREE.Vector3(0, 25, 0),
                new THREE.Vector3(100, 125, 0)
            ]
        },
        {
            vertices: [
                new THREE.Vector3(0, 25, 0),
                new THREE.Vector3(100, 125, 0)
            ]
        },
    ];
    const drawGuidelines = false;
    if (drawGuidelines) {
        guideLines.forEach((guideLine) => {
            const guideLineGeometry = new THREE.Geometry();
            guideLineGeometry.vertices = [...guideLine.vertices];
            digitGroup.add(new THREE.Line(guideLineGeometry, new THREE.LineDashedMaterial({ color: 0xff0000 })));
        });
    }
    const lilNumberGroup = new THREE.Group();
    const lilNumberGeometry = this.generateLilNumber(7);
    console.log(lilNumberGeometry);
    lilNumberGroup.add(new THREE.Mesh(lilNumberGeometry, this.materialON));
    digitGroup.add(lilNumberGroup);
    return digitGroup;
  }

  addVectors = function(vector1, vector2) {
    return {
      x: vector1.x + vector2.x,
      y: vector1.y + vector2.y,
      z: vector1.z + vector2.z
    };
  }
  getRandomInt = function(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  generateLilNumber(digit) {
    var loader = new THREE.FontLoader();
    loader.load( '/assets/droid_sans_mono_regular.typeface.json', function ( font ) {
      var textGeometry =  new THREE.TextGeometry( '0' + String(digit), {
        font: font,
        size: 80,
        height: 5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5
      } );
      return textGeometry;
    });
  }
}
