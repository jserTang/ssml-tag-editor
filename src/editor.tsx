import './index.scss';
import React, { memo, forwardRef, useImperativeHandle } from 'react';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { useEditor, EditorContent, Extensions } from '@tiptap/react';
import { message } from 'antd';
import { throttle } from './utils';
import { SubTag } from './extensions/sub';
import { SayAsTag } from './extensions/sayAs';
import { BreakTag } from './extensions/break';
import createLang, { defaultI18n } from './i18n';
import { PhonemeTag } from './extensions/phoneme';
import { IHelper, useEditorHelper } from './helper';
import { SSMLTagEditorContext } from './context';
import { NumberInterpret, IExportData, Language, TAlphabet } from './types';

interface IProps {
    placeholder?: string;
    defaultContent?: string;
    language?: Language;
    i18n?: { [text: string]: { [lang: string]: string } };
    onSelection?(text: string): void;
    onUpdate?(data: { text: string; ssml: string }): void;
    onFocus?: VoidFunction;
    onBlur?: VoidFunction;
}

export interface IEditorHandler {
    helper: IHelper;
    editor: Editor | null;
    export(): IExportData;
    /**
     * Market number interpret
     * 标记数字读法
     */
    addNumberInterpret(config: { numberInterpret: NumberInterpret; validate?: (text: string) => boolean }): void;
    /**
     * Mark a silent pause
     * 标记停顿
     */
    addBreak(config: { time?: string; validate?: (pos: number) => boolean }): void;
    /**
     * Mark the pronunciation of English words or Chinese polyphonics
     * 标记英文单词或中文多音字的发音。
     */
    addPhoneme(config?: { phoneme?: string; validate?: (text: string) => boolean }): void;
    /**
     * Get the SSML of the selected text
     */
    getSelectionSSML(): { ssml: string; from: number; to: number };
}

const SSMLTagEditor = memo(
    forwardRef((props: IProps, ref: React.Ref<IEditorHandler>) => {
        const extensions: Extensions = [StarterKit, SayAsTag, BreakTag, PhonemeTag, SubTag];
        const { language = 'en_us', i18n = defaultI18n } = props;
        const lang = createLang(language, i18n);
        const [messageApi, contextHolder] = message.useMessage();

        const editor = useEditor({
            extensions,
            enableCoreExtensions: true,
            content: props.defaultContent || '',
            onSelectionUpdate: throttle(() => {
                if (props.onSelection) {
                    const selectionText = helper.getSelectionText();
                    props.onSelection(selectionText);
                }
            }, 500),
            onFocus() {
                props.onFocus && props.onFocus();
            },
            onBlur() {
                props.onBlur && props.onBlur();
            },
            onUpdate: throttle(() => {
                if (props.onUpdate) {
                    const data = {
                        text: helper.exportText(),
                        ssml: helper.exportSSML(),
                    };
                    props.onUpdate(data);
                }
            }, 1000),
        });

        const [helper] = useEditorHelper(editor);

        const addNumberInterpret = (config: {
            numberInterpret: NumberInterpret;
            validate?: (text: string) => boolean;
        }) => {
            if (!editor) {
                return;
            }
            const { numberInterpret, validate } = config;
            const selectionText = helper.getSelectionText();
            const isNum = /^\d+$/.test(selectionText);

            if (!!validate && !validate(selectionText)) {
                return;
            }

            if (!selectionText.length) {
                messageApi.open({
                    type: 'warning',
                    content: lang('Select the number first'),
                });
            } else if (!validate && !isNum) {
                messageApi.open({
                    type: 'warning',
                    content: lang('Only numbers can be selected'),
                });
            } else {
                (editor.chain().focus() as any)
                    .setNumberInterpret(selectionText, { 'interpret-as': numberInterpret })
                    .run();
            }
        };

        const addBreak = (config: { time?: string; validate?: (pos: number | null) => boolean }) => {
            const { time = '0.5s', validate } = config;
            if (!editor) {
                return;
            }
            const { from, to } = helper.getSelectionPos();
            if (!editor.isFocused || from !== to) {
                validate
                    ? validate(null)
                    : messageApi.open({
                          type: 'warning',
                          content: lang('Please select where you want to add a pause'),
                      });
                return;
            }
            if (validate) {
                validate(from) && (editor.chain().focus() as any).setBreakTime(time).run();
            } else {
                (editor.chain().focus() as any).setBreakTime(time).run();
            }
        };

        const addPhoneme = (
            config: { ph?: string; alphabet?: TAlphabet; validate?: (text: string) => boolean } = {},
        ) => {
            const { ph = '', alphabet = language === 'zh_cn' ? 'pinyin' : 'ipa', validate } = config;
            if (!editor) {
                return;
            }
            const selectionText = helper.getSelectionText();
            const hasSelection = !!selectionText.trim().length;
            const addPhonemeTag = () => {
                (editor.chain().focus() as any).setPhoneme(selectionText, { ph, alphabet }).run();
            };

            if (!!validate) {
                validate(selectionText) && hasSelection ? addPhonemeTag() : void 0;
                return;
            }
            !!selectionText.length
                ? addPhonemeTag()
                : messageApi.open({
                      type: 'warning',
                      content: lang('Please select characters first'),
                  });
        };

        const setSub = (config: { alias?: string; validate?: (text: string) => boolean } = {}) => {
            const { alias = '', validate } = config;
            if (!editor) {
                return;
            }
            const selectionText = helper.getSelectionText();
            const hasSelection = !!selectionText.trim().length;
            const addSubTag = () => {
                (editor.chain().focus() as any).setSub(selectionText, { alias }).run();
            };

            if (!!validate) {
                validate(selectionText) && hasSelection ? addSubTag() : void 0;
                return;
            }
            !!selectionText.length
                ? addSubTag()
                : messageApi.open({
                      type: 'warning',
                      content: lang('Please select characters first'),
                  });
        };

        const getSelectionSSML = () => {
            return helper.getSelectionSSML();
        };

        useImperativeHandle(ref, () => {
            return {
                editor,
                helper,
                addBreak,
                addPhoneme,
                setSub,
                getSelectionSSML,
                addNumberInterpret,
                export() {
                    return {
                        text: helper.exportText(),
                        json: helper.exportJSON(),
                        ssml: helper.exportSSML(),
                    };
                },
            };
        });

        return (
            <div className="ssml-tag-editor">
                {contextHolder}
                <SSMLTagEditorContext.Provider value={{ state: { language, i18n } }}>
                    <EditorContent editor={editor} placeholder={props.placeholder} />
                </SSMLTagEditorContext.Provider>
            </div>
        );
    }),
);

export default SSMLTagEditor;
