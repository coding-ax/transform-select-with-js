// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const lodash = require('lodash');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const currentFnDisposable = vscode.commands.registerCommand(
		"transform-select-with-js.exec-js",
		async function () {
			// 编辑器对象
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				return;
			}
			// 获取所有选中文本
			const allSelections = editor.selections;
			// 打开一个输入框
			const fn =
				(await vscode.window.showInputBox({
					password: false,
					title:
						"请输入js表达式并 return, text 参数为默认匹配参数 同时自带lodash ",
					placeHolder:
						"如 return text.toUpperCase() /  return lodash.snakeCase(text)",
				})) || "";
			if (!fn) {
				return;
			}
			// text作为参数传入
			const currentFn = new Function("text", "lodash", fn);

			editor.edit(async (editBuilder) => {
				// 遍历并替换文本
				allSelections.forEach((selection) => {
					const text = editor.document.getText(selection);
					const result = currentFn(text, lodash);
					editBuilder.replace(selection, result);
				});
			});
		}
	);

	context.subscriptions.push(currentFnDisposable);

}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
