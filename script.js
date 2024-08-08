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

let gridDimensions = { columns: 8, rows: 8 };
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
    document.getElementById('showInstructionsBtn').addEventListener('click', showInstructions);
    document.getElementById('colorPalette').addEventListener('change', changeColorPalette);

    // Modal functionality
    const modal = document.getElementById('instructionModal');
    const span = document.getElementsByClassName('close')[0];

    span.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

function showInstructions() {
    const modal = document.getElementById('instructionModal');
    modal.style.display = 'block';
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
    gridDimensions = { columns: 8, rows: 8 };
    notesData = Array.from({ length: gridDimensions.rows }, () => new Array(gridDimensions.columns).fill(''));
    document.getElementById('rowsInput').value = 8;
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
const colorPalettes = {
    default: {
        backgroundColor: '#ffffff',
        borderColor: '#C5C6C7',
        hoverBackgroundColor: '#e0e0e0',
        hoverBorderColor: '#5a67d8',
        textColor: '#333',
        buttonBgColor: '#5a67d8',
        buttonHoverBgColor: '#434190',
        buttonTextColor: '#fff',
    },
    pastel: {
        backgroundColor: '#faf3e0',
        borderColor: '#f0c987',
        hoverBackgroundColor: '#f0e5c9',
        hoverBorderColor: '#e5a33f',
        textColor: '#5d4037',
        buttonBgColor: '#f0c987',
        buttonHoverBgColor: '#e5a33f',
        buttonTextColor: '#5d4037',
    },
    dark: {
        backgroundColor: '#333',
        borderColor: '#444',
        hoverBackgroundColor: '#555',
        hoverBorderColor: '#888',
        textColor: '#eee',
        buttonBgColor: '#444',
        buttonHoverBgColor: '#888',
        buttonTextColor: '#eee',
    },
    vibrant: {
        backgroundColor: '#fffae3',
        borderColor: '#ffcf44',
        hoverBackgroundColor: '#ffdc73',
        hoverBorderColor: '#ffb300',
        textColor: '#b74e00',
        buttonBgColor: '#ffcf44',
        buttonHoverBgColor: '#ffb300',
        buttonTextColor: '#b74e00',
    },
    ocean: {
        backgroundColor: '#e0f7fa',
        borderColor: '#00acc1',
        hoverBackgroundColor: '#b2ebf2',
        hoverBorderColor: '#00838f',
        textColor: '#006064',
        buttonBgColor: '#00acc1',
        buttonHoverBgColor: '#00838f',
        buttonTextColor: '#ffffff',
    },
    forest: {
        backgroundColor: '#e8f5e9',
        borderColor: '#66bb6a',
        hoverBackgroundColor: '#c8e6c9',
        hoverBorderColor: '#338a3e',
        textColor: '#1b5e20',
        buttonBgColor: '#66bb6a',
        buttonHoverBgColor: '#338a3e',
        buttonTextColor: '#ffffff',
    },
    sunset: {
        backgroundColor: '#fff3e0',
        borderColor: '#ff8a65',
        hoverBackgroundColor: '#ffe0b2',
        hoverBorderColor: '#d84315',
        textColor: '#bf360c',
        buttonBgColor: '#ff8a65',
        buttonHoverBgColor: '#d84315',
        buttonTextColor: '#ffffff',
    },
};

function changeColorPalette(event) {
    const selectedPalette = colorPalettes[event.target.value];
    document.documentElement.style.setProperty('--bg-color', selectedPalette.backgroundColor);
    document.documentElement.style.setProperty('--border-color', selectedPalette.borderColor);
    document.documentElement.style.setProperty('--hover-bg-color', selectedPalette.hoverBackgroundColor);
    document.documentElement.style.setProperty('--hover-border-color', selectedPalette.hoverBorderColor);
    document.documentElement.style.setProperty('--text-color', selectedPalette.textColor);
    document.documentElement.style.setProperty('--button-bg-color', selectedPalette.buttonBgColor);
    document.documentElement.style.setProperty('--button-hover-bg-color', selectedPalette.buttonHoverBgColor);
    document.documentElement.style.setProperty('--button-text-color', selectedPalette.buttonTextColor);
    document.documentElement.style.setProperty('--input-text-color', selectedPalette.textColor);

    updateGrid(); // Apply the new colors to the existing grid
}

// CSS Variables applied via JavaScript
const css = `
:root {
    --bg-color: ${colorPalettes.default.backgroundColor};
    --border-color: ${colorPalettes.default.borderColor};
    --hover-bg-color: ${colorPalettes.default.hoverBackgroundColor};
    --hover-border-color: ${colorPalettes.default.hoverBorderColor};
    --text-color: ${colorPalettes.default.textColor};
    --button-bg-color: ${colorPalettes.default.buttonBgColor};
    --button-hover-bg-color: ${colorPalettes.default.buttonHoverBgColor};
    --button-text-color: ${colorPalettes.default.buttonTextColor};
    --input-text-color: var(--text-color);
}
body {
    font-family: 'Arial', sans-serif;
    background-color: #f0f0f0;
    margin: 0;
    padding: 20px;
}
.menu-bar {
    display: flex;
    justify-content: center;
    gap: 20px;
    padding: 10px 0;
    background-color: var(--bg-color);
    border-bottom: 2px solid var(--border-color);
    width: 100%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
#score-container {
    position: relative;
    margin: 40px;
    background-color: var(--bg-color);
    border: 1px solid var(--border-color);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.title {
    text-align: center;
    font-size: 32px;
    margin: 20px 0;
    font-weight: bold;
    color: var(--text-color);
}
label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    margin-right: 10px;
    color: var(--text-color);
}
.input-group {
    display: flex;
    align-items: center;
    gap: 10px;
}
input[type="number"], select, button {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    width: 60px; /* Unified width for input boxes */
    color: var(--input-text-color);
}
input[type="number"] {
    background-color: var(--bg-color);
}
select {
    background-color: var(--bg-color);
    color: var(--text-color);
}
button {
    background-color: var(--button-bg-color);
    color: var(--button-text-color);
    cursor: pointer;
    padding: 8px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    transition: background-color 0.3s, box-shadow 0.3s;
    width: 6rem;
}
button:hover {
    background-color: var(--button-hover-bg-color);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.main-container {
    background-color: var(--bg-color);
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
#editor-container-wrapper {
    position: relative;
}
#editor-container {
    display: grid;
    justify-content: start;
    direction: rtl;
    border: 2.4px solid var(--border-color);
    margin: 20px auto;
    padding: 0 40px 0 0;
    grid-gap: 0; /* Remove gap between jeonggan cells */
}
.jeonggan {
    position: relative;
    border: 1px solid var(--border-color);
    width: 72px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: text;
    flex-direction: column;
    text-align: center;
    font-size: 20px;
    background-color: var(--bg-color);
    color: var(--text-color);
    direction: ltr;
    transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    border-radius: 4px; /* Rounded corners */
}
.jeonggan:hover {
    background-color: var(--hover-bg-color);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-color: var(--hover-border-color);
}
input[type="file"] {
    display: none;
}
.row-separator {
    grid-column: 1 / -1;
    height: 8px;
    border: 1.8px solid var(--border-color); /* Lighten the separator color */
    width: calc(100% + 40px); /* Added to fit width including padding */
    transform: translateX(40px); /* Align to left edge of container */
    box-sizing: border-box;
}
@media (max-width: 768px) {
    #editor-container {
        width: 100%;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }
}
/* Modal Styles */
.modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}
.modal-content {
    background-color: #fff;
    margin: 15% auto; /* 15% from the top and centered */
    padding: 20px;
    border: 1px solid #888;
    width: 80%; /* Could be more or less, depending on screen size */
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}
.close:hover,
.close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}
table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
}
table, th, td {
    border: 1px solid var(--border-color);
}
th, td {
    padding: 8px;
    text-align: center;
    color: var(--text-color);
}
th {
    background-color: var(--bg-color);
}
`;

document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
document.addEventListener('DOMContentLoaded', initializeEditor);
