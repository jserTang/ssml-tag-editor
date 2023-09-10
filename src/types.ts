import { Editor, JSONContent } from '@tiptap/core';

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
