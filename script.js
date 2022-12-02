class AudioController {

/* Audio */     
constructor() {
this.bgMusic = new Audio('audio/space.mp3');
this.flipSound = new Audio('audio/flip.mp3');
this.matchSound = new Audio('audio/meow.mp3');
this.victoryPurr = new Audio('audio/purr.mp3');
this.gameOverSound = new Audio('audio/gameover.mp3');
this.bgMusic.volume = 0.5;
this.bgMusic.loop = true;
}

startMusic() {this.bgMusic.play();}

stopMusic() {
this.bgMusic.pause();
this.bgMusic.currentTime = 0;
}

flip() {this.flipSound.play();}

match() {this.matchSound.play();}

victory() {
this.stopMusic();
this.victoryPurr.play();
}

gameOver() {
this.stopMusic();
this.gameOverSound.play();
}
}

/* /Audio */ 

class Game {

constructor(totalTime, cards) {
this.cardsArray = cards;
this.totalTime = totalTime;
this.timeLeft = totalTime;
this.timer = document.getElementById('time-remaining')
this.click = document.getElementById('flips');
this.audioController = new AudioController();
}

startGame() {
this.totalClicks = 0;
this.timeLeft = this.totalTime;
this.CheckCards = null;
this.matchedCards = [];
this.busy = true;

setTimeout(() => {
this.audioController.startMusic();
this.shuffle(this.cardsArray);
this.countdown = this.startCountdown();
this.busy = false;
}, 500)

this.hideCards();
this.timer.innerText = this.timeLeft;
this.click.innerText = this.totalClicks;
}

startCountdown() {
return setInterval(() => {
this.timeLeft--;
this.timer.innerText = this.timeLeft;

if (this.timeLeft === 0)
this.gameOver();
}, 1000);
}
    
gameOver() {
clearInterval(this.countdown);
this.audioController.gameOver();
document.getElementById('game-over-text').classList.add('visible');
}

victory() {
clearInterval(this.countdown);
this.audioController.victory();
document.getElementById('victory-text').classList.add('visible');
}

hideCards() {
this.cardsArray.forEach(card => {
card.classList.remove('visible');
card.classList.remove('matched');
});
}

flipCard(card) {
        
if(this.canFlipCard(card)) {

this.audioController.flip();
this.totalClicks++;
this.click.innerText = this.totalClicks;
card.classList.add('visible');

if (this.CheckCards) {
this.checkForCardMatch(card);
            
} else {
this.CheckCards = card;
}
}
}

checkForCardMatch(card) {

if (this.getCardType(card) === this.getCardType(this.CheckCards))
this.cardMatch(card, this.CheckCards);
        
else 
this.cardMismatch(card, this.CheckCards);

this.CheckCards = null;
}

cardMatch(card1, card2) {
this.matchedCards.push(card1);
this.matchedCards.push(card2);
card1.classList.add('matched');
card2.classList.add('matched');
this.audioController.match();
if(this.matchedCards.length === this.cardsArray.length)
this.victory();
}

cardMismatch(card1, card2) {
this.busy = true;
setTimeout(() => {
card1.classList.remove('visible');
card2.classList.remove('visible');
this.busy = false;
}, 1000);
}

shuffle(cardsArray) { // Fisher-Yates Shuffle Algorithm.
for (let i = cardsArray.length - 1; i > 0; i--) {
let randIndex = Math.floor(Math.random() * (i + 1));
cardsArray[randIndex].style.order = i;
cardsArray[i].style.order = randIndex;
}
}

getCardType(card) {
return card.getElementsByClassName('card-value')[0].src;
}

canFlipCard(card) {
return !this.busy && !this.matchedCards.includes(card) && card !== this.CheckCards;
}
}

if (document.readyState == 'loading') {
document.addEventListener('DOMContentLoaded', ready);

} else {
ready();
}

function ready() {
let overlays = Array.from(document.getElementsByClassName('overlay-text'));
let cards = Array.from(document.getElementsByClassName('card'));
let game = new Game(100, cards);

overlays.forEach(overlay => {
overlay.addEventListener('click', () => {
overlay.classList.remove('visible');
game.startGame();
});
});

cards.forEach(card => {
card.addEventListener('click', () => {
game.flipCard(card);
});
});
}