import { Position, window } from "vscode";
import Tank from "./tank";

export default class GameMap {
  private _text: string = '';
  private _map: string[][] = [];
  private _lenghtOfLand: number = 0;
  private _cursorPosition: Position = new Position(0,0);
  private _tank: Tank = new Tank(this._cursorPosition);

  constructor(previousFile: Uint8Array, cursorPosition: Position){
    this._lenghtOfLand = this._tank.bottomPartWidth;
    this._cursorPosition = cursorPosition;

    this._generateMapFromTextFile(previousFile);
    this._addTanksToMap();

    this._mapToString();
  }

  get text(): string {
    return this._text;
  }

  private async _generateMapFromTextFile(previousFile: Uint8Array): Promise<void> {
    this._fileTextToMap(previousFile);
    this._addGamerTankSymbolToMapByCursorPosition();
    this._multiplyMapLandByLenghtOfLand();
    this._fillEmptyMapPlacesWithSky();
    this._rotateMapClockwise();
  }

  private _fileTextToMap(file: Uint8Array) {
    this._text = file.toString();
    const mapLines = this._text.split('\n');
    this._map = mapLines.map((line) => line.replace('\t', '   ',).replace('\r', '').replace('\n', '').split(''));
  }

  private _addGamerTankSymbolToMapByCursorPosition() {
    const positionLineIndex = this._cursorPosition.line;
    const lenghtOfSelectedLineOnMap = this._map[positionLineIndex].length;

    this._map[positionLineIndex][lenghtOfSelectedLineOnMap + 1] = '@';
  }

  private _multiplyMapLandByLenghtOfLand(){
    const newMap: string[][] = [];

    this._map.forEach(line => {
      for (let i = 0; i < this._lenghtOfLand; i++){
        newMap.push(line);
      }
    });

    this._map = newMap;
  }

  private _fillEmptyMapPlacesWithSky() {
    let maxLineLenght = Math.max(...this._map.map(i => i.length));
    const fixedMapHeightByTankHeight = maxLineLenght + this._tank.height;

    for (let i = 0; i < this._map.length; i++){
      for (let j = 0; j < fixedMapHeightByTankHeight; j++)
      {
        if (this._map[i]){
          this._map[i][j] =  this._map[i][j] || ' ';
        } else {
          this._map[i][j] = ' ';
        }
      }
    }
  }

  private _rotateMapClockwise() {
    if(this._map && this._map[0]) {
      this._map = this._map[0].map((_, colIndex) => this._map.map(row => row[row.length-1-colIndex]));
    }
  }

  private _addTanksToMap() {
    this._fixGamerTankPositionByTankSymbolPosition();
    this._renderGamerTankOnMap();
  }

  private _fixGamerTankPositionByTankSymbolPosition() {
    this._tank.positionYAxis = this._map.findIndex(row => {
      const columnIndexTemp = row.indexOf('@');

      if(columnIndexTemp !== -1){
        this._tank.positionXAxis = columnIndexTemp;
        return true;
      }

      return false;
    });
  }

  private _renderGamerTankOnMap() {
    const tankLeftBottomPosition = this._tank.leftBottomPosition;
    const lineIndex = tankLeftBottomPosition.line;
    const characterIndex = tankLeftBottomPosition.character;

    const tankModel = this._tank.model;
    const tankWidth = this._tank.width;
    const tankHeight = this._tank.height;

    for (let i = characterIndex; i < characterIndex + tankHeight; i++){
      for (let j = lineIndex; j < lineIndex + tankWidth; j ++){
        if(this._map[i] && this._map[i][j]){
          this._map[i][j] = tankModel[i-characterIndex][j-lineIndex] || ' ';
        }
        else {
          this._map[i-characterIndex][j-lineIndex] = tankModel[i-characterIndex][j-lineIndex] || ' ';
        }
      }
    }
  }

  private _mapToString() {
    const mapLines = this._map.map((row) => row.join(''));
    this._text = mapLines.join('\n');
  }
}