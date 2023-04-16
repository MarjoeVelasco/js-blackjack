import {bannerContent, banner, bgmToggle, buttons, hitBtn, resetBtn, shuffleBtn, dealBtn, standBtn, player_hand_box, player_hand_value, computer_hand_box, computer_hand_value, card_status_player, card_status_computer, howBtn, startBtn, rankingBtn, exitBtn, startMenu, gameContainer,playerBalance, totalBet, cancelBet,instructionsContainer} from './dom-elements.js';
import {BGM, CLICK, SWIPE, WIN, LOSE} from './sounds.js';
import {player_standing} from './profile.js'

let last_computer_card='';

const player_hand = [];
const computer_hand = [];

//deck of cards
let deck = [];

let deck2 = ['ac','10c','jc','qc','kc',
            'as','10s','js','qs','ks',
            'ah','10h','jh','qh','kh',
            'ad','10d','jd','qd','kd'];

let player_stack = 0;
let computer_stack = 0;

const CARD_DIR = 'assets/cards/';

LOSE.preload = 'auto';
WIN.preload = 'auto';

WIN.volume=0.7;

BGM.loop = true;
BGM.volume = 0.6;
CLICK.volume = 0.7;
SWIPE.volume = 0.8;

const myData = { name: 'John', age: 30 };
const myData2 = { name: 'Max', age: 31 };

localStorage.setItem('myKey', JSON.stringify(myData));




let player_bet = 0;

playerBalance.value = player_standing.balance;


const tokens = [25, 50, 100, 500];


startMenu.style.display = 'flex';
gameContainer.style.display = 'none';
instructionsContainer.style.display = 'none';

updateTokenButtons();

tokens.forEach(token => {
  const button = document.getElementById(`${token}-btn`);
  button.addEventListener('click', () => {   
    CLICK.play(); 
    let bet = 0;
    bet = parseInt(bet) + parseInt(button.textContent);
    player_standing.balance = player_standing.balance - bet;
    playerBalance.value = player_standing.balance;
    player_bet +=bet;
    totalBet.textContent = player_bet;
    updateTokenButtons();
  });
});

//how to play 
howBtn.addEventListener('click',()=> {
  instructionsContainer.style.display = 'block';
  document.getElementById('blackjack-logo').style.width = '20vh';
});

//revert bet
cancelBet.addEventListener('click', ()=> {
  player_standing.balance = player_standing.balance + player_bet;
  playerBalance.value = player_standing.balance;
  updateTokenButtons();
  player_bet = 0;
  totalBet.textContent = 0;
})


function updateTokenButtons() {
  tokens.forEach(token => {
    const button = document.getElementById(`${token}-btn`);
    if (player_standing.balance < token) {
      button.style.visibility = 'hidden';
    } else {
      button.style.visibility = 'visible';
    }
  });
}




//set initial button status
initialButtonStatus();

//shufflecards;
shuffleCards();

//exit
exitBtn.addEventListener('click', ()=> {
  resetGame();
  player_standing.balance=1500;
  playerBalance.value = 1500;
  updateTokenButtons();
  player_bet = 0;
  cancelBet.style.display = 'block';
  totalBet.textContent=0;
  shuffleCards();

  startMenu.style.display = 'flex';
  gameContainer.style.display = 'none';
  instructionsContainer.style.display = 'none';
  document.getElementById('blackjack-logo').style.width = '60vh';
  BGM.pause();
});

//start game
startBtn.addEventListener('click', () => {
  startMenu.style.display = 'none';
  BGM.play();
  gameContainer.style.display = 'grid';
  instructionsContainer.style.display = 'none';
  //change name
  player_standing.name = document.getElementById('player-name-input').value;
})


//toggle bgm
bgmToggle.addEventListener('click', () => {
  CLICK.play();
  BGM.paused ? (BGM.play(), bgmToggle.textContent = '🎵 on') 
  : (BGM.pause(), bgmToggle.textContent = '🎵 off');
});



//deal cards
dealBtn.addEventListener('click', () => {
  //disable cancel bet button
  disableTokens();
  cancelBet.style.display = 'none';
  //clear cards and score
  resetGame();
  drawCard(deck, player_hand_box, player_hand, player_stack, 'player',true);
  setTimeout(() => {
    drawCard(deck, player_hand_box, player_hand, player_stack, 'player',true);
    dealClicked();
  }, 1200);

  setTimeout(() => {
    //check if blackjack
    if(checkBlackjack(player_hand,'player')) {
      card_status_player.textContent='BLACKJACK!';
      computer_hand_value.value = getPlayerScore(computer_hand);
      showCard('card-computer-20', last_computer_card);
      computerTurn();
    }
  }, 1800);

  //deal cards to computer
  setTimeout(() => {
    drawCard(deck, computer_hand_box, computer_hand, computer_stack, 'computer',true); 
    checkComputerFirstCard();
  },800);

  setTimeout(() => {
    drawCard(deck, computer_hand_box, computer_hand, computer_stack, 'computer',false);
  }, 1500);
});

//draw card
hitBtn.addEventListener('click', ()=>{
  drawCard(deck, player_hand_box, player_hand, player_stack, 'player',true);
    //check if bust
    setTimeout(function () {
      if (isBust(getPlayerScore(player_hand))) {
        showBanner('Bust, Computer wins!','purple');
        LOSE.play();
        showCard('card-computer-20', last_computer_card);
        computer_hand_value.value = getPlayerScore(computer_hand);
        setTimeout(function () {
          giveWinnerTokens('loser');
          updateTokenButtons();
          hideBanner();
          resetGame();
        },1400);  
      }
    },900)
});

//stand action
standBtn.addEventListener('click', ()=>{
  //trigger computer actions
  standClicked();
  computer_hand_value.value = getPlayerScore(computer_hand);
  showCard('card-computer-20', last_computer_card);
  computerTurn();
});

//reset score and card
resetBtn.addEventListener('click', ()=> {
  resetGame();
  player_standing.balance=1500;
  playerBalance.value = 1500;
  updateTokenButtons();
  player_bet = 0;
  cancelBet.style.display = 'block';
  totalBet.textContent=0;
  shuffleCards();
})


//add click sound to all buttons
buttons.forEach((button) => {
  button.addEventListener('click', () => {
    CLICK.play();
  });
});


async function computerTurn() {
  let timeouttime = 900;
  await new Promise(resolve => setTimeout(resolve, timeouttime));
  // keep drawing cards until computer score >= 17
  while (getPlayerScore(computer_hand) < 17) {
    drawCard(deck, computer_hand_box, computer_hand, computer_stack, 'computer', true);
    await new Promise(resolve => setTimeout(resolve, 300));
    timeouttime+=300;
  }
  computer_hand_value.value = getPlayerScore(computer_hand);
  setTimeout(checkWhoWins, timeouttime-300);
}


function checkWhoWins(){
  const computer_score = getPlayerScore(computer_hand);
  if (isBust(computer_score)) {
    showBanner('Computer bust, You win!','blue');
    WIN.play();
    giveWinnerTokens('winner');
  } else if (computer_score > getPlayerScore(player_hand)) {
    LOSE.play();
    showBanner('Computer Wins','purple');
    giveWinnerTokens('loser');
  } else if (computer_score < getPlayerScore(player_hand)) {
    WIN.play();
    showBanner('You win!','blue');
    giveWinnerTokens('winner');
  } else {
    showBanner('It\'s a tie!','gray');
    giveWinnerTokens('tie');
  }
  
  setTimeout(() => {
    resetGame();
    hideBanner();
    updateTokenButtons();
    cancelBet.style.display = 'block';
  }, 1000);
}

// draw card action
function drawCard(deck, cardContainer, hand, card_stack, user, show) {
  // check if deck is empty
  if (!deck.length) {
    alert('You ran out of cards, Shuffling cards');
    shuffleCards();
  }

  // select a random card from the deck and remove it
  const index = Math.floor(Math.random() * deck.length);
  const card = deck[index];

  if(user==='computer') {
    last_computer_card = card;
  }

  const rank = card.substring(0, card.length - 1);
  const value = getCardValue(rank);
  hand.push(value);
  deck.splice(index, 1);

  // create a card element and append it to the card container
  const player_card = createCardElement(card_stack, user);
  cardContainer.appendChild(player_card);

  // show the card if the 'show' argument is true
  if(show) {
    showCard(`card-${user}-${card_stack}`, card);
  }
  
  // update the card stack and the player/computer stack accordingly
  card_stack += 20;
  user === 'player' ? player_stack = card_stack : computer_stack = card_stack;
}

function createCardElement(card_stack, user) {
  const player_card = document.createElement('img');
  player_card.setAttribute('src', CARD_DIR + 'back_card.png');
  player_card.setAttribute('alt', user+' hand cards');
  player_card.setAttribute('height', '150px');
  player_card.setAttribute('class', `hand-${user}`);
  player_card.setAttribute('id', `card-${user}-${card_stack}`);
  player_card.style.cssText = `z-index: ${card_stack}; margin-left: 20px`; 
  return player_card;
}

//get value of card
function getCardValue(rank) {
  return (rank === 'a') ? 'a' : (['k', 'q', 'j'].includes(rank) ? 10 : parseInt(rank));
}

//remove all cards
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

//reveal card
function showCard(card_id,card_item) {
  const card = document.getElementById(card_id);
  // set the initial transform to hide the card
  card.style.transition = 'transform 0.8s';
  card.style.transform = 'rotateY(0deg)';
  // wait for transition to complete
  setTimeout(function () {
    // change image source and alt text
    card.src = CARD_DIR+''+ card_item + '.png';
    card.alt = 'New card';
    // flip the card
    card.style.transition = 'transform 0.2s';
    card.style.transform = 'rotateY(180deg)';
    // play swipe card sound
    SWIPE.play();
    // update player hand value 
    player_hand_value.value = getPlayerScore(player_hand);
  }, 800); 
}


//BUST Criteria
function isBust(score) {
  return score > 21;
}

//reset all 
function resetGame() {
    //remove drawn cards
    removeAllChildNodes(player_hand_box);
    removeAllChildNodes(computer_hand_box);
    //reset scores and stacks
    player_stack = 0;
    computer_stack = 0;
    player_hand.length = 0;
    player_hand_value.value = 0;
    computer_hand.length = 0;
    computer_hand_value.value = 0;
    //reset status
    card_status_player.textContent='';
    card_status_computer.textContent='';
    //reset button statuses
    initialButtonStatus();
}

//initial status of buttons
function initialButtonStatus() {
  hitBtn.disabled = true;
  standBtn.disabled = true;
  dealBtn.disabled = false;
}

//when deal button is clicked
function dealClicked() {
  hitBtn.disabled = false;
  standBtn.disabled = false;
  dealBtn.disabled = true;
}

//when stand button is clicked
function standClicked() {
  hitBtn.disabled = true;
  standBtn.disabled = true;
  dealBtn.disabled = true;
}

//populate deck
function shuffleCards(){
  deck.length = 0;
  const suits = ['c', 's', 'h', 'd'];
  const ranks = ['a', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k'];
  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < ranks.length; j++) {
      deck.push(ranks[j] + suits[i]);
    }
  }
}

//get player score
function getPlayerScore(playerDeck){
  let score = 0;
  let hasAce = false;
  
  for (const card of playerDeck) {
    if (card === 'a') {
      hasAce = true;
    } else {
      score += card;
    }
  }
  if (hasAce && score <= 10) {
    score += 11;
  } else if (hasAce) {
    score += 1;
  }

  return score;
}

//check if blackjack
function checkBlackjack(playerDeck) {
    if (playerDeck.includes('a') && (playerDeck.includes('k') || playerDeck.includes('q') || playerDeck.includes('j') || playerDeck.includes(10))) {
      return true;
    }
  return false;
}

//check first card of computer
function checkComputerFirstCard() {
  switch(computer_hand[0]) {
    case 'a':
      computer_hand_value.value = 11;
      break;
    case 'k':
    case 'q':
    case 'j':
      computer_hand_value.value = 10;
      break;
    default:
      computer_hand_value.value = computer_hand[0];
  }
}

//give winner tokens 
function giveWinnerTokens(status) {
  if(status === 'winner') {
    let winnings = player_bet * 2;
    player_standing.balance += winnings;
    playerBalance.value = player_standing.balance;
  }
  
  else if(status === 'tie') {
    player_standing.balance = player_standing.balance + player_bet;
    playerBalance.value = player_standing.balance;
  }

  totalBet.textContent = 0;
  player_bet = 0;
}

//disable all token buttons
function disableTokens() {
  tokens.forEach(token => {
    const button = document.getElementById(`${token}-btn`);
    button.style.visibility = 'hidden';
  });
}


function showBanner(message,color) {
  bannerContent.textContent = message;
  banner.style.background = color;
  banner.style.opacity = '1';
  banner.style.display = 'block';
}

function hideBanner() {
  banner.style.opacity = 0;
  setTimeout(function() {
    banner.style.display = 'none';
    banner.style.opacity = 1;
  }, 500);
}
