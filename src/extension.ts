import { ExtensionContext, ViewColumn, commands, window, workspace } from 'vscode';
import ContentProvider, {encodeLocation} from './provider';

export function activate({subscriptions}: ExtensionContext) {

	const provider = new ContentProvider();

	const providerRegistration = workspace.registerTextDocumentContentProvider(ContentProvider.scheme, provider);

	const commandRegistration = commands.registerTextEditorCommand('code-tanks.runGame', async editor => {
		const currentUri = editor.document.uri;
		const targetUri = encodeLocation(currentUri);

		const doc = await workspace.openTextDocument(targetUri);

		return await window.showTextDocument(doc, ViewColumn.One);
	});

	subscriptions.push(
		provider,
		providerRegistration,
		commandRegistration,
	);
}

export function deactivate() {}