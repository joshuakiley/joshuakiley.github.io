// --- DOM Element Reference ---
const terminalDiv = document.getElementById('terminal');

// --- Configuration (Adjust as needed) ---
// File Paths
const INTRO_FILE_PATH = "text/lines.txt"; // Changed from "lines.txt"
const SUMMARY_FILE_PATH = "text/summary.txt"; // Changed from "summary.txt"
const EDUCATION_FILE_PATH = "text/education.txt"; // Changed from "education.txt"
const WORK_FILE_PATH = "text/work.txt"; // Changed from "work.txt"
const SKILLS_FILE_PATH = "text/skills.txt"; // Changed from "skills.txt"
// Delays, Prompt, etc. (keep existing vars like MIN_CHAR_DELAY...)
const MIN_CHAR_DELAY = 0.01;              // Min delay between characters (seconds)
const MAX_CHAR_DELAY = 0.1;               // Max delay between characters (seconds)
const MIN_WORD_DELAY = 0.01;              // Min pause after a word + space (seconds)
const MAX_WORD_DELAY = 0.1;               // Max pause after a word + space (seconds)
const MIN_PRE_LINE_DELAY = 0.1;           // Min pause before line starts typing (seconds)
const MAX_PRE_LINE_DELAY = 1.0;           // Max pause before line starts typing (seconds)
const LINE_DELAY = 0.5;                   // Fixed delay after a whole line is typed (seconds)
const SHOW_PROMPT = true;                 // Show the user@host prompt?
const PROMPT_DIR = "~";                   // Directory symbol in prompt
const PROMPT_SYMBOL = "$ ";               // Symbol at the end of the prompt
const HOST_NAME = "pc";                   // Hostname in prompt
const INPUT_PROMPT = "> ";                // Prompt shown when waiting for user text input
const NAME_QUESTION_TEXT = "What would you like to be called?"; // Exact text to trigger name input

// --- State Variables ---
let userName = "visitor";               // Default name, will be updated
let currentInput = "";                  // Stores user's current typing
let isWaitingForInput = false;          // Flag to indicate if script should listen for user input
let resolveInputPromise = null;         // Function to resolve the promise when user presses Enter

// --- DOM Element Variables ---
let cursorSpan = null;                  // The blinking cursor element
let currentLineContainer = null;        // The div holding the current line's elements
let currentOutputSpan = null;           // The span holding the currently typed output/user input

// --- Helper sleep function ---
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// --- Initialize Simulation on Page Load ---
document.addEventListener('DOMContentLoaded', () => {
    setupTerminal();
    startTerminalSimulation(); // Start automatically
});

// --- Setup Terminal Environment ---
function setupTerminal() {
    terminalDiv.innerHTML = ''; // Clear any static content
    // Create cursor span element
    cursorSpan = document.createElement('span');
    cursorSpan.id = 'cursor';
    // Set initial focus-ability (optional, might help if needed later)
    // terminalDiv.setAttribute('tabindex', '0');
}

// --- Keyboard Input Handling (when waiting) ---
function handleKeyDown(event) {
    // Only process keys if we are specifically waiting for input
    if (!isWaitingForInput) return;

    // Prevent default browser action for keys we handle (like Enter scrolling)
    event.preventDefault();

    if (event.key === "Enter") {
        // Update username if input is not empty, otherwise keep the current one
        userName = currentInput.trim() || userName;
        // Store the final input visually (optional, could just clear)
        currentOutputSpan.textContent = currentInput.trim(); // Finalize display
        cursorSpan.remove(); // Remove cursor from this completed input line

        // Reset state
        currentInput = "";
        isWaitingForInput = false;
        document.removeEventListener('keydown', handleKeyDown); // Stop listening

        addNewLine(); // Start a new blank line structure for subsequent output

        // Resume the main simulation loop
        if (resolveInputPromise) {
            resolveInputPromise();
            resolveInputPromise = null;
        }

    } else if (event.key === "Backspace") {
        // Handle backspace
        if (currentInput.length > 0) {
            currentInput = currentInput.slice(0, -1);
            currentOutputSpan.textContent = INPUT_PROMPT + currentInput; // Update display
        }
    } else if (!event.ctrlKey && !event.altKey && !event.metaKey && event.key.length === 1) {
        // Handle printable characters (ignore control keys)
        currentInput += event.key;
        currentOutputSpan.textContent = INPUT_PROMPT + currentInput; // Update display
    }

    // Ensure cursor stays at the end of the current line/input
    currentLineContainer.appendChild(cursorSpan);
    // Keep terminal scrolled to the bottom
    terminalDiv.scrollTop = terminalDiv.scrollHeight;
}


// --- Create and Append Structure for a New Line ---
function addNewLine(showUserPrompt = false) {
    currentLineContainer = document.createElement('div');
    // Optional: Add class if you defined .terminal-line CSS for spacing
    // currentLineContainer.classList.add('terminal-line');
    terminalDiv.appendChild(currentLineContainer);

    if (showUserPrompt && SHOW_PROMPT) {
        const userSpan = document.createElement('span');
        userSpan.className = 'prompt-user';
        userSpan.textContent = `${userName}@${HOST_NAME}:`; // Use current userName

        const dirSpan = document.createElement('span');
        dirSpan.className = 'prompt-dir';
        dirSpan.textContent = PROMPT_DIR;

        const symbolSpan = document.createElement('span');
        symbolSpan.className = 'prompt-symbol';
        symbolSpan.textContent = PROMPT_SYMBOL;

        currentLineContainer.appendChild(userSpan);
        currentLineContainer.appendChild(dirSpan);
        currentLineContainer.appendChild(symbolSpan);
    }

    currentOutputSpan = document.createElement('span'); // Span for typed output or user input
    currentLineContainer.appendChild(currentOutputSpan);
    currentLineContainer.appendChild(cursorSpan); // Place cursor initially
    return currentOutputSpan; // Return the span where text will be added
}

// --- Main Simulation Logic ---
async function startTerminalSimulation() {
    try {
        // Fetch the content from the specified file
        const response = await fetch(INTRO_FILE_PATH);
        if (!response.ok) {
            throw new Error(`HTTP error! File not found or inaccessible. Status: ${response.status}`);
        }
        const text = await response.text();
        // Split file content into lines
        const rawLines = text.split('\n');

        // Process each line from the file
        for (const rawLine of rawLines) {

            // Replace {name} placeholder with the current userName value
            let lineToDisplay = rawLine.replaceAll('{name}', userName);
            const trimmedLineToDisplay = lineToDisplay.trim(); // Use trimmed version for typing

            // Create structure for the new line (prompt + output span + cursor)
            const outputTarget = addNewLine(true); // Show standard prompt

            // Pre-line Delay before typing starts
            const preLineDelay = MIN_PRE_LINE_DELAY + Math.random() * (MAX_PRE_LINE_DELAY - MIN_PRE_LINE_DELAY);
            if (preLineDelay > 0) await sleep(preLineDelay * 1000);

            // Simulate typing the line content if it's not empty
            if (trimmedLineToDisplay) {
                const words = trimmedLineToDisplay.split(' ');
                for (let wordIndex = 0; wordIndex < words.length; wordIndex++) {
                    const word = words[wordIndex];
                    if (word.length === 0) continue; // Skip empty strings if multiple spaces

                    // Calculate char delay for this specific word
                    const charDelay = MIN_CHAR_DELAY + Math.random() * (MAX_CHAR_DELAY - MIN_CHAR_DELAY);

                    // Type characters of the word
                    for (let i = 0; i < word.length; i++) {
                        outputTarget.textContent += word[i];
                        if (charDelay > 0) await sleep(charDelay * 1000);
                    }

                    // Add space only if it's not the last word on the line
                    if (wordIndex < words.length - 1) {
                        outputTarget.textContent += ' ';
                    }

                    // Pause slightly between words
                    const wordPause = MIN_WORD_DELAY + Math.random() * (MAX_WORD_DELAY - MIN_WORD_DELAY);
                    if (wordPause > 0) await sleep(wordPause * 1000);
                }
            }

            // Ensure cursor is at the end after typing the line content
            currentLineContainer.appendChild(cursorSpan);

            // Check if this line requires user input
            if (rawLine.trim() === NAME_QUESTION_TEXT) {
                // Prepare for user input on a new line
                const inputOutputTarget = addNewLine(false); // Add new line structure, no user@host prompt
                inputOutputTarget.textContent = INPUT_PROMPT; // Show simple "> " prompt
                currentLineContainer.appendChild(cursorSpan); // Move cursor to the input line

                // Set state to wait for input and activate listener
                isWaitingForInput = true;
                currentInput = ""; // Clear input buffer
                document.addEventListener('keydown', handleKeyDown);

                // Wait here until the Enter key handler resolves the promise
                await new Promise(resolve => {
                    resolveInputPromise = resolve;
                });
                // Input is complete, userName variable is updated, loop continues...

            } else if (LINE_DELAY && LINE_DELAY > 0) {
                // Post-line Delay for normal output lines
                await sleep(LINE_DELAY * 1000);
            }

            // Ensure cursor is removed from completed output/input line before next iteration
            // (It will be re-added by addNewLine in the next iteration)
            cursorSpan.remove();
            // Scroll to bottom to keep latest line visible
            terminalDiv.scrollTop = terminalDiv.scrollHeight;

        } // End loop through lines

        // Final message after all lines are processed
        addNewLine(false).textContent = "Session ended."; // Add final message

    } catch (error) {
        // Display errors in the terminal
        console.error('Error during simulation:', error);
        const errorLine = addNewLine(false); // Add new line structure for error
        errorLine.textContent = `Error: ${error.message}`;
        errorLine.style.color = '#ff8787'; // Make error red
    } finally {
        // Cleanup: Ensure cursor is removed and listener is detached
        cursorSpan?.remove(); // Optional chaining in case it's already removed
        document.removeEventListener('keydown', handleKeyDown);
        isWaitingForInput = false; // Ensure state is reset
        // Keep terminal scrolled down
        terminalDiv.scrollTop = terminalDiv.scrollHeight;
    }
}