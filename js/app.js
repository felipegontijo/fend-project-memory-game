// hold all types of cards in the game
const cardTypes = [
    'fa-diamond',        'fa-diamond',
    'fa-bolt',          'fa-bolt',
    'fa-leaf',          'fa-leaf',
    'fa-paper-plane-o', 'fa-paper-plane-o',
    'fa-cube',          'fa-cube',
    'fa-anchor',        'fa-anchor',
    'fa-bicycle',       'fa-bicycle',
    'fa-bomb',          'fa-bomb'
];

/**
 * @description Generates the HTML code necessary to create one card of the game
 * @param {string} type - The type of the card, e.g. fa-diamond, fa-bolt...
 * @returns {string} The HTML code, in form of string literal, necessary to generate
 *                      one card of the given type
 */
function generateCard (type) {
    return `<li class="card" data-type="${type}"><i class="fa ${type}"></i></li>`;
}

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

// get the deck element which holds the cards
const deck = document.querySelector('.deck');

/**
 * @description Generates all cards of the game randomly
 * @param {element} deck - The UL element which holds all the LI cards in the game
 */
function beginGame (deck) {
    let cardCode = shuffle(cardTypes).map(function(type) {
        return generateCard(type);
    });
    deck.innerHTML = cardCode.join('');
}

// start the game
beginGame(deck);

// hold the cards that are currently open -- but not matched
const openCards = [];

/**
 * @description Pushes a card to the openCards array
 * @param {element} card - The LI 'card' element
 */
function markAsOpen (card) {
    openCards.push(card);
}

/**
 * @description Records a match by adding the 'match' class
 *                  to each of the cards
 * @param {array} cards - The pair of matched cards
 */
function recordMatch (cards) {
    cards.forEach(function(card) {
        card.classList.add('match');
    });
}

/**
 * @description Flips a card
 *                  - shows symbol if currently hidden
 *                  - hides symbol if currently shown
 * @param {element} card - The LI 'card' element
 */
function flip (card) {
    card.classList.toggle('open');
    card.classList.toggle('show');
}

// grab the element that shows the number of moves taken
const moves = document.querySelector('.moves');

// initialize moves counter
let movesCounter = 0;

/**
 * @description Updates the HTML of the element of class 'moves'
 * @param {number} movesCounter - The amount of moves taken thus far
 * @returns The updated moves element
 */
function updateMoves (movesCounter) {
    return moves.innerHTML = `${movesCounter}`;
}

// add an event listener to the deck
deck.addEventListener('click', function(e) {
    // act only if clicked element is of desired type -- card
    if (e.target.classList.contains('card')) {
        const card = e.target;
        // act only if clicked card is not open
        if (!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match')) {

            flip(card);
            markAsOpen(card);

            if (openCards.length === 2) {
                // record move
                movesCounter += 1;
                updateMoves(movesCounter);

                // get open cards' types
                const firstCardType = openCards[0].dataset.type;
                const secondCardType = openCards[1].dataset.type;

                // if cards' types match
                if (firstCardType === secondCardType) {
                    recordMatch(openCards);
                    // empty the array of open cards
                    openCards = [];
                } else {
                    // hide cards after one second
                    setTimeout(function() {
                        openCards.forEach(function(card) {
                            flip(card);
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

/* TODO
*
*   win game condition & pop-up
*   timer
*   star rating
*   restart button
*/