let url = "https://random-word-api.vercel.app/api?words=1&length=5";
let word = "", row = 1, answer = "", gameOver = false;
let collection = document.getElementsByClassName("box");
let arrayCollection = Array.from(collection);
let keyboardKeys = document.querySelectorAll(".key");
let currentGuess = "";
let maxLetters = 5;

async function WordGenerator() {
    try {
        let response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch word");

        const data = await response.json();
        if (!data || !data[0]) throw new Error("Invalid word received");

        word = data[0].toUpperCase();
        console.log("Word generated:", word);
    } catch (error) {
        console.error("Error fetching word:", error);
        alert("There was an error fetching the word. Try again!");
    }
}

function Checker() {
    let usedLetters = {};
    for (let letter of word) {
        usedLetters[letter] = (usedLetters[letter] || 0) + 1;
    }

    let startIdx = (row - 1) * maxLetters;
    
    // First pass: Check exact matches (green)
    for (let i = 0; i < maxLetters; i++) {
        let box = arrayCollection[startIdx + i];
        if (answer[i] === word[i]) {
            box.style.backgroundColor = "green";
            usedLetters[answer[i]]--;
        }
    }

    // Second pass: Check misplaced letters (yellow)
    for (let i = 0; i < maxLetters; i++) {
        let box = arrayCollection[startIdx + i];
        if (box.style.backgroundColor !== "green" && word.includes(answer[i]) && usedLetters[answer[i]] > 0) {
            box.style.backgroundColor = "yellow";
            usedLetters[answer[i]]--;
        } else if (box.style.backgroundColor !== "green") {
            box.style.backgroundColor = "rgb(75,75,75)";
        }
    }
}

function updateDisplay() {
    let startIdx = (row - 1) * maxLetters;
    for (let i = 0; i < maxLetters; i++) {
        arrayCollection[startIdx + i].textContent = currentGuess[i] || "";
    }
}

async function resetGame() {
    gameOver = false;
    arrayCollection.forEach(box => {
        box.textContent = "";
        box.style.backgroundColor = "rgb(0, 0, 0)";
    });
    word = "";
    row = 1;
    answer = "";
    currentGuess = "";
    await WordGenerator();
}

async function handleGuess() {
    if (gameOver) return;
    if (currentGuess.length !== maxLetters) {
        alert("Word must be 5 letters!");
        return;
    }

    answer = currentGuess;
    Checker();

    if (word === answer) {
        setTimeout(() => { alert("Congratulations, you did it handsome!"); }, 500);
        gameOver = true;
        return;
    }

    row++;
    if (row > 6) {
        alert("Looooseeeeer! The word was: " + word);
        resetGame();
        return;
    }

    currentGuess = "";
    updateDisplay();
}

async function main() {
    await WordGenerator();

    let resetButton = document.getElementById("resetButton");
    let settingsButton = document.getElementById('settingsButton');
    let heartButton = document.getElementById('heartButton');
    let newButtons = document.querySelectorAll('.key');
    let backspaceButton = document.getElementById("backspace");
    let enterButton = document.getElementById("enter");

    let gameImage = document.getElementById("gameImage");
    gameImage.style.width = "55px";  
    gameImage.style.height = "auto";  

    resetButton.addEventListener('click', resetGame);

    settingsButton.addEventListener('click', function() {
        alert('How To Play:\n1. Guess the Wordle in 5 tries.\n2. Each guess must be a valid 5-letter word.\n3. Tell Rivka "I love you" and give her a kiss. 💖');
    });

    heartButton.addEventListener('click', function() {
        alert('More');
    });

    newButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (gameOver || currentGuess.length >= maxLetters) return;
            currentGuess += button.textContent;
            updateDisplay();
        });
    });

    backspaceButton.addEventListener("click", function() {
        if (gameOver) return;
        currentGuess = currentGuess.slice(0, -1);
        updateDisplay();
    });

    enterButton.addEventListener("click", handleGuess);

    document.addEventListener("keydown", function(event) {
        if (gameOver) return;

        if (/^[a-zA-Z]$/.test(event.key) && currentGuess.length < maxLetters) {
            currentGuess += event.key.toUpperCase();
            updateDisplay();
        } else if (event.key === "Backspace") {
            currentGuess = currentGuess.slice(0, -1);
            updateDisplay();
        } else if (event.key === "Enter") {
            handleGuess();
        }
    });
}

main();
