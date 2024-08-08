# Jeongganbo Editor

Jeongganbo Editor is an innovative web-based tool designed for musicians, musicologists, and enthusiasts of traditional Korean music. This application facilitates the creation, editing, and visualization of Jeongganbo notations, bridging the gap between historical music practices and modern digital tools.

## Features

### Dynamic Grid Layout
- **Customizable Dimensions**: Adjust the number of rows and columns to fit the specific needs of your composition.
- **Flexible Beats per Bar**: Define the number of beats per bar to match the rhythmical structure of the piece.

### Content Editable Cells
- **Direct Editing**: Click on any cell to input and edit Jeongganbo notations directly.
- **Tab Navigation**: Use the Tab key to seamlessly navigate between cells for efficient editing.

### Demo Page
- **Demo Web App Link**: https://gilhans010.github.io/KoreanScore/

### Note Conversion
- **Korean to Chinese and Western Notations**: Automatically convert Korean notes to their corresponding Chinese characters or Western notations using a pre-defined conversion table.
- **Octave Mapping**: Map notes to different octaves using specific modifiers.

### Save and Load Functionality
- **JSON File Support**: Save your Jeongganbo notations as a JSON file for future use or further editing.
- **Load Previous Work**: Load saved JSON files back into the editor to continue working on your compositions.

### Export as PNG
- **Visual Representation**: Download the Jeongganbo notation as a PNG image for easy sharing and printing.

## Getting Started

### Prerequisites
- A modern web browser (e.g., Chrome, Firefox, Safari)

### Installation
1. Clone the repository to your local machine:
    ```sh
    git clone https://github.com/your-username/jeongganbo-editor.git
    cd jeongganbo-editor
    ```
2. Open `index.html` in your web browser to start using the editor.

### Usage

#### Configuring the Grid
1. **Rows (정)**: Set the number of rows for your grid by adjusting the value in the input field labeled "정".
2. **Columns (각)**: Define the number of columns using the "각" input field.
3. **Beats per Bar (강)**: Specify the number of beats per bar in the "강" input field.

#### Editor Buttons
- **Reset Grid**: Click to reset the grid to its default dimensions (8 columns, 12 rows, 4 beats per bar).
- **Save Jeongganbo**: Save your current notation as a JSON file by clicking this button.
- **Choose File**: Load a previously saved JSON file into the editor.
- **Download as PNG**: Export the current Jeongganbo notation as a PNG image.

#### Editing the Notation
1. **Input Notation**: Click on any cell to enter a Korean note.
2. **Automatic Conversion**: The editor will convert the Korean note to its Chinese character or Western notation equivalent.
3. **Navigate with Tab**: Use the Tab key to move between cells for quick and efficient editing.

### Note Conversion Tables

#### Note Conversion
The editor uses the following conversion table for notes:

| Korean | Chinese | Western |
|--------|---------|---------|
| 황     | 黃       | Eb      |
| 대     | 大       | E       |
| 태     | 太       | F       |
| 협     | 夾       | Gb      |
| 고     | 姑       | G       |
| 중     | 仲       | Ab      |
| 유     | 蕤       | A       |
| 임     | 林       | Bb      |
| 이     | 夷       | B       |
| 남     | 南       | C       |
| 무     | 無       | Db      |
| 응     | 應       | D       |
| ^      | △       | rest    |
| -      | ─       | tie     |

#### Octave Mapping
Octave mapping is done using the following table:

| Korean | Octaves                           |
|--------|-----------------------------------|
| 황     | 㣴, 僙, 黃, 潢, 㶂                 |
| 대     | 㣕, 㐲, 大, 汏, 㳲                 |
| 태     | 㣖, 㑀, 太, 汰, 㳲                 |
| 협     | 㣣, 俠, 夾, 浹, 㴺                 |
| 고     | 㣨, 㑬, 姑, 㴌, 㵈                 |
| 중     | 㣡, 㑖, 仲, 㳞, 㴢                 |
| 유     | 㣸, 㣸, 㽔, 㶋, 㶙                 |
| 임     | 㣩, 㑣, 林, 淋, 㵉                 |
| 이     | 侇, 侇, 夷, 洟, 㴣                 |
| 남     | 㣮, 㑲, 南, 湳, 㵜                 |
| 무     | 㣳, 㒇, 無, 潕, 㶃                 |
| 응     | 㣹, 㒣, 應, 㶐, 㶝                 |

## Development

### Code Structure

- **index.html**: The main HTML file containing the structure of the editor.
- **styles.css**: The CSS file for styling the editor interface.
- **script.js**: The JavaScript file containing the logic for grid manipulation, note conversion, and file operations.

### Contributing

We welcome contributions to improve the Jeongganbo Editor. To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

### Issues

If you encounter any issues or have suggestions for improvements, please open an issue in the repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [html2canvas](https://html2canvas.hertzen.com/) for rendering the Jeongganbo notation as a PNG image.
- Traditional Korean music scholars and enthusiasts who inspired the creation of this tool.

## Contact

For any inquiries or feedback, please contact [kimgilhans@gmail.com]
