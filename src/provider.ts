import { Disposable, Event, EventEmitter, TextDocumentContentProvider, Uri, window, workspace } from 'vscode';
import GameDocument from './gameDocument';

export default class ContentProvider implements TextDocumentContentProvider {
  static scheme = 'code-tanks';

  private _uri: Uri = Uri.parse('');
  private _onDidChange = new EventEmitter<Uri>();
  private _originTextFile: Uint8Array = new Uint8Array();
  private _document = new GameDocument(this._originTextFile);
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
    const originUri = decodeLocation(uri);
    const originTextFile = await workspace.fs.readFile(originUri);
    this._document = new GameDocument(originTextFile);
    
    return this._document.text;
  }
}

export function encodeLocation(uri: Uri): Uri {
  const query = JSON.stringify(uri.toString());

  return Uri.parse(`${ContentProvider.scheme}:CodeTanksGame?${query}`);
}

export function decodeLocation(uri: Uri): Uri {
	const target = <string>JSON.parse(uri.query);
  
	return Uri.parse(target);
}