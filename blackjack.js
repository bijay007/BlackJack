// *************************** BLACKJACK GAME FOR PROFESSIONALS ****************************//
'use strict'

// Defining properties and methods for every single card object created by fillPlayingCards function
function CardObject (cardNum, cardSuit) {
  this.cardNum = cardNum
  this.cardSuit = cardSuit
}
CardObject.prototype.getCardValue = function () {
  if (this.cardNum === 'jack' || this.cardNum === 'queen' || this.cardNum === 'king') {
    return 10
  } else if (this.cardNum === 'ace') {
    return 11
  } else {
    return this.cardNum
  }
}

// Deck object constructer with its properties and methods
function DeckObject () {
  this.iniDeck = []
  this.displayCards = function (cards) { // displaying corresponding card images on DOM
  // var fragment = document.createDocumentFragment()
    for (var i = 0; i < cards.length; i++) {
      var imgElement = document.createElement('img')
      imgElement.src = 'Images/' + cards[i].cardNum + '_of_' + cards[i].cardSuit + '.png'
      imgElement.style.height = '120px'
      imgElement.style.width = '100px'
        // fragment.appendChild(imgElement) only child nodes of fragment are added on DOM //
      if (this === mainPlayer) {
        noOfCardsPlayer++
        playerCards.appendChild(imgElement)
      } else {
        noOfCardsDealer++
        dealerCards.appendChild(imgElement)
      }
    }
  }
  this.sumCards = function (cards) { // adding numeric values of given cards
    var sum = 0, aces = 0
    for (var i = 0; i < cards.length; i++) {
      if (cards[i].getCardValue() === 11) { // checking for aces if >21, sum is decreased by 10
        aces += 1
        sum = sum + cards[i].getCardValue()
      } else {
        sum = sum + cards[i].getCardValue()
      }
    }
    while (aces > 0 && sum > 21) {
      aces -= 1
      sum -= 10
    }
    return sum
  }
  this.hitCard = function (cards) {
    var soloCard = [] // when we extract the last card, it comes off as an object. So we store that obj here inside this array to be able to pass it to displayCard() function
    var extraCard = cards.push(PlayingDeck.iniDeck.pop())
    soloCard.push(cards[extraCard - 1]) // push only the last added card and display it
    this.displayCards(soloCard)
    if (this === mainPlayer) {
      checkIfBust()
    }
  }
}

// Main deck used to play the game
var PlayingDeck = new DeckObject();
(function fillPlayingDeck () { // Filling the main deck with card objects
  var listCardNum = ['ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'jack', 'queen', 'king']
  var listCardSuits = ['clubs', 'diamonds', 'hearts', 'spades']
  for (var i = 0; i < listCardNum.length; i++) {
    for (var j = 0; j < listCardSuits.length; j++) {
      PlayingDeck.iniDeck.push(new CardObject(listCardNum[i], listCardSuits[j])) // generating 52 new card objects
    }
  }
  var len = PlayingDeck.iniDeck.length, randomNum, tempValue
  while (len) { // Fischer-Yates shuffling Algorithm
    randomNum = Math.floor(Math.random() * len--)
    tempValue = PlayingDeck.iniDeck[len]
    PlayingDeck.iniDeck[len] = PlayingDeck.iniDeck[randomNum]
    PlayingDeck.iniDeck[randomNum] = tempValue
  }
}())

// player and dealer function objects
var mainPlayer = new DeckObject()
function player () {
  mainPlayer.iniDeck.push(PlayingDeck.iniDeck.pop(), PlayingDeck.iniDeck.pop())
  mainPlayer.displayCards(mainPlayer.iniDeck)
  playerSum.value = mainPlayer.sumCards(mainPlayer.iniDeck)
}

var mainDealer = new DeckObject()
function dealer () {
  mainDealer.iniDeck.push(PlayingDeck.iniDeck.pop(), PlayingDeck.iniDeck.pop())
  mainDealer.displayCards(mainDealer.iniDeck)
  dealerSum.value = mainDealer.sumCards(mainDealer.iniDeck)
}

// function that compares if player has busted or not everytime he/she hits
function checkIfBust () {
  var playerScore = mainPlayer.sumCards(mainPlayer.iniDeck)
  var dealerScore = mainDealer.sumCards(mainDealer.iniDeck)
  playerSum.value = playerScore
  dealerSum.value = dealerScore
  if (playerScore > 21) {
    writeResult.value = 'You BUSTED !!'
    noOfWins--
    winsCounter.value = noOfWins
    disableHitStand()
  } else if (playerScore === 21) {
    writeResult.value = 'It\'s 21. You win !!'
    noOfWins++
    winsCounter.value = noOfWins
    disableHitStand()
  }
}

// function that runs on hit
function goToHitMethod () {
  mainPlayer.hitCard(mainPlayer.iniDeck)
}

// function that runs if user stands
function userStands () {
  var playerScore = mainPlayer.sumCards(mainPlayer.iniDeck)
  var dealerScore = mainDealer.sumCards(mainDealer.iniDeck)
  playerSum.value = playerScore
  while (dealerScore < 17) {
    mainDealer.hitCard(mainDealer.iniDeck)
    dealerScore = mainDealer.sumCards(mainDealer.iniDeck)
    dealerSum.value = dealerScore
  }
  if (dealerScore > playerScore && dealerScore <= 21) {
    writeResult.value = 'Dealer won with ' + dealerScore
    noOfWins--
    winsCounter.value = noOfWins
    disableHitStand()
  } else if (playerScore > dealerScore || dealerScore > 21) {
    if (playerScore === 21) {
      writeResult.value = 'You won with BLACKJACK !'
      noOfWins++
      winsCounter.value = noOfWins
      disableHitStand()
    } else {
      writeResult.value = 'You won with ' + playerScore
      noOfWins++
      winsCounter.value = noOfWins
      disableHitStand()
    }
  } else {
    writeResult.value = 'Both tied with ' + playerScore
    disableHitStand()
  }
}

// function that disables hit and stand button after result is shown.
function disableHitStand () {
  stand.disabled = true
  hit.disabled = true
}

// main game function on 'deal' button click
function playGame () {
  player()
  dealer()
  deal.disabled = true
  stand.disabled = false
  hit.disabled = false
}

// game reset on 'reset' button click
function resetGame () {
  writeResult.value = ''
  dealerSum.value = ''
  playerSum.value = ''
  deal.disabled = false;
  (function removeImages () {
    var playerCardImages = playerCards.childNodes
    var dealerCardImages = dealerCards.childNodes
    for (var i = noOfCardsPlayer; i > 0; i--) {
      playerCardImages[i].parentNode.removeChild(playerCardImages[i])
    }
    for (var j = noOfCardsDealer; j > 0; j--) {
      dealerCardImages[j].parentNode.removeChild(dealerCardImages[j])
    }
  }())
  mainPlayer.iniDeck = []
  mainDealer.iniDeck = []
  noOfCardsDealer = 0
  noOfCardsPlayer = 0
}

// dom elements and event handlers
var deal = document.getElementById('dealBtn')
deal.addEventListener('click', playGame)
var hit = document.getElementById('hitBtn')
hit.addEventListener('click', goToHitMethod)
var stand = document.getElementById('standBtn')
stand.addEventListener('click', userStands)
var reset = document.getElementById('resetBtn')
reset.addEventListener('click', resetGame)
var playerSum = document.getElementById('playersum')
var dealerSum = document.getElementById('dealersum')
var writeResult = document.getElementById('resultbox')
var winsCounter = document.getElementById('winscounter')
var playerCards = document.getElementById('playercards')
var dealerCards = document.getElementById('dealercards')
var noOfCardsPlayer = 0, noOfCardsDealer = 0, noOfWins = 0
// **** HOPE YOU ENJOYED IT. PLEASE FEEL FREE TO SEND ME ANY SUGGESTIONS ON IMPROVING THIS ON (bjtimi.007@gmail.com) OR SEND ME PULL REQUESTS *** //