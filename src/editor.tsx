import './index.scss';
import React, { forwardRef, useImperativeHandle } from 'react';
import StarterKit from '@tiptap/starter-kit';
import { useEditor, EditorContent, Extensions } from '@tiptap/react';
import { throttle } from './utils';
import { SubTag } from './extensions/sub';
import { SayAsTag } from './extensions/sayAs';
import { BreakTag } from './extensions/break';
import createLang, { defaultI18n } from './i18n';
import { PhonemeTag } from './extensions/phoneme';
import { useEditorHelper } from './helper';
import { SSMLTagEditorContext } from './context';
import { NumberInterpret, TAlphabet, IProps, IEditorHandler } from './types';

const SSMLTagEditor = 
    forwardRef((props: IProps, ref: React.Ref<IEditorHandler>) => {
        const extensions: Extensions = [StarterKit, SayAsTag, BreakTag, PhonemeTag, SubTag];
        const { language = 'en_us', i18n = defaultI18n } = props;
        const lang = createLang(language, i18n);

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
            numberInterpret?: NumberInterpret;
            validate?: (text: string) => boolean;
        } = {}) => {
            if (!editor) {
                return;
            }
            const { numberInterpret = 'digits', validate } = config;
            const selectionText = helper.getSelectionText();
            const isNum = /^\d+$/.test(selectionText);

            if (!!validate && !validate(selectionText)) {
                return;
            }

            if (!selectionText.length) {
                alert(lang('Select the number first'));
            } else if (!validate && !isNum) {
                alert(lang('Only numbers can be selected'));
            } else {
                (editor.chain().focus() as any)
                    .setNumberInterpret(selectionText, { 'interpret-as': numberInterpret })
                    .run();
            }
        };

        const addBreak = (config: { time?: string; validate?: (pos: number | null) => boolean } = {}) => {
            const { time = '0.5s', validate } = config;
            if (!editor) {
                return;
            }
            const { from, to } = helper.getSelectionPos();
            if (!editor.isFocused || from !== to) {
                validate
                    ? validate(null)
                    : alert(lang('Please select where you want to add a pause'));
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
                : alert(lang('Please select characters first'));
        };

        const addSub = (config: { alias?: string; validate?: (text: string) => boolean } = {}) => {
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
                : alert(lang('Please select characters first'));
        };

        const getSelectionSSML = () => {
            return helper.getSelectionSSML();
        };

        useImperativeHandle(ref, () => ({
            editor,
            helper,
            addBreak,
            addPhoneme,
            addSub,
            getSelectionSSML,
            addNumberInterpret,
            export() {
                return {
                    text: helper.exportText(),
                    json: helper.exportJSON(),
                    ssml: helper.exportSSML(),
                };
            },
        }));

        return (
            <div className="ssml-tag-editor">
                <SSMLTagEditorContext.Provider value={{ state: { language, i18n } }}>
                    <EditorContent editor={editor} placeholder={props.placeholder} />
                </SSMLTagEditorContext.Provider>
            </div>
        );
    });

export default SSMLTagEditor;
