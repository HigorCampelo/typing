import React, { useEffect, useState } from "react";
import wordList from "./resources/words.json";


const MAX_TYPED_KEYS = 30;

const getRandomWord = () => {
    const index = Math.floor(Math.random() * wordList.length);
    const word = wordList[index];
    return word; //Math.floor arredonda para baixo
}

const App = () => {

    const [typedKeys, setTypedKeys] = useState([]);
    const [validKeys, setValidKeys] = useState([]);
    const [word, setWord] = useState('');

    useEffect(() => {
        setWord(getRandomWord());
    }, []);


    const handleKeyDown = (e) => {
        e.preventDefault();
        const { key } = e; //desestruturando com {} se não usar key =e.key
        setTypedKeys((prev) => [...prev, key].slice(MAX_TYPED_KEYS * -1));
        //slice(-30) faz com que apareça apenas 30 caracteres na tela

        if (isValidKey(key, word)) {
            setValidKeys((prev) => {
                const isValidLenght = prev.length <= word.length;
                const isNextChar = isValidLenght && word[prev.length] === key;

                /*console.log('prevValidKey', prev, prev.length);
                console.log('word', word);
                console.log('isNextChar', isNextChar, key);*/

                return isNextChar ? [...prev, key] : prev;
            });
        }

    }

    const isValidKey = (key, word) => {
        if (!word) return false;
        const result = word.split('').includes(key);
        return result;
    }

    const Word = ({ word, validKeys }) => {
        if (!word) return null;

        const joineKeys = validKeys.join('');
        const matched = word.slice(0, joineKeys.length);
        const remainder = word.slice(joineKeys.length);

        return (
            <>
                <span className="matched">{matched} </span>
                <span className="remainder"> {remainder}</span>
            </>
        );
    }

    return (<div className="container" tabIndex="0" onKeyDown={handleKeyDown}>
        <div className="valid-keys">
            <Word word={word} validKeys={validKeys} />
        </div>

        <div className="typed-keys">
            {typedKeys ? typedKeys.join(' ') : null}
        </div>

        <div className="completed-words">
            <ol>
                <li>cidade</li>
                <li>carro</li>
                <li>profissional</li>
            </ol>
        </div>

    </div>);
}

export default App;