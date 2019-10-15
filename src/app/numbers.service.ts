import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { generate } from 'rxjs';
import { Geometry } from 'three';

@Injectable({
  providedIn: 'root'
})
export class NumbersService {

  constructor() { }
  materialON = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, name: "ON" });
  materialOFF = new THREE.MeshBasicMaterial({ color: 0x222222, side: THREE.DoubleSide, name: "OFF"  });
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
    var digitGroup = new THREE.Group();
    var longArm = 21.21320344;
    var lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    var lineGroup = new THREE.Group(); 
    var segments = [
        {
            vertices: [
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(15, 0, 0),
                new THREE.Vector3(15, 10, 0),
                new THREE.Vector3(0, 10, 0)
            ],
            position: new THREE.Vector3(0, 0, 0)
        },
        {
            vertices: [
                new THREE.Vector3(15, 15, 0),
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(15, 0, 0),
            ],
            position: new THREE.Vector3(0, 10, 0)
        },
        {
            vertices: [
                new THREE.Vector3(0, 15, 0),
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(15, 15, 0),
                new THREE.Vector3(15, 30, 0),
            ],
            position: new THREE.Vector3(0, 10, 0)
        },
        {
            vertices: [
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(10, 10, 0),
                new THREE.Vector3(10, 10 + longArm, 0),
                new THREE.Vector3(0, longArm, 0),
            ],
            position: new THREE.Vector3(5, 30, 0)
        },
        {
            vertices: [
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(10, 10, 0),
                new THREE.Vector3(10, 25, 0),
                new THREE.Vector3(0, 15, 0),
            ],
            position: new THREE.Vector3(5, 30 + longArm, 0)
        },
        {
            vertices: [
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(5, 5, 0),
                new THREE.Vector3(5 + longArm, 5, 0),
                new THREE.Vector3(15 + longArm, 15, 0),
                new THREE.Vector3(0, 15, 0),
            ],
            faces: [
                new THREE.Face3(0,1,4),
                new THREE.Face3(1,3,4),
                new THREE.Face3(1,2,3),
            ],
            position: new THREE.Vector3(15, 40 + longArm, 0)
        },
        {
            vertices: [
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(10, 10, 0),
                new THREE.Vector3(10, 10 + longArm, 0),
                new THREE.Vector3(0, longArm, 0),
            ],
            position: new THREE.Vector3(20 + longArm, 45, 0)
        },
        {
            vertices: [
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(10, 10, 0),
                new THREE.Vector3(10, 50 - longArm, 0),
                new THREE.Vector3(0, 40 - longArm, 0),
            ],
            position: new THREE.Vector3(20 + longArm, 5+longArm, 0)
        },
        {
            vertices: [
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(15, 0, 0),
                new THREE.Vector3(longArm + 5, longArm -10, 0),
                new THREE.Vector3(longArm + 5, longArm + 5, 0)
            ],
            position: new THREE.Vector3(25, 10, 0)
        },
        {
            vertices: [
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(15, 0, 0),
                new THREE.Vector3(25, 10, 0),
                new THREE.Vector3(0, 10, 0)
            ],
            position: new THREE.Vector3(15, 0, 0)
        },
        {
            vertices: [
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(10, 10, 0),
                new THREE.Vector3(0, 10, 0)
            ],
            position: new THREE.Vector3(15, 0, 0)
        },
        {
            vertices: [
                new THREE.Vector3(0,0,0),
                new THREE.Vector3(15,15,0),
                new THREE.Vector3(longArm,15,0),
                new THREE.Vector3(5 + longArm, 20, 0),
                new THREE.Vector3(5 + longArm, 20 + longArm, 0),
                new THREE.Vector3(0, 15, 0)
            ],
            faces: [
                new THREE.Face3(0,1,5),
                new THREE.Face3(2,4,5),
                new THREE.Face3(2,3,4),

            ],
            position: new THREE.Vector3(15, 25, 0)
        }


    ];
    segments.forEach((segment, index) => {
        console.log(index);
        var geometry = new THREE.Geometry();
        segment.vertices.forEach((segmentVertex) => {
            console.log(segmentVertex);
            geometry.vertices.push(this.addVectors(segmentVertex, segment.position));
        });
        if (segment.faces) {
            geometry.faces = [...segment.faces];
        } else {
            geometry.faces.push(new THREE.Face3(0, 1, 2));
            if (geometry.vertices[3]) {
                geometry.faces.push(new THREE.Face3(2, 3, 0));
            }
        }
        console.log(geometry);
        var materialToUse = (this.digitLookup[inputDigit][index]) ? this.materialON: this.materialOFF;
        digitGroup.add(new THREE.Mesh(geometry, materialToUse));
        // draw lines around
        var lineGeometry = new THREE.Geometry();
        lineGeometry.vertices = [...segment.vertices, segment.vertices[0]];
        lineGeometry.vertices = lineGeometry.vertices.map((vertex) => {
            return this.addVectors(vertex, segment.position);
        });
        
        lineGroup.add(new THREE.Line(lineGeometry, lineMaterial));
    });
    digitGroup.add(lineGroup);
    // guide lines
    var guideLines = [
        {
            vertices: [
                new THREE.Vector3(15,0,0),
                new THREE.Vector3(115, 100, 0)
            ]
        },
        {
            vertices: [
                new THREE.Vector3(0, 10 ,0),
                new THREE.Vector3(100, 110, 0)
            ]
        },
        {
            vertices: [
                new THREE.Vector3(0, 25 ,0),
                new THREE.Vector3(100, 125, 0)
            ]
        },
        {
            vertices: [
                new THREE.Vector3(0, 25 ,0),
                new THREE.Vector3(100, 125, 0)
            ]
        },
    ];
    var drawGuidelines = false;
    if (drawGuidelines) {
        guideLines.forEach((guideLine) => {
            var guideLineGeometry = new THREE.Geometry();
            guideLineGeometry.vertices = [...guideLine.vertices];
            digitGroup.add(new THREE.Line(guideLineGeometry, new THREE.LineDashedMaterial({ color: 0xff0000 })));
        });
    }
    var lilNumberGroup = new THREE.Group();
    var lilNumberGeometry = this.generateLilNumber(7);
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
    '0' + String(digit)
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
