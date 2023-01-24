export default class GameDocument {
  private _text: string = '';
  private _lines: string[] = [];
  private _matrix: string[][] = [];

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
    const lines = this._lines.map((line) => line.replace('\t', '    ',).replace('\r', ' ').split(''));

    lines.forEach(line => {
      this._matrix.push(line,line,line);
    });
  }

  private _turn2DTableToMatrix() {
    let maxLenght = Math.max(...this._matrix.map(i => i.length));

    const matrix = Array.from({length: maxLenght}, () => Array.from({length: maxLenght}, () => ' '));

    matrix.forEach((_, rowIndex) => {      
      matrix[rowIndex].forEach((_, columnIndex) => {
        if (this._matrix[rowIndex]){
          matrix[rowIndex][columnIndex] =  this._matrix[rowIndex][columnIndex] || ' ';
        } else {
          matrix[rowIndex][columnIndex] = ' ';
        }
      });
    });

    this._matrix = matrix;
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