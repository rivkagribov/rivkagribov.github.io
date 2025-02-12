let url = "https://random-word-api.vercel.app/api?words=1&length=5";
let word = "", row = 1, answer = "";
let collection = document.getElementsByClassName("box");
let arrayCollection = Array.from(collection);
let keyboardKeys = document.querySelectorAll(".key");
let currentGuess = "";
let maxLetters = 5; 

async function WordGenerator() {
    try {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch word");
        }
        const data = await response.json();
        if (!data || !data[0]) {
            throw new Error("Invalid word received");
        }
        word = data[0].toUpperCase(); 
        console.log("Word generated:", word);
    } catch (error) {
        console.error("Error fetching word:", error);
        alert("There was an error fetching the word. Try again!");
    }
}
function Checker(){
    let count=0;
    let usedLetters={};
    for(let i=0;i<word.length;i++){
        usedLetters[word[i]]=0;
    }
    for(let i=(row-1)*5;i<(row-1)*5+answer.length;i++){
        if(answer.charAt(count)===word.charAt(count)){
            arrayCollection[i].style.backgroundColor="green";
            usedLetters[answer.charAt(count)]++;
        }
        count++;
    }
    count=0;
    for(let i=(row-1)*5;i<(row-1)*5+answer.length;i++){
        if(arrayCollection[i].style.backgroundColor!=="green"){
            if(word.includes(answer.charAt(count))&&usedLetters[answer.charAt(count)]<word.split(answer.charAt(count)).length-1){
                arrayCollection[i].style.backgroundColor="yellow";usedLetters[answer.charAt(count)]++;
            }
            else{
                arrayCollection[i].style.backgroundColor="rgb(75,75,75)";
            }
        }
        count++;
    }
}
function updateDisplay() {
    let startIdx = (row - 1) * 5;
    for (let i = 0; i < maxLetters; i++) {
        arrayCollection[startIdx + i].textContent = currentGuess[i] || "";
    }
}

function resetGame() {
    arrayCollection.forEach(box => {box.textContent = "";
    box.style.backgroundColor = "rgb(0, 0, 0)";});
    word = "";
    row = 1;
    answer = "";
    currentGuess = ""; 
}

async function Game() {
    await WordGenerator();
    while (row <= 6) {
        if (currentGuess.length !== 5) {
            alert("Please enter exactly 5 letters!");
            continue;
        }
        answer = currentGuess; 
        Checker();
        if (word === answer) {
            setTimeout(() => { alert("Congratulations, you did it handsome!"); }, 500);
            break;
        }
        row++;
        currentGuess = ""; // Reset for next round
        updateDisplay();
    }
    if (row > 6) {
        alert("Looooseeeeer! The word was: " + word);
        resetGame();
    }
}

async function main() {
    let resetButton = document.getElementById("resetButton");
    let settingsButton = document.getElementById('settingsButton');
    let heartButton = document.getElementById('heartButton');
    let newButtons = document.querySelectorAll('.key');
    let backspaceButton = document.getElementById("backspace");
    let enterButton = document.getElementById("enter");

    let gameImage = document.getElementById("gameImage");
    gameImage.style.width = "55px";  
    gameImage.style.height = "auto";  

    resetButton.addEventListener('click', () => {
        resetGame();
        Game();
    });

    settingsButton.addEventListener('click', function() {
        alert('How To Play:\n1. Guess the Wordle in 5 tries.\n2. Each guess must be a valid 5-letter word.\n3. Tell Rivka "I love you" and give her a kiss. 💖');
    });

    heartButton.addEventListener('click', function() {
        alert('More');
    });
    newButtons.forEach(button => {
        button.addEventListener('click', function() {
            let letter = button.textContent;
            if (currentGuess.length < maxLetters) {
                currentGuess += letter;
                updateDisplay();
            }
        });
    });
    backspaceButton.addEventListener("click", function() {
        currentGuess = currentGuess.slice(0, -1);
        updateDisplay();
    });
document.addEventListener("keydown", async function(event) {
    if (event.key === "Enter") {
        if (currentGuess.length === maxLetters) {
            answer = currentGuess;
            await InsertCharacter(answer, row);
            Checker();
            currentGuess = "";
            updateDisplay();
        } else {
            alert("Word must be 5 letters!");
        }
    }
    
    // Handle enter key
    enterButton.addEventListener("click", async function() {
        if (currentGuess.length === maxLetters) {
            answer = currentGuess;
            await InsertCharacter(answer, row);
            Checker();
            currentGuess = "";
            updateDisplay();
        } else {
            alert("Word must be 5 letters!");
        }
    });
    await Game();
}

main();
