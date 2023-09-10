import React from 'react';

const ToolBarWrap = ({children, className = ''}: {children: JSX.Element | JSX.Element[]; className?: string}) => {
    return (
        <div className={`ssml-tag-editor__toolbars ${className}`} onMouseDown={(e) => {e.preventDefault();return false;}}>
            {children}
        </div>
    );
};

export default ToolBarWrap;