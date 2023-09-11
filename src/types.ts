import { Range, Editor, JSONContent } from '@tiptap/core';
export type { Range, Editor, JSONContent } from '@tiptap/core';

export interface IProps {
    placeholder?: string;
    defaultContent?: string;
    language?: Language;
    i18n?: { [text: string]: { [lang: string]: string } };
    onSelection?(text: string): void;
    onUpdate?(data: { text: string; ssml: string }): void;
    onFocus?: VoidFunction;
    onBlur?: VoidFunction;
}

export interface IHelper {
    deleteSelection(): void;
    setTextSelection(range: Range | number): void;
    getSelectionPos(): { from: number; to: number };
    getSelectionText(): string;
    getSelectionSSML(): { ssml: string; from: number; to: number };
    formatNodeToSSML(node: JSONContent): string;
    formatJsonToSSML(json: JSONContent): string;
    exportHTML(): string;
    exportSSML(): string;
    exportText(): string;
    exportJSON(): JSONContent;
}

export interface IEditorHandler {
    helper: IHelper;
    editor: Editor | null;
    export(): IExportData;
    /**
     * Market number interpret
     * 标记数字读法
     */
    addNumberInterpret(config?: { numberInterpret: NumberInterpret; validate?: (text: string) => boolean }): void;
    /**
     * Mark a silent pause
     * 标记停顿
     */
    addBreak(config?: { time?: string; validate?: (pos: number) => boolean }): void;
    /**
     * Mark the pronunciation of English words or Chinese polyphonics
     * 标记英文单词或中文多音字的发音。
     */
    addPhoneme(config?: { phoneme?: string; validate?: (text: string) => boolean }): void;
    /**
     * Mark the pronunciation of English words or Chinese polyphonics
     * 
     */
    addSub(config?: { alias?: string; validate?: (text: string) => boolean }): void;
    /**
     * Get the SSML of the selected text
     */
    getSelectionSSML(): { ssml: string; from: number; to: number };
}

export interface IReactNodeProps {
    editor: Editor;
    selected: boolean;
    node: { attrs: { [key: string]: any } };
    getPos: () => number;
    deleteNode: () => void;
    updateAttributes: (attrs: { [key: string]: any }) => void;
}

export interface IMarkerSelectorProps extends IReactNodeProps {
    remove: (attrName: string) => void;
}

export type NumberInterpret = 'digits' | 'cardinal' | 'telephone';

export interface IExportData {
    ssml: string;
    text: string;
    json: JSONContent;
}

export type TAlphabet = 'ipa' | 'pinyin' | 'x-sampa';

export type Language =
    | 'zh_cn'
    | 'ja_jp'
    | 'zh_tw'
    | 'th_th'
    | 'es_es'
    | 'en_us'
    | 'ko_kr'
    | 'fr_fr'
    | 'id_id'
    | 'ru_ru'
    | 'pt_br'
    | 'de_de'
    | 'it_it'
    | 'vi_vn';
