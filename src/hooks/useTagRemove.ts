import * as React from 'react';
const useEffect = React.useEffect;
import { debounce } from '../utils';
import { IReactNodeProps } from '../types';

export const useTagRemove = (props: IReactNodeProps, getEnterdownTime: () => number) => {
    useEffect(() => {
        let pos = 0;
        let hasSelection = false;

        setTimeout(() => {
            // 等 nodeView 渲染挂载完毕再更新 pos
            pos = props.getPos();
        }, 35);

        const listen = debounce(() => {
            const { from, to } = props.editor.state.selection;
            pos = props.getPos() || pos;
            hasSelection = from !== to;
        }, 100);

        const editor = props.editor;
        const text = props.node.attrs.text;
        editor.on('selectionUpdate', listen);
        return () => {
            const { from } = props.editor.state.selection;
            props.editor.off('selectionUpdate', listen);
            setTimeout(() => {
                const now = Date.now();
                const deleteFromEnterDown = now - getEnterdownTime() < 100;
                const onlyDeleteTag = !deleteFromEnterDown && !hasSelection && from === pos;
                onlyDeleteTag && props.editor.chain().focus(pos).insertContent(`${text}`).run();
            }, 35);
        };
    }, []);
};
