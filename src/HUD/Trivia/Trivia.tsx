import './trivia.scss';
import { useAction, useConfig } from '../../API/contexts/actions';
import React, { useState } from 'react';

const Trivia = () => {
    const [ show, setShow ] = useState(false);
    
    const data = useConfig('trivia');

    useAction('triviaState', (state) => {
        setShow(state === "show");
    });

    useAction('toggleCams', () => {
        setShow(p => !p);
    });

    return (
        <div className={`trivia_container ${show ? 'show': 'hide'}`}>
            <div className="title">{data?.title}</div>
            <div className="content">{data?.content}</div>
        </div>
    );
}

export default React.memo(Trivia);
