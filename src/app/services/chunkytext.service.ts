import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Vector2, Geometry } from 'three';
import { not } from '@angular/compiler/src/output/output_ast';
// import { moveCursor } from 'readline';

@Injectable({
  providedIn: 'root'
})
export class ChunkytextService {
  constructor() { }
  ninetyDeg = 1.5708;
  initTyper({message}) {
      const typerGroup = new THREE.Group();
      typerGroup.userData.name = 'typerGroup';
      typerGroup.userData.charstring = message.toLocaleLowerCase();
      typerGroup.userData.lineLength = 10;
      typerGroup.userData.charWidth = 27;
      typerGroup.userData.spacing = 1;
      typerGroup.userData.xpos = 0;
      typerGroup.userData.ypos = 0;
      typerGroup.userData.index = 0;
      const cursor = this.generateCharacter('█');
      typerGroup.add(cursor);
      typerGroup.userData.cursor = cursor;
      return typerGroup;
  }
  addLetter(typerGroup) {
    const character = typerGroup.userData.charstring.substr(typerGroup.userData.index, 1);
    if (typerGroup.userData.xpos > typerGroup.userData.lineLength) {
      typerGroup.userData.xpos = 0;
      typerGroup.userData.ypos += 1;
    }
    if (character === '\n') {
      typerGroup.userData.xpos = 0;
      typerGroup.userData.ypos += 1;
    }

    const charMesh = this.generateCharacter(character);
    if (charMesh) {
      const lineOffset = -typerGroup.userData.ypos * 28;
      charMesh.translateY(lineOffset + 50);
      charMesh.translateX((typerGroup.userData.charWidth + typerGroup.userData.spacing) * typerGroup.userData.xpos - 150);
      typerGroup.add(charMesh);
    }
    typerGroup.userData.xpos += 1;
    typerGroup.userData.index += 1;
    if (typerGroup.userData.index > typerGroup.userData.charstring.length) {
      typerGroup.userData.done = true;
    }
    this.moveCursor(typerGroup);
  }
  moveCursor(typerGroup: THREE.Group) {
    let xpos = typerGroup.userData.xpos;
    let ypos = typerGroup.userData.ypos; 
    let xypos = {x: null, y: null};
    if (typerGroup.userData.xpos > typerGroup.userData.lineLength) {
      typerGroup.userData.xpos = 0;
      typerGroup.userData.ypos += 1;
      xypos = this.getXYposition(typerGroup, 0, ypos + 1);
    } else {
      xypos = this.getXYposition(typerGroup, xpos, ypos);
    }
    const cursor = typerGroup.userData.cursor;
    console.log(cursor.position);
    // cursor.position.x = xypos.x;
    cursor.translateX(xypos.x - cursor.position.x)
    cursor.translateY(xypos.y - cursor.position.y)
    console.log(xypos.y - cursor.position.y);
    // cursor.position.y = xypos.y;

  }
  getXYposition(typerGroup, xpos, ypos) {
    
    const lineOffset = -ypos * 28;
    const outYpos = lineOffset + 50;
    const outXpos = (typerGroup.userData.charWidth + typerGroup.userData.spacing) * xpos - 150;
    console.log(outXpos, outYpos);
    return {x: outXpos, y: outYpos};
  }
  updateTyper(typerGroup: THREE.Group, frame) {
    const generateAllAtOnce = true;
    if (generateAllAtOnce) {
      while (!typerGroup.userData.done) {
        this.addLetter(typerGroup);
      }
    }
    if (frame % 30 === 0 && !typerGroup.userData.done) {
      this.addLetter(typerGroup);
    }
    const cursorBlinkRate = 15;
    if (frame % cursorBlinkRate === 0) {
      typerGroup.userData.cursor.visible = !typerGroup.userData.cursor.visible;
    }
  }
  generateCharacter(character) {
    const characterMap = this.getCharacterMap(character);
    if (!characterMap) { return null; }
    const finalGeometry = new THREE.Geometry();
    for (let yindex = 0; yindex < 3; yindex++) {
      for (let xindex = 0; xindex < 3; xindex++) {
        let charElement = characterMap[yindex][xindex];
        if (!charElement) {
          charElement = {
            fill: 'SOLID'
          };
        }
        if (charElement.fill !== 'BLANK') {
          const elementGeometry = this.generateCharacterElement(charElement);
          elementGeometry.translate(xindex * 9, (-yindex * 9) + 9, 0);
          finalGeometry.merge(elementGeometry);
        }
      }
    }
    return new THREE.Mesh(finalGeometry, new THREE.MeshBasicMaterial({ color: 0xffffff }));
  }
  generateCharacterElement({fill, rotation}) {
    let elementShape = null;
    const notchDepth = 3;
    const notchWidth = 1;
    const cornerSize = 4;

    if (fill === 'SOLID') {
      elementShape = new THREE.Shape([
        new Vector2(0, 0),
        new Vector2(9, 0),
        new Vector2(9, 9),
        new Vector2(0, 9),
      ]);
    } else if (fill === 'NOTCH') {
      const notchStart = (9 - notchWidth) / 2;
      elementShape = new THREE.Shape([
        new Vector2(0, 0),
        new Vector2(9, 0),
        new Vector2(9, 9),
        new Vector2(notchStart + notchWidth, 9),
        new Vector2(notchStart + notchWidth, 9 - notchDepth),
        new Vector2(notchStart, 9 - notchDepth),
        new Vector2(notchStart, 9),
        new Vector2(0, 9),
      ]);
    } else if (fill === 'CORNER') {
      elementShape = new THREE.Shape([
        new Vector2(0, 0),
        new Vector2(9, 0),
        new Vector2(9, 9),
        new Vector2(cornerSize, 9),
        new Vector2(0, 9 - cornerSize)
      ]);
    } else if (fill === 'SHAVE') {
      elementShape = new THREE.Shape([
        new Vector2(0, 0),
        new Vector2(9, 0),
        new Vector2(9, 9 - notchWidth),
        new Vector2(0, 9 - notchWidth)
      ]);
    }
    const geometry = new THREE.ShapeGeometry(elementShape);
    geometry.translate(-4.5, -4.5, 0);
    if (rotation) {
      geometry.rotateZ(rotation * this.ninetyDeg);
    }
    return geometry;
  }
  getCharacterMap(character) {
    const notch = 'NOTCH';
    const blank = 'BLANK';
    const corner = 'CORNER';
    const shave = 'SHAVE';
    const charactersMap = {
      a: [[{fill: corner}, {fill: notch, rotation: 2}],
        [],
        [{fill: 'SOLID'}, {fill: notch, rotation: 2}, {fill: 'SOLID'}]],
      b: [[{fill: 'SOLID'}, {fill: notch, rotation: 2}, {fill: corner, rotation: 3}],
        [{fill: 'SOLID'}, {fill: 'SOLID'}, {fill: notch, rotation: 3}],
        [{fill: 'SOLID'}, {fill: notch}, {fill: 'SOLID'}]],
      c: [
        [],
        [null, null, {fill: notch, rotation: 3}],
        []
      ],
      d: [[null, null, {fill: corner, rotation: 3}],
        [null, null, {fill: notch, rotation: 1}],
        [null, null, {fill: corner, rotation: 2}]],
      e: [[null, null, {fill: notch, rotation: 3}],
        [null, null, {fill: notch, rotation: 3}],
        []],
      f: [[null, null, {fill: notch, rotation: 3}],
        [],
        [null, null, {fill: blank}]],
      g: [[null, null, null],
        [null, null, {fill: 'SHAVE', rotation: 2}],
        [null, {fill: corner, rotation: 3}, {fill: notch, rotation: 1}]],
      h: [[null, {fill: notch}, null],
        [null, null, null],
        [null, {fill: notch, rotation: 2}, null]],
      i: [[null, null, null],
        [{fill: notch, rotation: 1}, null, {fill: notch, rotation: 3}],
        [null, null, null]],
      j: [[{fill: blank}, null, null],
        [{fill: blank, rotation: 2}, null, null],
        [{fill: corner, rotation: 3},null,  {fill: corner, rotation: 2}]],
      k: [[null, {fill: notch}, null],
        [null, null, {fill: notch, rotation: 3}],
        [null, {fill: notch, rotation: 2}, null]],
      l: [[null, null, { fill: blank}],
        [null, null, null],
        [null, null, null]],
      m: [[null, {fill: notch}, null],
        [null, null, null],
        [{fill: notch, rotation: 2}, null, {fill: notch, rotation: 2}]],
      n: [[null, {fill: notch}, null],
        [null, null, null],
        [{fill: notch, rotation: 2}, null, null]],
      o: [[null, null, null],
        [null, {fill: notch}, null],
        [null, null, null]],
      p: [[null, null, null],
        [null, null, {fill: notch, rotation: 1}],
        [null, null, {fill: blank}]],
      q: [[{fill: corner}, null,  null],
        [null, {fill: corner},  {fill: notch, rotation: 3}],
        [{fill: corner, rotation: 1}, {fill: corner, rotation: 2}, {fill: corner, rotation: 1}]],
      r: [[null, {fill: notch, rotation: 2}, null],
        [null, null, {fill: notch, rotation: 3}],
        [null, null, {fill: corner, rotation: 1}]],
      s: [[null, null, {fill: notch, rotation: 3}],
        [null, null, null],
        [{fill: shave}, null, null]],
      t: [[null, null, null],
        [null, null, null],
        [{fill: blank}, null, {fill: blank}]],
      u: [[null, {fill: shave, rotation: 1}, null],
        [null, null, null],
        [{fill: corner, rotation: 1}, null, {fill: corner, rotation: 2}]],
      v: [[{fill: corner, rotation: 3}, {fill: blank}, {fill: corner}],
        [null, {fill: corner}, {fill: corner, rotation: 2}],
        [{fill: corner, rotation: 1}, {fill: corner, rotation: 2}, {fill: blank}]],
      w: [[{fill: notch}, null, {fill: notch}],
        [null, null, null],
        [null, {fill: shave, rotation: 1}, {fill: corner, rotation: 2}]],
      x: [[{fill: corner, rotation: 1}, {fill: corner, rotation: 3}, {fill: corner, rotation: 0}],
        [{fill: corner}, null, {fill: corner, rotation: 2}],
        [{fill: corner, rotation: 2}, {fill: corner, rotation: 1}, {fill: corner, rotation: 3}]],
      y: [[null, {fill: shave, rotation: 1}, null],
        [null, null, null],
        [{fill: blank}, null, {fill: blank}]],
      z: [[null, null, {fill: corner, rotation: 3}],
        [{fill: shave}, null, ],
        [{fill: corner, rotation: 1}, null, {fill: corner, rotation: 3}]],
      0: [[{fill: corner}],
        [null, {fill: corner}],
        []],
      1: [[null, null, {fill: blank}],
        [{fill: blank}, null, {fill: blank}],
        []
      ],
      2: [[],
        [{fill: shave}, {fill: corner, rotation: 2}, {fill: shave, rotation: 2}],
        [null, null, null]],
      3: [[{fill: shave, rotation: 2}, null, null],
        [{fill: shave, rotation: 2}, null, {fill: corner, rotation: 3}],
        [null, null, null]],
      4: [[{fill: shave, rotation: 3}, {fill: corner}, null],
        [null, null, null],
        [{fill: blank}, null, null]],
      5: [[null, null, {fill: corner, rotation: 1}],
        [null, null, {fill: corner, rotation: 3}],
        [{fill: shave}, null, {fill: corner, rotation: 2}]],
      6: [[{fill: corner}, null, {fill: shave, rotation: 2}],
        [null, null, {fill: corner}],
        [{fill: corner, rotation: 1}, {fill: corner, rotation: 3}, {fill: corner, rotation: 2}]],
      7: [[null, null, null],
        [{fill: blank}, {fill: corner}, null],
        [{fill: blank}, null, null]],
      8: [[null, null, null],
        [null, {fill: corner}, null],
        [null, {fill: corner}, null]],
      9: [[null, {fill: corner, rotation: 1}, null],
        [{fill: shave, rotation: 2}, {fill: corner, rotation: 1}, null],
        [null, null, {fill: corner, rotation: 2}]],
      '.': [[{fill: blank}, {fill: blank}, {fill: blank}],
        [{fill: blank}, {fill: blank}, {fill: blank}],
        [{fill: blank}, {fill: corner}, {fill: blank}]],
      '"': [[{fill: corner, rotation: 2}, {fill: corner, rotation: 2}, {fill: blank}],
        [{fill: blank}, {fill: blank}, {fill: blank}],
        [{fill: blank}, {fill: blank}, {fill: blank}]],
      '\'': [[{fill: corner, rotation: 2}, {fill: blank}, {fill: blank}],
        [{fill: blank}, {fill: blank}, {fill: blank}],
        [{fill: blank}, {fill: blank}, {fill: blank}]],
      '-': [[{fill: blank}, {fill: blank}, {fill: blank}],
        [{fill: corner}, null, {fill: corner, rotation: 2}],
        [{fill: blank}, {fill: blank}, {fill: blank}]],
      '█': [[], [], []]
    };
    return charactersMap[character];
  }
}
