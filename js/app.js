/*
 * Create a list that holds all of your cards
*/
const cardTypes = ['fa-diamond',        'fa-diamond',
                    'fa-bolt',          'fa-bolt',
                    'fa-leaf',          'fa-leaf',
                    'fa-paper-plane-o', 'fa-paper-plane-o',
                    'fa-cube',          'fa-cube',
                    'fa-anchor',        'fa-anchor',
                    'fa-bicycle',       'fa-bicycle',
                    'fa-bomb',          'fa-bomb'];

function generateCard (type) {
    return `<li class="card" data-type="${type}"><i class="fa ${type}"></i></li>`;
}


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
*/

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
*/

// get the entire deck of cards
const deck = document.querySelector('.deck');

function beginGame (deck) {
    let cardCode = shuffle(cardTypes).map(function(type) {
        return generateCard(type);
    });
    deck.innerHTML = cardCode.join('');
}

beginGame(deck);

// create an array to hold the cards that are currently open
let openCards = [];

// add a card to the openCards array
function markAsOpen (card) {
    openCards.push(card);
}

function flipCard (card) {
    card.classList.toggle('open');
    card.classList.toggle('show');
}

const moves = document.querySelector('.moves');
let movesCounter = 0;
function updateMoves (movesCounter) {
    return moves.innerHTML = `${movesCounter}`;
}



// add an event listener to the deck
deck.addEventListener('click', function(e) {
    if (e.target.classList.contains('card')) {
        const card = e.target;
        if (!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match')) {

            flipCard(card);
            markAsOpen(card);

            if (openCards.length === 2) {
                // increment movesCounter & update number shown
                movesCounter += 1;
                updateMoves(movesCounter);

                const firstCard = openCards[0].dataset.type;
                const secondCard = openCards[1].dataset.type;
                // if cards type match
                if (firstCard == secondCard) {
                    openCards[0].classList.add('match');
                    openCards[1].classList.add('match');
                    openCards = [];
                } else {
                    // if do not match
                    setTimeout(function() {
                        openCards.forEach(function(card) {
                            flipCard(card);
                        });
                        openCards = [];
                    }, 1000);
                }
            }
        }
    }
});

/*
// check to see if all cards have been matched
const cards = document.querySelectorAll('.card');
let contains = cards.forEach(function(card) {
    return card.classList.contains('match');
});
if (contains) {
    alert('You won!');
}
*/