import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import html2canvas from 'html2canvas';

const noteConversion = {
    '황': { chinese: '黃', western: 'Eb' },
    '대': { chinese: '大', western: 'E' },
    '태': { chinese: '太', western: 'F' },
    '협': { chinese: '夾', western: 'Gb' },
    '고': { chinese: '姑', western: 'G' },
    '중': { chinese: '仲', western: 'Ab' },
    '유': { chinese: '蕤', western: 'A' },
    '임': { chinese: '林', western: 'Bb' },
    '이': { chinese: '夷', western: 'B' },
    '남': { chinese: '南', western: 'C' },
    '무': { chinese: '無', western: 'Db' },
    '응': { chinese: '應', western: 'D' },
    '^': { chinese: '△', western: 'rest' },
    '-': { chinese: '─', western: 'tie' },
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
    const [gridDimensions, setGridDimensions] = useState({
        columns: 8,
        rows: 12
    });

    const [notesData, setNotesData] = useState(Array.from({
        length: gridDimensions.rows
    }, () => new Array(gridDimensions.columns).fill('')));
    const [beatsPerBar, setBeatsPerBar] = useState(4);
    const [songTitle, setSongTitle] = useState("제목");

    const columnsInputRef = useRef(null);

    useEffect(() => {
        if (columnsInputRef.current) {
            columnsInputRef.current.focus();
        }
    }, []);

    const handleTitleChange = (e) => {
        setSongTitle(e.target.innerText);
    };

    const updateGridDimensions = (columns, rows) => {
        setGridDimensions({
            columns,
            rows
        });
        setNotesData(Array.from({
            length: rows
        }, () => new Array(columns).fill('')));
    };

    const handleCellFocus = (row, column, direction) => {
        // Calculate next focusable cell based on current row and column
        let nextRow = direction === 'down' ? row + 1 : row - 1;
        let nextColumn = column;

        // If moving beyond the current column's rows, wrap to the next or previous column
        if (nextRow >= gridDimensions.rows) {
            nextRow = 0; // Wrap to the top of the next column
            nextColumn = column + 1 >= gridDimensions.columns ? 0 : column + 1; // Move to the next column or wrap to the first column
        } else if (nextRow < 0) {
            nextRow = gridDimensions.rows - 1; // Wrap to the bottom of the previous column
            nextColumn = column - 1 < 0 ? gridDimensions.columns - 1 : column - 1; // Move to the previous column or wrap to the last column
        }

        // Focus the next cell
        const nextCell = document.querySelector(`[data-row="${nextRow}"][data-column="${nextColumn}"]`);
        if (nextCell) {
            nextCell.focus();
        }
    };

    const handleKeyDown = async (e, row, column) => {
        if (e.key === 'Tab') {
            e.preventDefault();

            // Perform conversion immediately before moving focus.
            const currentCell = notesData[row][column];
            const convertedNote = convertNotes(currentCell); // Ensure this is synchronous.

            // Apply the converted note to the current cell's state.
            const updatedNotesData = notesData.map((rowData, rowIndex) =>
                rowIndex === row ?
                rowData.map((cell, colIndex) =>
                    colIndex === column ? convertedNote : cell) :
                rowData
            );

            await setNotesData(updatedNotesData);

            // Calculate and set the next focus cell after state update.
            setTimeout(() => {
                const direction = e.shiftKey ? 'up' : 'down';
                handleCellFocus(row, column, direction);
            }, 0);
        }
    };

    const handleCellEdit = (row, column, note) => {
        let newNotesData = [...notesData];
        // Convert newline characters to <br> tags to preserve user-entered formatting
        const formattedNote = note.replace(/\n/g, '<br>');
        const convertedNote = convertNotes(formattedNote);
        newNotesData[row][column] = convertedNote;
        setNotesData(newNotesData);
    };

    const convertNotes = (notes) => {
        // Splitting on each character that is not a modifier, keeping the modifiers with the character
        let splitNotes = notes.match(/([;/]*[\S])/g) || [];
        return splitNotes.map(note => convertToOctave(note)).join('');
    };

    const convertToOctave = (note) => {
        let [modifiers, character] = note.split(/([;/]*)(.)/).slice(1, 3);
        const baseNote = noteConversion[character]?.chinese || character;
        // const baseNote = noteConversion[character]?.western || character;
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

    const transposeArray = (array) => {
        return array[0].map((_, colIndex) => array.map(row => row[colIndex]));
    };

    const revertTransposeArray = (array) => {
        return array[0].map((_, rowIndex) => array.map(column => column[rowIndex]));
    };

    const saveToFile = () => {
        const transposedNotesData = transposeArray(notesData);
        const data = {
            gridDimensions,
            notesData: transposedNotesData,
            beatsPerBar,
            songTitle,
        };
        const json = JSON.stringify(data);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${songTitle.replace(/\s+/g, '_')}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const loadFromFile = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = JSON.parse(e.target.result);
                const revertedNotesData = revertTransposeArray(data.notesData);
                setGridDimensions(data.gridDimensions);
                setNotesData(revertedNotesData);
                setBeatsPerBar(data.beatsPerBar);
                setSongTitle(data.songTitle);
            };
            reader.readAsText(file);
        }
    };

    // Dynamically calculate the editor container width based on the number of columns
    const editorContainerStyle = {
        gridTemplateColumns: `repeat(${gridDimensions.columns}, 1fr)`,
        width: `${gridDimensions.columns * 120}px`, // Adjusted for simplicity
    };

    const downloadAsImage = async () => {
        const captureArea = document.getElementById('score-container');
        const canvas = await html2canvas(captureArea);
        const padding = 50; // Adjust the padding value as needed

        // Create a new canvas with the desired padding
        const newCanvas = document.createElement('canvas');
        newCanvas.width = canvas.width + padding * 2;
        newCanvas.height = canvas.height + padding * 2;
        const context = newCanvas.getContext('2d');

        // Fill the new canvas with white color (optional)
        context.fillStyle = '#fff';
        context.fillRect(0, 0, newCanvas.width, newCanvas.height);

        // Draw the captured canvas onto the new canvas with padding
        context.drawImage(canvas, padding, padding);

        // Export the new canvas as an image
        const image = newCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `${songTitle.replace(/\s+/g, '_') + '_madeWithK-Score'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className='main-container'>
            <div className="menu-bar">
                <div className="input-group">
                    <label htmlFor="rowsInput">정:</label>
                    <input id="rowsInput" type="number" defaultValue={12} min="1" onChange={(e) => updateGridDimensions(gridDimensions.columns, parseInt(e.target.value, 10))} />
                </div>
                <div className="input-group">
                    <label htmlFor="columnsInput">각:</label>
                    <input id="columnsInput" type="number" defaultValue={8} min="1" onChange={(e) => updateGridDimensions(parseInt(e.target.value, 10), gridDimensions.rows)} ref={columnsInputRef} />
                </div>
                <div className="input-group">
                    <label htmlFor="barInput">강:</label>
                    <input id="barInput" type="number" defaultValue={beatsPerBar} onChange={(e) => setBeatsPerBar(parseInt(e.target.value, 10))} />
                </div>
                <button onClick={() => updateGridDimensions(8, 12)}>Reset Grid</button>
                <button onClick={saveToFile}>Save Jeongganbo</button>
                <div className="file-input-wrapper">
                    <label className="file-input-label" htmlFor="fileInput">Choose File</label>
                    <input id="fileInput" type="file" accept="application/json" onChange={loadFromFile} />
                </div>
                <button onClick={downloadAsImage}>Download as PNG</button>
            </div>

            <div id="score-container">
                <div
                    className="title"
                    contentEditable
                    onBlur={handleTitleChange}
                    suppressContentEditableWarning={true} // To avoid console warning
                >
                    {songTitle}
                </div>

                <div id="editor-container" style={editorContainerStyle}>
                    {notesData.map((row, rowIndex) => (
                        <React.Fragment key={rowIndex}>
                            {row.map((cell, columnIndex) => (
                                <div
                                    key={`${rowIndex}-${columnIndex}`}
                                    className="jeonggan"
                                    contentEditable
                                    onBlur={(e) => handleCellEdit(rowIndex, columnIndex, e.target.innerText)}
                                    onKeyDown={(e) => handleKeyDown(e, rowIndex, columnIndex)}
                                    data-row={rowIndex}
                                    data-column={columnIndex}
                                    tabIndex={0} // Make the div focusable
                                    dangerouslySetInnerHTML={{ __html: notesData[rowIndex][columnIndex] }}>
                                </div>
                            ))}
                            {(rowIndex + 1) % beatsPerBar === 0 && rowIndex !== notesData.length - 1 && (
                                <div className="row-separator"></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default JeongganboEditor;
