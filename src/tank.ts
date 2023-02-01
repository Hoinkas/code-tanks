import { readFileSync } from 'fs';
import { Position } from 'vscode';

export default class Tank {
  private _tankWidth: number = 0;
  private _tankHeight: number = 0;
  private _tankModel: string[][] = [];
  private _textArray: string[] = [];
  private _leftBottomTankCorner: Position = new Position(0,0);

  constructor(previousPosition: Position){
    this._readFileWithASCITank();
    this._loadTankFromFile();

    this._leftBottomTankCorner = previousPosition;
  }

  private _readFileWithASCITank() {
    const file = readFileSync(`${__dirname}\\tankASCII.txt`,'utf8');
    this._textArray = file.split('\n').map(line => line.replace('\r', ''));
  }

  private _loadTankFromFile() {
    const indexOfTank = this._textArray.findIndex(value => value === 'East');
    let textArray = this._textArray;

    if(indexOfTank < 0) {
      console.error('No East tank in tankASCI.txt file');
    }

    textArray = textArray.slice(indexOfTank + 1);
    const endOfTank = textArray.findIndex(value => value === '---------------');

    if(endOfTank < 0) {
      console.error('No end line in tankASCII.txt file');
    }

    textArray = textArray.slice(0, endOfTank);

    for (let i = 0; i < textArray.length; i++){
      this._tankModel[i] = textArray[i].split('');
    }
    
    this._tankWidth = this._tankModel[0].length;
    this._tankHeight = this._tankModel.length;
  }
  
  set positionXAxis(newLineIndex: number) {
    this._leftBottomTankCorner = this._leftBottomTankCorner.with({line: newLineIndex});
  }

  set positionYAxis(newCharacterIndex: number) {
    this._leftBottomTankCorner = this._leftBottomTankCorner.with({character: newCharacterIndex});
  }

  get leftBottomPosition() {
    return this._leftBottomTankCorner;
  }

  get height() {
    return this._tankHeight;
  }

  get width() {
    return this._tankWidth;
  }

  get bottomPartWidth() {
    return this._tankModel[1].length;
  }

  get model() {
    return this._tankModel;
  }
}