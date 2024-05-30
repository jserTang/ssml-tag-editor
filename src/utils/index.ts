import { JSONContent } from '@tiptap/core';

export enum KEY_CODE {
    KEY_BACKSPACE = 8,
    KEY_ENTER = 13,
    KEY_ESCAPE = 27,
    KEY_ARROW_LEFT = 37,
    KEY_ARROW_UP = 38,
    KEY_ARROW_RIGHT = 39,
    KEY_ARROW_DOWN = 40,
    KEY_DELETE = 46,
    KEY_0 = 48,
    KEY_1 = 49,
    KEY_2 = 50,
    KEY_3 = 51,
    KEY_4 = 52,
    KEY_5 = 53,
    KEY_6 = 54,
    KEY_7 = 55,
    KEY_8 = 56,
    KEY_9 = 57,
    KEY_CONTROL = 17,
    KEY_COMMAND = 91,
}

export enum KEY_NAME {
    KEY_ENTER = 'Enter',
    KEY_COMMAND = 'Meta',
    KEY_CONTROL = 'Control',
    KEY_BACKSPACE = 'Backspace',
    KEY_ARROW_UP = 'ArrowUp',
    KEY_ARROW_DOWN = 'ArrowDown',
}

export const ssmlTags: { [key: string]: string } = {
    'say-as': 'say-as',
    'break': 'break',
    'phoneme': 'phoneme',
    'sub': 'sub',
};

export const alphabetMap: Record<string, string> = {
    cn: 'pinyin',
    en: 'ipa',
};

export const isSSMLTag = (nodeType?: string) => {
    return !!nodeType && !!ssmlTags[nodeType];
};

export const debounce = (
    func: (...args: any[]) => any,
    wait: number,
    context?: any,
    immediate = false,
): ((...args: any[]) => any) => {
    context = context || null;
    let timeout: number | null;
    return (...args: any[]) => {
        const later = () => {
            timeout = null;
            if (!immediate) {
                func.call(context, ...args);
            }
        };
        const callNow = immediate && !timeout;
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = window.setTimeout(later, wait);
        if (callNow) {
            func.call(context, ...args);
        }
    };
};

export function throttle<T extends any[]>(func: (...args: T) => void, interval: number): (...args: T) => void {
    let timer: NodeJS.Timeout | null = null;
    let previous = 0;
    let lastArgs: T | null = null;

    return function (...args: T) {
        const now = Date.now();
        const remaining = interval - (now - previous);

        lastArgs = args;

        if (remaining <= 0) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }

            func(...args);
            previous = now;
        } else if (!timer) {
            timer = setTimeout(() => {
                if (lastArgs) {
                    func(...lastArgs);
                    lastArgs = null;
                }
                timer = null;
                previous = Date.now();
            }, remaining);
        }
    };
}

export const getNodeSSML = (node: JSONContent) => {
    const attrs = node.attrs || {};
    let text = `${attrs.text || ''}`.trim();
    let ssml = '';
    if (!node.type) {
        return ssml;
    }

    const tagName = ssmlTags[node.type];
    if (!!tagName) {
        let attrStr = '';
        for (const key in attrs) {
            if (Object.prototype.hasOwnProperty.call(attrs, key)) {
                if (key.startsWith('_')) {
                    continue;
                }
                const attr = `${attrs[key]}`.trim();
                attr && (attrStr += ` ${key}="${attr}"`);
            }
        }
        if (!!text) {
            ssml = attrs._empty ? text : `<${tagName}${attrStr}>${text}</${tagName}>`;
        } else {
            ssml = `<${tagName}${attrStr}/>`;
        }
    }
    return ssml;
};

export function getSelectionText(json: JSONContent, from: number, to: number, includeTag = false) {
    let selectionText = '';
    let currentPos = 1;

    const selectNodeText = (node: JSONContent) => {
        if (currentPos >= to) {
            return;
        }
        let inRange = currentPos >= from && currentPos < to;
        if (isSSMLTag(node.type)) {
            if (inRange) {
                selectionText += includeTag ? getNodeSSML(node) : `${node.attrs?.text || ''}`.trim();
            }
            currentPos += 1;
        } else if (node.type === 'text' || node.text) {
            const text = node.text || '';
            for (let i = 0; i < text.length; i++) {
                inRange = currentPos >= from && currentPos < to;
                if (inRange) {
                    selectionText += text[i];
                }
                currentPos++;
            }
        } else if (node.type === 'hard_break' || node.type === 'hardBreak') {
            if (inRange) {
                selectionText += includeTag ? '\n' : '';
            }
            currentPos += 1;
        } else if (node.type === 'paragraph' && !node.content) {
            if (inRange) {
                selectionText += '\n';
            }
            currentPos += 2;
        } else {
            if (Array.isArray(node.content)) {
                node.content.forEach(selectNodeText);
                selectionText += '\n';
                currentPos += 2;
            }
        }
    };

    (json.content || []).forEach(selectNodeText);

    return selectionText.trim();
}

export const findClosestParent = (element: HTMLElement, className: string) => {
    let currentElement: HTMLElement | null = element;

    while (currentElement && !currentElement.classList.contains(className)) {
        currentElement = currentElement.parentElement;
    }

    return currentElement;
};

