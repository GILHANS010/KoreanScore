import React, {
    useState,
    useRef,
    useEffect
} from 'react';
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
        const defaultGridDimensions = {
            columns: 8,
            rows: 12
        };
        const [gridDimensions, setGridDimensions] = useState(defaultGridDimensions);
        const [notesData, setNotesData] = useState(Array.from({
                length: gridDimensions.rows
            }, () =>
            new Array(gridDimensions.columns).fill('')));

        const columnsInputRef = useRef(null);

        useEffect(() => {
            columnsInputRef.current.focus();
        }, []);

        const updateGridDimensions = (columns, rows) => {
            setGridDimensions({
                columns,
                rows
            });
            setNotesData(Array.from({
                length: rows
            }, () => new Array(columns).fill('')));
        };

const handleCellEdit = (row, column, note) => {
    let newNotesData = [...notesData];
    const convertedNote = convertNotes(note); // Convert the note to symbols
    newNotesData[row][column] = convertedNote; // Store symbols directly
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
                case '':
                    return 2;
                case ';':
                    return 3;
                case ';;':
                    return 4;
                case '/':
                    return 1; 
                case '//':
                    return 0;
                default:
                    return 2; 
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
                            // Convert cell note symbols to HTML here before rendering
                            <div key={`${rowIndex}-${columnIndex}`} 
                                className="jeonggan" 
                                contentEditable 
                                onBlur={(e) => handleCellEdit(rowIndex, columnIndex, e.target.innerText)} 
                                dangerouslySetInnerHTML={{ __html: cell.split('').map(char => `<div class="jeonggan-note">${char}</div>`).join('') }} />
                        ))
                    )}
                </div>
            <button onClick={() => console.log(JSON.stringify(notesData))}>Save Jeongganbo</button>
        </div>
    );
};

export default JeongganboEditor;