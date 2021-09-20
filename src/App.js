import React, { useEffect, useRef, useState } from "react";
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
    const [completedWords, setCompletedWords] = useState([]);
    const [word, setWord] = useState('');
    const containerRef = useRef(null);

    useEffect(() => {
        setWord(getRandomWord());
        if (containerRef) containerRef.current.focus();
    }, []);

    useEffect(() => {
        const wordFromValidKeys = validKeys.join(''); //transforma o validKeys em uma palavra
        let timeout = null;

        if (word && word === wordFromValidKeys) {
            //adicionar word ao completedWord
            //limpar o array validKeys
            //buscar uma nova palavra que não esteja no completedWord
            timeout = setTimeout(() => {
                setCompletedWords((prev) => [...prev, word]);
                let newWord = null;
                do {
                    newWord = getRandomWord();
                } while (completedWords.includes(newWord));

                setValidKeys([]);
                setWord(newWord);

            }, 600) //meio segundo

        }

        return (() => {
            if (timeout) clearTimeout(timeout);
        })
    }, [word, validKeys, completedWords]);


    const handleKeyDown = (e) => {
        e.preventDefault();

        let key = null; //desestruturando com {key} = e  ou se não usar key =e.key
        if (e.key !== 'NumLock') key = e.key;

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

        const matchedClass = (joineKeys === word) ? 'matched completed' : 'matched';

        return (
            <>
                <span className={matchedClass}>{matched} </span>
                <span className="remainder"> {remainder}</span>
            </>
        );
    }

    return (<div className="container" tabIndex="0" onKeyDown={handleKeyDown} ref={containerRef}>
        <div className="valid-keys">
            <Word word={word} validKeys={validKeys} />
        </div>

        <div className="typed-keys">
            {typedKeys ? typedKeys.join(' ') : null}
        </div>

        <div className="completed-words">
            <ol>
                {completedWords.map((x) => (<li key={x}>{x}</li>))}
            </ol>
        </div>

    </div>);
}

export default App;