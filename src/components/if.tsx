import React from 'react';

interface IProps {
    condition: boolean | undefined | null;
    children: JSX.Element | JSX.Element[] | string;
}
export const If = (props: IProps) => {
    if (!props.condition) {
        return null;
    }
    return <>{props.children}</>;
};
