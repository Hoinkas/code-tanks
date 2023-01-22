import * as vscode from 'vscode';
import * as tanks from 'tanks';

export function activate({subscriptions}: vscode.ExtensionContext) {
	
	const myScheme = 'code-tanks';

	const myProvider = new class implements vscode.TextDocumentContentProvider {
		onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
		onDidChange = this.onDidChangeEmitter.event;
		
		provideTextDocumentContent(uri: vscode.Uri): string {
			return uri.path;
		}
	};

	subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(myScheme, myProvider));

	subscriptions.push(vscode.commands.registerCommand('code-tanks.runGame', async () => {

		if(!vscode.workspace.workspaceFolders || !vscode.window.activeTextEditor) {
			vscode.window.showErrorMessage('No active text editor');

			return;
		}

		const { document } = vscode.window.activeTextEditor;

		if (document.uri.scheme !== myScheme) {
			vscode.window.showErrorMessage('Invalid text editor scheme');

			return;
		}

		const uri = vscode.Uri.parse(document.fileName);

		const openedDocument = await vscode.workspace.openTextDocument(uri.with({ scheme: 'untitled' }));
		const showDocument = vscode.window.showTextDocument(openedDocument);

		return showDocument;			
	}));
}

export function deactivate() {}
