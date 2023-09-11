import { Range, Editor, JSONContent } from '@tiptap/core';
import { getSelectionTextIncludeTag, isSSMLTag, getNodeSSML } from './utils';

export const useEditorHelper = (editor: Editor | null) => {
    return [
        {
            deleteSelection() {
                editor && editor.commands.deleteSelection();
            },
            setTextSelection(range: Range | number) {
                editor && editor.commands.setTextSelection(range);
            },
            getSelectionPos() {
                if (!editor) {
                    return { from: 0, to: 0 };
                }
                const { from, to } = editor.state.selection;
                return { from, to };
            },
            getSelectionText() {
                if (!editor || !editor.state.selection) {
                    return '';
                }
                let text = '';
                const { from, to } = editor.state.selection;
                if (from !== to) {
                    text = editor.state.doc.textBetween(from, to);
                }

                return text;
            },
            getSelectionSSML() {
                if (!editor) {
                    return { ssml: '', from: 0, to: 0 };
                }
                const { from, to } = editor.state.selection;
                let selectionSSML = '';
                if (from !== to) {
                    selectionSSML = getSelectionTextIncludeTag(editor.getJSON(), from, to);
                }
                return { ssml: selectionSSML, from, to };
            },
            formatNodeToSSML(node: JSONContent) {
                let content = '';

                if (isSSMLTag(node.type)) {
                    content += getNodeSSML(node);
                } else if (node.type === 'hard_break') {
                    content += '\n';
                } else if (node.type === 'text' || node.text) {
                    content += node.text;
                } else {
                    content += (node.content || []).map((node) => this.formatNodeToSSML(node)).join('') + '\n';
                }
                return content;
            },
            formatJsonToSSML(json: JSONContent) {
                const content = (json.content || []).map((node) => {
                    return this.formatNodeToSSML(node);
                });
                return content.join('');
            },
            exportSSML() {
                if (!editor) {
                    return '';
                }
                const ssmlJSON = editor.getJSON();
                return `<speak>${this.formatJsonToSSML(ssmlJSON)}</speak>`;
            },
            exportText() {
                if (!editor) {
                    return '';
                }
                return editor.getText();
            },
            exportJSON(): JSONContent {
                if (!editor) {
                    return {};
                }
                return editor.getJSON();
            },
            exportHTML() {
                if (!editor) {
                    return '';
                }
                return editor.getHTML();
            },
        },
    ];
};
