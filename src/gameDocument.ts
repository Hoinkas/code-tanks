export default class GameDocument {
  private _text: string = '';
  private _lines: string[] = [];
  private _matrix: string[][] = [];
  private _lenghtOfLand: number = 7;

  constructor(previousFile: Uint8Array){
    this.rotateFileText(previousFile);
  }

  get text(): string {    
    return this._text;
  }

  private async rotateFileText(previousFile: Uint8Array): Promise<void> {
    this._fileTextTo2DTable(previousFile);
    this._turn2DTableToMatrix();
    this._rotateMatrix90Clockwise();
    this._matrixToString();
  }

  private _fileTextTo2DTable(file: Uint8Array) {
    this._text = file.toString();
    this._lines = this._text.split('\n');
    const lines = this._lines.map((line) => line.replace('\t', '    ',).replace('\r', '').replace('\n', '').split(''));

    lines.forEach(line => {
      for (let i = 0; i < this._lenghtOfLand; i++){
        this._matrix.push(line);
      }
    });
  }

  private _turn2DTableToMatrix() {
    let maxLenght = Math.max(...this._matrix.map(i => i.length));

    for (let i = 0; i < this._matrix.length; i++){
      for (let j = 0; j < maxLenght; j++)
      {
        if (this._matrix[i]){
          this._matrix[i][j] =  this._matrix[i][j] || ' ';
        } else {
          this._matrix[i][j] = ' ';
        }
      }
    }
  }

  private _rotateMatrix90Clockwise() {
    if(this._matrix && this._matrix[0]) {
      this._matrix = this._matrix[0].map((_, colIndex) => this._matrix.map(row => row[row.length-1-colIndex]));
    }
  }

  private _matrixToString() {
    this._lines = this._matrix.map((row) => row.join(''));
    this._text = this._lines.join('\n');
  }
}