import * as React from 'react';

export class ErrorBoundary extends React.Component<{children: JSX.Element}> {
    constructor(props: any) {
        super(props);
    }

    componentDidCatch(error: any, info: any) {
        console.log(error, info.componentStack);
    }

    render() {
        return this.props.children;
    }
}
