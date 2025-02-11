let url='https://random-word-api.vercel.app/api?words=1&length=5';
let word="",row=1,answer;
let collection=document.getElementsByClassName("box");
let arrayCollection=Array.from(collection);

async function WordGenerator(){
    try{
        let response=await fetch(url);
        if(!response.ok){
            console.log("There was an error with the response!");
            return;
        }
        const data=await response.json();
        word=data[0];
        console.log("Word generated:",word);
    }
    catch(error){
        console.log("There was an error processing the request");
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
                arrayCollection[i].style.backgroundColor="rgb(180, 180, 110)";
                usedLetters[answer.charAt(count)]++;
            }
            else{
                arrayCollection[i].style.backgroundColor="rgb(75,75,75)";
            }
        }
        count++;
    }
}

async function InsertCharacter(answer,row){
    let count=0;
    for(let i=(row-1)*5;i<(row-1)*5+answer.length;i++){
        await new Promise(resolve=>setTimeout(resolve,300*count));
        arrayCollection[i].classList.add("flip");
        setTimeout(((i,count)=>{
            arrayCollection[i].textContent=answer.charAt(count);
            arrayCollection[i].classList.remove("flip");
        }).bind(null,i,count),150);
        count++;
    }
}

function resetGame(){
    arrayCollection.forEach(box=>{box.textContent="";
    box.style.backgroundColor="rgb(0, 0, 0)";});
    word="";
    row=1;
    answer="";
}

async function Game(){
    await WordGenerator();
    while(row<=5){
        answer=prompt("Enter the word:");
        if(answer.length!==5){
            alert("Please enter exactly 5 letters!");
            continue;
        }
        await InsertCharacter(answer,row);
        Checker();
        if(word===answer){
            setTimeout(()=>{alert("Congratulations, you did it handsome!");
        },500);
        break;
    }
    row++;
    await new Promise(resolve=>setTimeout(resolve,1000));
}
if(row>5){
    alert("Loserrrr! The word was: "+word);resetGame();
    }
}

async function main(){
    let startButton=document.getElementById("startButton");
    let resetButton=document.getElementById("resetButton");
    let settingsButton=document.getElementById('settingsButton');
    let heartButton=document.getElementById('heartButton');
    let newButtons=document.querySelectorAll('.key')  // ".forEach(button => {" added . Add the new button

    //resize the Image
    let gameImage = document.getElementById("gameImage");
    gameImage.style.width = "70px";  // Set the desired width
    gameImage.style.height = "auto";  // Maintain aspect ratio
    
    startButton.addEventListener('click',async()=>{   
        await Game();
    });
    resetButton.addEventListener('click',()=>{
        resetGame();
    });
    settingsButton.addEventListener('click', function() {
        alert('How To Play. \n1. Guess the Wordle in 5 tries. \n2. Each guess must be a valid 5-letter word. \nThe color of the tiles will change to show how close your guess was to the word. \n3. Tell Rivka "I love you" and give her a kiss. \nGood Luck!');
    });
    newButtons.forEach(button => {
    button.addEventListener('click', function() {
        button.classList.add('tried');
            // Add your guess logic here
          });
    });
    heartButton.addEventListener('click', function() {
        alert('More');
        // Add your guess logic here
    });  
}

main();
