const cards = document.querySelectorAll(".card")
const info = document.querySelector(".info")
const winScreen = document.querySelector("#win_screen")
const loseScreen = document.querySelector("#lose_screen")
const retryArrow = document.querySelectorAll(".fa-arrow-rotate-left")
const tries = document.querySelector("#tries")
const time = document.querySelector("#time")
const score = document.querySelector("#score")
const wScore = document.querySelector("#wScore")
const startButton = document.querySelector("#startGame")
const playCover = document.querySelector("#playCover")

startButton.addEventListener("click", startGame)

let totalTries = 0
let flipCount = 0
let lockGame = false
let firstCard, secondCard
let firstCardFrontUrl, secondCardFrontUrl
let totalScore = 0

//flip card logic
function flip() {
    
    //check if game is locked (waiting for cards to unflip) 
    if(lockGame) return

    //check if trying to click on the same card twice
    if(this === firstCard) return
    
    this.classList.toggle("flip")
    flipCount++

    //check if it's first flip
    if(flipCount == 1) {
        firstCard = this
        firstCardFrontUrl = this.children[0].src
        return 
    }
    secondCard = this
    secondCardFrontUrl = this.children[0].src

    //it's second flip -> check if the two cards have the same front image
    if(firstCardFrontUrl == secondCardFrontUrl) {
        firstCard.removeEventListener("click", flip)
        secondCard.removeEventListener("click", flip)
        totalScore += 50
        updateScore()
    } else {
        if(totalScore > 0) {
            totalScore -= 10
            updateScore()
        }
        lockGame = true
        setTimeout(() => {
            firstCard.classList.toggle("flip")
            secondCard.classList.toggle("flip")
            lockGame = false
        }, 500)
    }
    flipCount = 0
    totalTries++
    addTry(totalTries)
    setTimeout(() => {
        checkWin()
    },500)
}





// IIFE TO SHUFFLE CARDS

(function shuffleCards() {
    for(card of cards) {
        let randPos = Math.floor(Math.random() * 18)
        card.style.order = randPos
    }
})()





// START LOGIC

let availableTime = 60

function startGame() {
    startButton.classList.add("hide")
    playCover.style.visibility = "hidden"
    info.style.visibility = "visible"
    let timer = setInterval(() => {
        if(winScreen.style.display == "flex") {
            clearInterval(timer)
        }
        if(availableTime == 0) {
            loseScreen.style.display = "flex"
        }
        if(availableTime > 0) {
            availableTime--
            time.innerText = `TIME : ${availableTime}`
        }
    }, 1000)

    //adding event listener to every card
    for(card of cards) {
        card.addEventListener("click", flip)
    }
}





// GAME LOGIC

function checkWin() {
    let trueCount = 0
    Array.from(cards).forEach(card => {
        if(card.classList.contains("flip"))
        trueCount++
    })
    if(trueCount == 18) {
        winScreen.style.display = "flex"
        wScore.innerText = `SCORE : ${totalScore + availableTime * 3}`
    } 
}

function restartGame() {
    location.reload()
}

function addTry(number) {
    tries.innerText = `TRIES : ${number}`
}

function updateScore(points) {
    score.innerText = `SCORE : ${totalScore}`
}

retryArrow.forEach(arrow => arrow.addEventListener("click", restartGame))