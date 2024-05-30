import * as React from 'react';
import { findClosestParent, KEY_NAME, KEY_CODE } from '../utils';

interface IProps {
    className: string;
    children: JSX.Element | JSX.Element[];
    onEnterdown(time: number): void;
    onMouseDown?(e: React.MouseEvent): void;
}

export const TagWrapper = (props: IProps) => {
    const { className, children, onEnterdown } = props;
    const eleRef = React.useRef<HTMLSpanElement>(null);

    React.useEffect(() => {
        let editContainer: HTMLElement | null = null;

        const downHandle = (e: KeyboardEvent) => {
            const keyCode = e.which || e.keyCode;
            const isEnter = e.key === KEY_NAME.KEY_ENTER || keyCode === KEY_CODE.KEY_ENTER;
            if (isEnter) {
                onEnterdown(Date.now());
            }
        };

        const delay = setTimeout(() => {
            editContainer = findClosestParent(eleRef.current as HTMLSpanElement, 'ssml-marker-editor') as HTMLElement;
            editContainer && editContainer.addEventListener('keydown', downHandle);
        }, 30);

        return () => {
            clearTimeout(delay);
            editContainer && editContainer.removeEventListener('keydown', downHandle);
        };
    }, []);

    const onMouseDown = (e: React.MouseEvent) => {
        props.onMouseDown && props.onMouseDown(e);
        e.preventDefault();
        return false;
    };

    return (
        <span className={className} onMouseDown={onMouseDown} ref={eleRef}>
            {children}
        </span>
    );
};
