import { Range, Editor, JSONContent } from '@tiptap/core';
import { getSelectionText, isSSMLTag, getNodeSSML } from './utils';

export const useEditorHelper = (editor: Editor | null) => {
    return [
        {
            deleteSelection() {
                return editor && editor.commands.deleteSelection();
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
                const { from, to } = editor.state.selection;
                if (from !== to) {
                    return getSelectionText(editor.getJSON(), from, to);
                }

                return '';
            },
            getSelectionSSML() {
                if (!editor) {
                    return { ssml: '', from: 0, to: 0 };
                }
                const { from, to } = editor.state.selection;
                let selectionSSML = '';
                if (from !== to) {
                    selectionSSML = getSelectionText(editor.getJSON(), from, to, true);
                }
                return { ssml: selectionSSML, from, to };
            },
            getTagsInSelection() {
                const tags: any[] = [];
                if (!editor) {
                    return tags;
                }
                const { from, to } = editor.state.selection;
                let currentPos = 1;
                if (from !== to) {
                    const json = editor.getJSON();
                    const tagFilter = (node: JSONContent) => {
                        if (currentPos >= to) {
                            return;
                        }
                        let inRange = currentPos >= from && currentPos < to;
                        if (isSSMLTag(node.type)) {
                            currentPos += 1;
                            inRange && tags.push(node);
                        } else if (node.type === 'text' || node.text) {
                            const text = node.text || '';
                            for (let i = 0; i < text.length; i++) {
                                currentPos++;
                            }
                        } else if (node.type === 'hard_break' || node.type === 'hardBreak') {
                            currentPos += 1;
                        } else if (node.type === 'paragraph' && !node.content) {
                            currentPos += 2;
                        } else {
                            if (Array.isArray(node.content)) {
                                node.content.forEach(tagFilter);
                                currentPos += 2;
                            }
                        }
                    };

                    (json.content || []).forEach(tagFilter);
                }
                return tags;
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
