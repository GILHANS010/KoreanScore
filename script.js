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

let gridDimensions = { columns: 8, rows: 12 };
let notesData = Array.from({ length: gridDimensions.rows }, () => new Array(gridDimensions.columns).fill(''));
let beatsPerBar = 4;
let songTitle = "제목";

function initializeEditor() {
    updateGrid();
    document.getElementById('rowsInput').addEventListener('change', handleRowsChange);
    document.getElementById('columnsInput').addEventListener('change', handleColumnsChange);
    document.getElementById('barInput').addEventListener('change', handleBarChange);
    document.getElementById('resetGridBtn').addEventListener('click', resetGrid);
    document.getElementById('saveBtn').addEventListener('click', saveToFile);
    document.getElementById('fileInput').addEventListener('change', loadFromFile);
    document.getElementById('downloadBtn').addEventListener('click', downloadAsImage);
    document.getElementById('songTitle').addEventListener('blur', handleTitleChange);
}

function updateGrid() {
    const editorContainer = document.getElementById('editor-container');
    editorContainer.innerHTML = '';
    editorContainer.style.gridTemplateColumns = `repeat(${gridDimensions.columns}, 1fr)`;
    editorContainer.style.width = `${gridDimensions.columns * 120}px`;

    for (let rowIndex = 0; rowIndex < gridDimensions.rows; rowIndex++) {
        for (let columnIndex = 0; columnIndex < gridDimensions.columns; columnIndex++) {
            const jeonggan = document.createElement('div');
            jeonggan.className = 'jeonggan';
            jeonggan.contentEditable = true;
            jeonggan.dataset.row = rowIndex;
            jeonggan.dataset.column = columnIndex;
            jeonggan.tabIndex = 0;
            jeonggan.innerHTML = notesData[rowIndex][columnIndex];
            jeonggan.addEventListener('blur', handleCellEdit);
            jeonggan.addEventListener('keydown', handleKeyDown);
            editorContainer.appendChild(jeonggan);
        }
        if ((rowIndex + 1) % beatsPerBar === 0 && rowIndex !== gridDimensions.rows - 1) {
            const separator = document.createElement('div');
            separator.className = 'row-separator';
            editorContainer.appendChild(separator);
        }
    }
}

function handleRowsChange(e) {
    gridDimensions.rows = parseInt(e.target.value, 10);
    notesData = Array.from({ length: gridDimensions.rows }, () => new Array(gridDimensions.columns).fill(''));
    updateGrid();
}

function handleColumnsChange(e) {
    gridDimensions.columns = parseInt(e.target.value, 10);
    notesData = notesData.map(() => new Array(gridDimensions.columns).fill(''));
    updateGrid();
}

function handleBarChange(e) {
    beatsPerBar = parseInt(e.target.value, 10);
    updateGrid();
}

function resetGrid() {
    gridDimensions = { columns: 8, rows: 12 };
    notesData = Array.from({ length: gridDimensions.rows }, () => new Array(gridDimensions.columns).fill(''));
    document.getElementById('rowsInput').value = 12;
    document.getElementById('columnsInput').value = 8;
    document.getElementById('barInput').value = 4;
    beatsPerBar = 4;
    updateGrid();
}

function handleTitleChange(e) {
    songTitle = e.target.innerText;
}

async function handleKeyDown(e) {
    if (e.key === 'Tab') {
        e.preventDefault(); // Prevent default tab behavior.

        const row = parseInt(e.target.dataset.row, 10);
        const column = parseInt(e.target.dataset.column, 10);

        // Perform conversion immediately before moving focus.
        const currentCell = notesData[row][column];
        const convertedNote = convertNotes(currentCell); // Ensure this is synchronous.

        // Apply the converted note to the current cell's state.
        const updatedNotesData = notesData.map((rowData, rowIndex) =>
            rowIndex === row
                ? rowData.map((cell, colIndex) =>
                    colIndex === column ? convertedNote : cell)
                : rowData
        );

        // Set the updated notes data with the converted note.
        notesData = updatedNotesData;

        // Calculate and set the next focus cell after state update.
        // setTimeout is used as a workaround for React's asynchronous state update.
        setTimeout(() => {
            const direction = e.shiftKey ? 'up' : 'down';
            handleCellFocus(row, column, direction);
        }, 0);
    }
}

function handleCellEdit(e) {
    const row = parseInt(e.target.dataset.row, 10);
    const column = parseInt(e.target.dataset.column, 10);

    // Clean up the HTML content
    const content = e.target.innerHTML
        .replace(/<div><br><\/div>/g, '\n') // Replace empty divs with newlines
        .replace(/<div>/g, '\n')           // Replace opening divs with newlines
        .replace(/<\/div>/g, '')           // Remove closing divs
        .replace(/<br>/g, '\n')            // Replace <br> tags with newlines
        .replace(/<[^>]*>/g, '');          // Remove all remaining HTML tags

    const formattedNote = content.replace(/\n/g, '<br>'); // Convert newlines to <br>
    const convertedNote = convertNotes(formattedNote);
    notesData[row][column] = convertedNote;
    e.target.innerHTML = convertedNote;
}

function handleCellFocus(row, column, direction) {
    let nextRow = direction === 'down' ? row + 1 : row - 1;
    let nextColumn = column;

    if (nextRow >= gridDimensions.rows) {
        nextRow = 0;
        nextColumn = column + 1 >= gridDimensions.columns ? 0 : column + 1;
    } else if (nextRow < 0) {
        nextRow = gridDimensions.rows - 1;
        nextColumn = column - 1 < 0 ? gridDimensions.columns - 1 : column - 1;
    }

    const nextCell = document.querySelector(`[data-row="${nextRow}"][data-column="${nextColumn}"]`);
    if (nextCell) {
        nextCell.focus();
    }
}

function convertNotes(notes) {
    let splitNotes = notes.match(/([;/]*[\S])/g) || [];
    return splitNotes.map(note => convertToOctave(note)).join('');
}

function convertToOctave(note) {
    let [modifiers, character] = note.split(/([;/]*)(.)/).slice(1, 3);
    const baseNote = noteConversion[character]?.chinese || character;
    const octaveIndex = getOctaveIndex(modifiers);
    const mappedCharacters = octaveMapping[character];
    return mappedCharacters && mappedCharacters[octaveIndex] ? mappedCharacters[octaveIndex] : baseNote;
}

function getOctaveIndex(modifiers) {
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
}

function saveToFile() {
    const data = {
        gridDimensions,
        notesData: transposeArray(notesData),
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
}

function loadFromFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = JSON.parse(e.target.result);
            gridDimensions = data.gridDimensions;
            notesData = revertTransposeArray(data.notesData);
            beatsPerBar = data.beatsPerBar;
            songTitle = data.songTitle;
            document.getElementById('rowsInput').value = gridDimensions.rows;
            document.getElementById('columnsInput').value = gridDimensions.columns;
            document.getElementById('barInput').value = beatsPerBar;
            document.getElementById('songTitle').innerText = songTitle;
            updateGrid();
        };
        reader.readAsText(file);
    }
}

function transposeArray(array) {
    return array[0].map((_, colIndex) => array.map(row => row[colIndex]));
}

function revertTransposeArray(array) {
    return array[0].map((_, rowIndex) => array.map(column => column[rowIndex]));
}

async function downloadAsImage() {
    const captureArea = document.getElementById('score-container');
    const canvas = await html2canvas(captureArea);
    const padding = 50;

    const newCanvas = document.createElement('canvas');
    newCanvas.width = canvas.width + padding * 2;
    newCanvas.height = canvas.height + padding * 2;
    const context = newCanvas.getContext('2d');

    context.fillStyle = '#fff';
    context.fillRect(0, 0, newCanvas.width, newCanvas.height);

    context.drawImage(canvas, padding, padding);

    const image = newCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `${songTitle.replace(/\s+/g, '_') + '_madeWithK-Score'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.addEventListener('DOMContentLoaded', initializeEditor);
