import './app.scss';
import { createRoot } from 'react-dom/client';
import * as React from 'react';
const { useRef, useState } = React;
import SSMLTagEditor, { ToolBarWrap, IEditorHandler } from '../src/index';

const APP = () => {
    const editorHandler = useRef<IEditorHandler>(null);
    const [ssml, setSSML] = useState('');

    const addNumberInterpret = () => {
        editorHandler.current?.addNumberInterpret();
    };
    const addBreak = () => {
        editorHandler.current?.addBreak({ time: '0.5s' });
    };
    const addSub = () => {
        editorHandler.current?.addSub();
    };
    const addPhoneme = () => {
        editorHandler.current?.addPhoneme();
    };
    const exportSSML = () => {
        setSSML(editorHandler.current?.export().ssml);
    };

    return (
        <div className="ssml-tag-editor-demo">
            <ToolBarWrap className="ssml-tag-editor-demo__tools">
                <button onClick={addNumberInterpret} className="menu-number">
                    <div>add number interpret</div>
                    <div>标注数字读法</div>
                </button>
                <button onClick={addBreak} className="menu-break">
                    <div>add break</div>
                    <div>添加停顿</div>
                </button>
                <button onClick={addSub} className="menu-sub">
                    <div>add sub</div>
                    <div>文字替换</div>
                </button>
                <button onClick={addPhoneme} className="menu-ph">
                    <div>add phoneme</div>
                    <div>标注读音</div>
                </button>
            </ToolBarWrap>

            <SSMLTagEditor
                ref={editorHandler}
                defaultContent="In 2023, generative AI grand models have helped me a lot in my work"
                placeholder="Type your text here"
            />

            <button onClick={exportSSML}>Export SSML</button>

            <div className="ssml-tag-editor-demo__result">
                {ssml}
            </div>
        </div>
    );
};

const root = createRoot(document.querySelector('#root'));

root.render(<APP/>);
