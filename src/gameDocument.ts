export default class GameDocument {
  private _text: string = '';
  private _lines: string[] = [];
  private _matrix: string[][] = [];

  constructor(previousFile: Uint8Array){
    this.transposeFileText(previousFile);
  }

  get text(): string {    
    return this._text;
  }

  private async transposeFileText(previousFile: Uint8Array): Promise<void> {
    this._fileTextToMatrix(previousFile);
    this._transposeMatrix();
    this._matrixToString();
  }

  private _fileTextToMatrix(file: Uint8Array) {
    this._text = file.toString();
    this._lines = this._text.split('\n');
    this._matrix = this._lines.map((line) => line.split(''));
  }

  private _transposeMatrix() {
    this._matrix = this._matrix[0].map((_, i) => this._matrix.map(row => row[i]));
  }

  private _matrixToString() {
    this._lines = this._matrix.map((row) => row.join(''));
    this._text = this._lines.join('\n');
  }
}