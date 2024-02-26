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

const convertToOctave = (note) => {
    // Extracting modifiers and the character
    const [modifiers, character] = note.split(/([;/]*)(.)/).slice(1, 3);
    const baseNote = koreanToChinese[character] || character;
    const octaveIndex = getOctaveIndex(modifiers);
    const mappedCharacters = octaveMapping[character];
    return mappedCharacters && mappedCharacters[octaveIndex] ? mappedCharacters[octaveIndex] : baseNote;
};

const getOctaveIndex = (modifiers) => {
    const mapping = { '': 2, ';': 3, ';;': 4, '/': 1, '//': 0 };
    return mapping[modifiers] || 2;
};

const JeongganboEditor = () => {
    const initialDimensions = { columns: 8, rows: 12 };
    const [dimensions, setDimensions] = useState(initialDimensions);
    const [notesData, setNotesData] = useState(Array.from({ length: initialDimensions.rows }, () => new Array(initialDimensions.columns).fill('')));
    const [beatsPerBar, setBeatsPerBar] = useState(4);

    const columnsInputRef = useRef(null);

    useEffect(() => {
        columnsInputRef.current?.focus();
    }, []);

    const updateGridDimensions = (columns, rows) => {
        setDimensions({ columns, rows });
        setNotesData(Array.from({ length: rows }, () => new Array(columns).fill('')));
    };

    const handleCellEdit = (row, column, note) => {
        const newNotesData = notesData.map((rowData, rowIndex) => rowIndex === row ? rowData.map((cellData, columnIndex) => columnIndex === column ? convertToOctave(note) : cellData) : rowData);
        setNotesData(newNotesData);
    };

    return (
        <div>
            <div id="editor-container" style={{ gridTemplateColumns: `repeat(${dimensions.columns}, 1fr)`, width: `${dimensions.columns * 100}px` }}>
                {notesData.map((row, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                        {row.map((cell, columnIndex) => (
                            <div
                                key={`${rowIndex}-${columnIndex}`}
                                className="jeonggan"
                                contentEditable
                                onBlur={(e) => handleCellEdit(rowIndex, columnIndex, e.target.innerText)}
                                dangerouslySetInnerHTML={{ __html: cell.split('').map(char => `<div class="jeonggan-note">${char}</div>`).join('') }}>
                            </div>
                        ))}
                        {(rowIndex + 1) % beatsPerBar === 0 && rowIndex !== notesData.length - 1 && <div className="row-separator"></div>}
                    </React.Fragment>
                ))}
            </div>
            <div className="controls">
                <input
                    id="columnsInput"
                    type="number"
                    defaultValue={initialDimensions.columns}
                    min="1"
                    onChange={(e) => updateGridDimensions(parseInt(e.target.value, 10), dimensions.rows)}
                    ref={columnsInputRef}
                />
                <input
                    id="rowsInput"
                    type="number"
                    defaultValue={initialDimensions.rows}
                    min="1"
                    onChange={(e) => updateGridDimensions(dimensions.columns, parseInt(e.target.value, 10))}
                />
                <input
                    id="barInput"
                    type="number"
                    defaultValue={beatsPerBar}
                    onChange={(e) => setBeatsPerBar(parseInt(e.target.value, 10))}
                    placeholder="Beats per Bar"
                />
                <button onClick={() => updateGridDimensions(initialDimensions.columns, initialDimensions.rows)}>Reset Grid</button>
            </div>
        </div>
    );
};

export default JeongganboEditor;