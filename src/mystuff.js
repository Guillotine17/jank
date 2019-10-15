var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// var geometry = new THREE.BoxGeometry(1, 1, 1);
// var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// var cube = new THREE.Mesh(geometry, material);
// scene.add(cube);




camera.position.z = 100;
camera.position.x = 25;
camera.position.y = 25;

const digitLookup = [
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

]

function generateDigit(inputDigit) {
    // lookup whatever
    var digitGroup = new THREE.Group();
    var materialON = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.Doubleside });
    var materialOFF = new THREE.MeshBasicMaterial({ color: 0x222222, side: THREE.Doubleside });
    var longArm = 21.21320344;
    var lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
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
        // console.log(index);
        var geometry = new THREE.Geometry();
        segment.vertices.forEach((segmentVertex) => {
            // console.log(segmentVertex);
            geometry.vertices.push(addVectors(segmentVertex, segment.position));
        });
        if (segment.faces) {
            geometry.faces = [...segment.faces];
        } else {
            geometry.faces.push(new THREE.Face3(0, 1, 2));
            if (geometry.vertices[3]) {
                geometry.faces.push(new THREE.Face3(2, 3, 0));
            }
        }
        // console.log(geometry);
        var materialToUse = (digitLookup[inputDigit][index]) ? materialON: materialOFF;
        digitGroup.add(new THREE.Mesh(geometry, materialToUse));
        // draw lines around
        var lineGeometry = new THREE.Geometry();
        lineGeometry.vertices = [...segment.vertices, segment.vertices[0]];
        lineGeometry.vertices = lineGeometry.vertices.map((vertex) => {
            return addVectors(vertex, segment.position);
        });
        
        digitGroup.add(new THREE.Line(lineGeometry, lineMaterial));
    });
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
    return digitGroup;
}
function addVectors(vector1, vector2) {
    return {
        x: vector1.x + vector2.x,
        y: vector1.y + vector2.y,
        z: vector1.z + vector2.z
    };
}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}


 

function animate() {

    if (getRandomInt(100) < 5) {

        var digitMesh = generateDigit(getRandomInt(10));
        scene.add(digitMesh);
    }
    if (getRandomInt(100) < 5) {

        var digitMesh2 = generateDigit(getRandomInt(10));
        digitMesh2.position.x = 65;
        scene.add(digitMesh2);
    }
    // scene.add(generateDigit(getRandomInt(10)));
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    // digitMesh.children.forEach((child) => {
    //     child.dispose();
    // });
}
animate();
