import { Position, workspace } from "vscode";
import Tank from "./tank";
import { MapDirection } from "./settingsTypes";

export default class GameMap {
  private _text: string = '';
  private _map: string[][] = [['']];
  private _cursorPosition: Position = new Position(0,0);
  private _tank: Tank = new Tank(this._cursorPosition);
  private _mapDirection: MapDirection = 'Horizontal';

  constructor(previousFile: Uint8Array, cursorPosition: Position){
    this._cursorPosition = cursorPosition;

    this._generateMapFromTextFile(previousFile);
    this._addTanksToMap();

    this._mapToString();
  }

  get text(): string {
    return this._text;
  }

  // MAP RENDERING
  private async _generateMapFromTextFile(previousFile: Uint8Array): Promise<void> {
    this._fileTextToMap(previousFile);
    this._addGamerTankSymbolToMapByCursorPosition();

    this._setAndWatchCurrentRenderDirectionFromSettins();

    this._rotateMapAndOrFillWithSky(); 
  }

  private _setAndWatchCurrentRenderDirectionFromSettins() {
    const settings = workspace.getConfiguration('map');
    this._mapDirection = settings.get('renderDirection');

    workspace.onDidChangeConfiguration(event => {
      let affected = event.affectsConfiguration('renderDirection');

      if (affected) {
        this._mapDirection = settings.get('renderDirection');
      }
    });
  }

  private _fileTextToMap(file: Uint8Array) {
    this._text = file.toString();
    const mapLines = this._text.split('\n');
    this._map = mapLines.map((line) => line.replace('\t', '   ',).replace('\r', '').replace('\n', '').split(''));
  }

  private _addGamerTankSymbolToMapByCursorPosition() {
    const positionLineIndex = this._cursorPosition.line;
    const lenghtOfSelectedLineOnMap = this._map[positionLineIndex].length;
    let renderPosition = lenghtOfSelectedLineOnMap;

    if(lenghtOfSelectedLineOnMap > 0){
      renderPosition++;
    }

    this._map[positionLineIndex][renderPosition] = '@';
  }

  private _rotateMapAndOrFillWithSky() {
    const isVertical = this._mapDirection === 'Vertical';

    if(isVertical){
      this._multiplyMapLandByLengthOfTankBottom();
    }

    this._fillEmptyMapPlacesWithSky();

    if(isVertical){
      this._rotateMapClockwise();
    }
  }

  // MAP RENDERING - MAP ROTATION
  private _multiplyMapLandByLengthOfTankBottom(){
    const lenghtOfLand = this._tank.bottomPartWidth;

    const newMap: string[][] = [];

    this._map.forEach(line => {
      for (let i = 0; i < lenghtOfLand; i++){
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

  // TANKS RENDERING
  private _addTanksToMap() {
    if (this._map.length >= 2){
      this._moveGamerTankPositionToTankSymbolPosition();
      this._renderGamerTank();
    }
  }

  private _moveGamerTankPositionToTankSymbolPosition() {
    this._tank.positionYAxis = this._map.findIndex(row => {
      const columnIndexTemp = row.indexOf('@');

      if(columnIndexTemp !== -1){
        this._tank.positionXAxis = columnIndexTemp;

        return true;
      }
      return false;
    });
  }

  private _renderGamerTank() {
    const tankLeftBottomPosition = this._tank.leftBottomPosition;
    const lineIndex = tankLeftBottomPosition.line - 1;
    const characterIndex = tankLeftBottomPosition.character - 1;

    const tankModel = this._tank.model;
    const tankWidth = this._tank.width;
    const tankHeight = this._tank.height;

    for (let i = characterIndex; i < characterIndex + tankHeight; i++){
      for (let j = lineIndex; j < lineIndex + tankWidth; j ++){
        if(!this._map[i]) {
          this._map[i] = [];
        }

        this._map[i][j] = tankModel[i-characterIndex][j-lineIndex] || ' ';
      }
    }
  }

  // MAP RETURN
  private _mapToString() {
    const mapLines = this._map.map((row) => row.join(''));
    this._text = mapLines.join('\n');
  }
}