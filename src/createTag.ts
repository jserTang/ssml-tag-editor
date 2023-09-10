import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { Command } from '@tiptap/core';
import { IReactNodeProps } from './types';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        customExtension: {
            [key: string]: ((text: string, attrs: Record<string, string>) => Command) | undefined;
        };
    }
}

interface IAttributes {
    [key: string]: {
        default: string;
    };
}

interface ICreatorConfig<T extends Record<string, string>> {
    attributes: IAttributes;
    commands: {
        [key: string]: ((text: string, attrs: T) => Command) | undefined;
    };
}

type NodeComponent = (props: IReactNodeProps) => JSX.Element;

export function createTag<T extends Record<string, string>>(
    tagName: string,
    config: ICreatorConfig<T>,
    nodeComponent: NodeComponent,
) {
    const { attributes, commands } = config;

    return Node.create({
        name: tagName,
        inline: true,
        group: 'inline',

        atom: true,
        selectable: true,

        addAttributes() {
            return {
                text: {
                    default: '',
                },
                ...attributes,
            };
        },

        parseHTML() {
            return [
                {
                    tag: tagName,
                    getAttrs: (element) => {
                        const ele = element as HTMLElement;
                        return ele.hasAttribute('text') ? {} : false;
                    },
                },
            ];
        },

        renderHTML(data) {
            const { HTMLAttributes } = data;
            return [tagName, mergeAttributes(HTMLAttributes), `${HTMLAttributes.text}`];
        },

        renderText({ node }) {
            return `${node.attrs.text || ''}`;
        },

        addNodeView() {
            return ReactNodeViewRenderer(nodeComponent);
        },

        addCommands() {
            return commands as {
                setNumberInterpret: ((text: string, attrs: Record<string, string>) => Command) | undefined;
                setPhoneme: ((text: string, attrs: Record<string, string>) => Command) | undefined;
                setSub: ((text: string, attrs: Record<string, string>) => Command) | undefined;
                setBreakTime: ((time?: string) => Command) | undefined;
                [key: string]: ((text: string, attrs: Record<string, string>) => Command) | undefined;
            };
        },
    });
}
