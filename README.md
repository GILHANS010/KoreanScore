**KoreanScore**

**A Web Application for Building Jeongganbo (Korean Traditional Sheet Music) Notation**

KoreanScore simplifies the creation of Jeongganbo notation for Korean traditional music. Musicians no longer need to resort to manual table creation and symbol conversion in Microsoft Word or Hangul. This web app offers a user-friendly interface that allows you to:

- **Compose directly in Jeongganbo format:** Enter Jeongganbo music notes like "황대태협고중유임이남무응" (representing musical notes), and KoreanScore automatically converts them into the corresponding Chinese symbols.
- **Advanced Features:**
    - **Octaves:**
        - Use `;` for one octave up (adds "氵")
        - Use `;;` for two octaves up (adds "氵氵")
        - Use `/` for one octave down (adds "亻")
        - Use `//` for two octaves down (adds "亻亻")
    - **Rests and Ties:**
        - Use `ㅅ` for rest
        - Use `` for tie
    - **Multiple Symbols per Cell:**
        - Combine characters within a single cell for complex notations.
- **Customization:**
    - **Grid Dimensions:** Set the number of rows ("정") and columns ("각") using the grid settings.
    - **Beats per Bar:** Adjust the "강" value to define the number of beats in each bar.
- **Export and Save:**
    - **Download as PNG:** Generate a high-resolution image of your Jeongganbo score.
    - **Convert to Korean:** Switch from the Chinese symbol view back to the original Korean characters.
    - **(Optional) Save Jeongganbo:** (Functionality to be implemented) Save your Jeongganbo score in a structured format for future use.

**Getting Started**

1. **Clone the Repository:**
    
    **Bash**
    
    `git clone https://github.com/<GILHANS010>/KoreanScore.git`
    
2. **Install Dependencies:**
    
    **Bash**
    
    `cd KoreanScore
    npm install`
    
3. **Run the Development Server:**This will start the application at http://localhost:3000 by default.
    
    **Bash**
    
    `npm start`
    

**How it Works**

KoreanScore leverages React.js to create a dynamic user interface. Here's a breakdown of the key components:

- **`JeongganboEditor` Component:** This core component manages the grid, handles user interactions, and performs note conversions.
    - **`notesData` State:** Stores the current state of the Jeongganbo grid, represented as a 2D array of notes.
    - **`gridDimensions` State:** Tracks the dimensions (rows and columns) of the grid.
    - **`beatsPerBar` State:** Defines the number of beats per bar.
    - **Conversion Functions:**
        - `convertNotes`: Converts user-entered Korean notes into the corresponding Chinese symbols with octave adjustments.
        - `convertToOctave`: Handles octave modifications by extracting modifiers and characters from the entered notes.
        - `convertBackToKorean` (Optional): Converts Chinese symbols back to Korean characters (future implementation).
    - **Cell Handling Functions:**
        - `handleCellFocus`: Manages focus movement between cells using arrow keys.
        - `handleKeyDown`: Handles Tab key press for cell conversion and focus movement.
        - `handleCellEdit`: Updates the `notesData` state with the edited content of a cell.
- **UI Elements:**
    - **Menu Bar:** Provides controls for grid size, beats per bar, reset grid, conversion, saving (future), and downloading as PNG.
    - **Score Area:** Displays the Jeongganbo grid with editable cells.
    - **Title:** (Optional) Editable title field for the Jeongganbo score.

**Development**

Feel free to fork the repository and contribute your enhancements. To make code changes:

1. Clone the repository as described above.
2. Install dependencies (`npm install`).
3. Make modifications to the source code in the `src` directory.
4. Run the development server (`npm start`) to see your changes reflected.

**Additional Notes**

- The `dangerouslySetInnerHTML` property is used with caution to prevent potential security risks.
- Consider implementing a linter and code formatter for improved code quality and maintainability.
- Explore unit testing to ensure the application's robustness.

We hope KoreanScore empowers you to create Jeongganbo notation with ease!
