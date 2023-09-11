import './app.scss';
import { createRoot } from 'react-dom/client';
import React, { useRef, useState } from 'react';
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
        setSSML(editorHandler.current!.export().ssml);
    };

    return (
        <div className="ssml-tag-editor-demo">
            <ToolBarWrap className="ssml-tag-editor-demo__tools">
                <button onClick={addNumberInterpret}>
                    <div>add phoneme</div>
                    <div>标注数字读法</div>
                </button>
                <button onClick={addBreak}>
                    <div>add break</div>
                    <div>添加停顿</div>
                </button>
                <button onClick={addSub}>
                    <div>add sub</div>
                    <div>文字替换</div>
                </button>
                <button onClick={addPhoneme}>
                    <div>add phoneme</div>
                    <div>标注读音</div>
                </button>
            </ToolBarWrap>

            <SSMLTagEditor
                ref={editorHandler}
                defaultContent="2023 年，生成式 AI 大模型对我的工作给予了很大的帮助"
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
