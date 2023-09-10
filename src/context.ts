import { createContext } from 'react';
import { Language } from './types';

export interface IContext {
    state: {
        language: Language;
        i18n: { [text: string]: { [lang: string]: string } };
    };
}

export const SSMLTagEditorContext = createContext<IContext>({} as IContext);
