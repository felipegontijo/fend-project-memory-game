/*
 *   Global variables
 *
 */

// references to elements
const deck = document.querySelector('.deck');
const timer = document.querySelector('.timer');
const moves = document.querySelector('.moves');
const firstStar = document.querySelector('#first-star');
const secondStar = document.querySelector('#second-star');
const thirdStar = document.querySelector('#third-star');
const restart = document.querySelector('.restart');
const modal = document.querySelector('.modal');

// timer variables
let seconds = 0;
let minutes = 0;
let interval;

// count moves
let movesCounter = 0;

// count pairs moved (moves / 2)
let pairsMoved = 0;

// hold the cards that are currently open -- but not matched
let openCards = [];

// keep track of pairs matched
let pairsMatched = 0;

// hold all the different types of cards (symbols) in the game
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

/*
 *
 *   Functions / Listeners
 *
 *
 */

/**
 * @description Generates the HTML code necessary to create one card of the game
 * @param {string} type - The type/symbol of the card, e.g. fa-diamond, fa-bolt...
 * @returns {string} The HTML code, in form of string literal, necessary to generate
 *                   one card of the given type
 */
function generateCard (type) {
    return `<li class="card" data-type="${type}"><i class="fa ${type}"></i></li>`;
}

/**
 * @description Shuffle function from http://stackoverflow.com/a/2450976
 * @param {array} array - The array to be shuffled
 * @returns {array} The shuffled array
*/
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

/**
 * @description Sets a timer, keeping track of the time in seconds
 *              and minutes accordingly
 */
function setTimer () {
    interval = setInterval(function() {
        seconds += 1;
        if (seconds === 60) {
            minutes += 1;
            seconds = 0;
        }
        // update timer display
        timer.innerHTML = `${minutes} minutes and ${seconds} seconds`;
    }, 1000);
}

/**
 * @description Pushes a card to the openCards array
 * @param {element} card - The LI 'card' element
 */
function markAsOpen (card) {
    openCards.push(card);
}

/**
 * @description Records a match by adding the 'match' class
 *              to each of the cards
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


/**
 * @description Updates the HTML of the element of class 'moves'
 * @param {number} movesCounter - The amount of moves taken thus far
 * @returns The updated moves element
 */
function updateMoves (movesCounter) {
    return moves.innerHTML = `${movesCounter}`;
}

/**
 * @description Generates all cards of the game randomly
 * @param {element} deck - The UL element which holds all the LI cards in the game
 *
 */
function beginGame (deck) {
    // reset the deck
    deck.innerHTML = '';

    // shuffle and generate new cards
    let cardHTML = shuffle(cardTypes).map(function(type) {
        return generateCard(type);
    });
    // attach new cards to deck
    deck.innerHTML = cardHTML.join('');

    // reset timer
    clearInterval(interval);
    timer.innerHTML = '';

    // reset moves
    movesCounter = 0;
    pairsMoved = 0;
    updateMoves(0);

    // reset matches
    pairsMatched = 0;

    // reset rating
    thirdStar.style.display = 'inline-block';
    secondStar.style.display = 'inline-block';
}

// START THE GAME
beginGame(deck);

function displayWin () {
    // stop timer and get it
    clearInterval(interval);
    const finalTime = timer.innerHTML;

    // get current stars
    const rating = document.querySelector('.stars').innerHTML;

    // get number of moves
    const totalMoves = document.querySelector('.moves').innerHTML;

    // set rating, timer, and moves
    document.querySelector('.stats--stars').innerHTML = rating;
    document.querySelector('.stats--timer').innerHTML = finalTime;
    document.querySelector('.stats--moves').innerHTML = totalMoves;

    // display the modal
    modal.style.display = 'block';

    // listen for replay
    document.querySelector('.stats--restart').addEventListener('click', function(e) {
        modal.style.display = 'none';
        beginGame(deck);
    })
}

restart.addEventListener('click', function(e) {
    let restartButton = e.target.closest('div.restart');
    if (!restartButton) return;
    beginGame(deck);
})

// listen for clicks on cards
deck.addEventListener('click', function(e) {
    // act only if clicked element is of desired type -- card
    if (e.target.classList.contains('card')) {
        const card = e.target;

        // set the timer on first move
        if (movesCounter === 0) {
            seconds = 0;
            minutes = 0;
            setTimer();
        }

        // control stars rating based on moves taken
        if (pairsMoved >= 12) {
            thirdStar.style.display = 'none';
        }
        if (pairsMoved >= 18) {
            secondStar.style.display = 'none';
        }

        // act only if clicked card is not open
        if (!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match')) {

            flip(card);
            markAsOpen(card);
            // TODO: prevent user from clicking on three cards
            movesCounter += 1;

            if (openCards.length === 2) {
                // record move
                pairsMoved = movesCounter/2;
                updateMoves(pairsMoved);

                // get open cards' types
                const firstCardType = openCards[0].dataset.type;
                const secondCardType = openCards[1].dataset.type;

                // if cards' types match
                if (firstCardType === secondCardType) {
                    recordMatch(openCards);
                    // increment match counter
                    pairsMatched += 1;
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
                // check if all cards have been matched
                if (pairsMatched === 8) {
                    displayWin();
                }
            }
        }
    }
});



/* TODO
*
*   prevent user from clicking on three cards
*   decrease time cards show for
*   polish styling
*/