import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const koreanToChinese = {
    '황': '黃',
    '대': '大',
    '태': '太',
    '협': '夾',
    '고': '姑',
    '중': '仲',
    '유': '蕤',
    '임': '林',
    '이': '夷',
    '남': '南',
    '무': '無',
    '응': '應'
};

const octaveMapping = {
    '황': ['㣴', '僙', '黃', '潢', '㶂'],
    '대': ['㣕', '㐲', '大', '汏', '㳲'],
    '태': ['㣖', '㑀', '太', '汰', '㳲'],
    '협': ['㣣', '俠', '夾', '浹', '㴺'],
    '고': ['㣨', '㑬', '姑', '㴌', '㵈'],
    '중': ['㣡', '㑖', '仲', '㳞', '㴢'],
    '유': ['㣸', '㣸', '㽔', '㶋', '㶙'],
    '임': ['㣩', '㑣', '林', '淋', '㵉'],
    '이': ['侇', '侇', '夷', '洟', '㴣'],
    '남': ['㣮', '㑲', '南', '湳', '㵜'],
    '무': ['㣳', '㒇', '無', '潕', '㶃'],
    '응': ['㣹', '㒣', '應', '㶐', '㶝']
};

const JeongganboEditor = () => {
    const defaultGridDimensions = { columns: 8, rows: 12 };
    const [gridDimensions, setGridDimensions] = useState(defaultGridDimensions);
    const [notesData, setNotesData] = useState(Array.from({ length: gridDimensions.rows }, () =>
        new Array(gridDimensions.columns).fill('')));

    const columnsInputRef = useRef(null);

    useEffect(() => {
        columnsInputRef.current.focus();
    }, []);

    const updateGridDimensions = (columns, rows) => {
        setGridDimensions({ columns, rows });
        setNotesData(Array.from({ length: rows }, () => new Array(columns).fill('')));
    };

    const handleCellEdit = (row, column, note) => {
        let newNotesData = [...notesData];
        newNotesData[row][column] = convertNotes(note);
        setNotesData(newNotesData);
    };

    const convertNotes = (notes) => {
        // Splitting on each character that is not a modifier, keeping the modifiers with the character
        let splitNotes = notes.match(/([;/]*[\S])/g) || [];
        return splitNotes.map(note => convertToOctave(note)).join('');
    };

    const convertToOctave = (note) => {
        // Extracting modifiers and the character
        let [modifiers, character] = note.split(/([;/]*)(.)/).slice(1, 3);
        const baseNote = koreanToChinese[character] || character;
        const octaveIndex = getOctaveIndex(modifiers);
        const mappedCharacters = octaveMapping[character];
        return mappedCharacters && mappedCharacters[octaveIndex] ? mappedCharacters[octaveIndex] : baseNote;
    };

    const getOctaveIndex = (modifiers) => {
        switch (modifiers) {
            case '': return 2; // Default (no modifier)
            case ';': return 3; // One octave higher
            case ';;': return 4; // Two octaves higher
            case '/': return 1; // One octave lower
            case '//': return 0; // Two octaves lower
            default: return 2; // Fallback to default if unrecognized
        }
    };

    return (
        <div>
            <input id="columnsInput" type="number" defaultValue={8} min="1" onChange={(e) => updateGridDimensions(parseInt(e.target.value, 10), gridDimensions.rows)} ref={columnsInputRef} />
            <input id="rowsInput" type="number" defaultValue={12} min="1" onChange={(e) => updateGridDimensions(gridDimensions.columns, parseInt(e.target.value, 10))} />
            <button onClick={() => updateGridDimensions(8, 12)}>Reset Grid</button>
            <div id="editor-container" style={{ gridTemplateColumns: `repeat(${gridDimensions.columns}, 1fr)` }}>
                {notesData.map((row, rowIndex) =>
                    row.map((cell, columnIndex) => (
                        <div key={`${rowIndex}-${columnIndex}`} className="jeonggan" contentEditable onBlur={(e) => handleCellEdit(rowIndex, columnIndex, e.target.innerText)} dangerouslySetInnerHTML={{ __html: cell }} />
                    ))
                )}
            </div>
            <button onClick={() => console.log(JSON.stringify(notesData))}>Save Jeongganbo</button>
        </div>
    );
};

export default JeongganboEditor;
