import { JSONContent } from '@tiptap/core';

export const ssmlTags: { [key: string]: string } = {
    'say-as': 'say-as',
    'break': 'break',
    'phoneme': 'phoneme',
    'sub': 'sub',
};

export const isSSMLTag = (nodeType?: string) => {
    return !!nodeType && !!ssmlTags[nodeType];
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
                const attr = `${attrs[key]}`.trim();
                attr && (attrStr += ` ${key}="${attr}"`);
            }
        }
        if (!!text) {
            ssml = `<${tagName}${attrStr}>${text}</${tagName}>`;
        } else {
            ssml = `<${tagName}${attrStr}/>`;
        }
    }
    return ssml;
};

export function getSelectionTextIncludeTag(json: JSONContent, from: number, to: number) {
    let selectionText = '';
    let currentPos = 1;

    const selectNodeText = (node: JSONContent) => {
        let text = '';
        if (isSSMLTag(node.type)) {
            if (currentPos >= from && currentPos < to) {
                selectionText += getNodeSSML(node);
            }
            currentPos += 1;
        } else if (node.type === 'text' || node.text) {
            text = node.text || '';
            for (let i = 0; i < text.length; i++) {
                if (currentPos >= from && currentPos < to) {
                    selectionText += text[i];
                }
                currentPos++;
            }
        } else if (node.type === 'hard_break') {
            if (currentPos >= from && currentPos < to) {
                selectionText += '\n';
            }
            currentPos += 1;
        } else {
            (node.content || []).forEach(selectNodeText);
            selectionText += '\n';
            currentPos += 2;
        }
    };

    (json.content || []).forEach(selectNodeText);

    return selectionText;
}
