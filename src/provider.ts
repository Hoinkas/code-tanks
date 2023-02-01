import { Disposable, Event, EventEmitter, Position, TextDocumentContentProvider, Uri, window, workspace } from 'vscode';
import GameMap from './gameMap';

export default class ContentProvider implements TextDocumentContentProvider {
  static scheme = 'code-tanks';

  private _onDidChange: EventEmitter<Uri> = new EventEmitter<Uri>();
  private _originTextFile: Uint8Array = new Uint8Array();
  private _postion: Position = new Position(0,0);
  private _document: GameMap = new GameMap(this._originTextFile, this._postion);
  private _subscriptions: Disposable = new Disposable(() => {});

  constructor() {
    this._subscriptions = workspace.onDidCloseTextDocument(this.dispose);
  }

  dispose(): void {
    this._subscriptions.dispose();
    this._onDidChange.dispose();
  }

  get onDidChange(): Event<Uri> {
    return this._onDidChange.event;
  }

  async provideTextDocumentContent(uri: Uri): Promise<string> {
    const [originUri, position] = decodeLocation(uri);
    const originTextFile = await workspace.fs.readFile(originUri);
    this._document = new GameMap(originTextFile, position);
    
    return this._document.text;
  }
}

export function encodeLocation(uri: Uri, positon: Position): Uri {
  const query = JSON.stringify([uri.toString(), positon.line, positon.character]);

  return Uri.parse(`${ContentProvider.scheme}:CodeTanksGame?${query}`);
}

export function decodeLocation(uri: Uri): [Uri, Position] {
	const [target, line, character] = <[string, number, number]>JSON.parse(uri.query);

	return [Uri.parse(target), new Position(line, character)];
}