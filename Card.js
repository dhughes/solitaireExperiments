/**
 * this is an object that knows how to read and work with card data
 * cards are 8 bit binary integers ranging from 8 to 111 (in decimal)
 * in the binary value the first five bits are the value of the card
 * (vals: 1 to 13) the next two are the suit (vals: 0 to 3) the last
 * bit is the faceup state (vals: 0 or 1).
 *
 * If a card's value is 0 it's unknown and face down
 * If a card's value is 1 it's unkown and face up
 *
 * Unknown cards are allowed when parsing them from a string
 *
 * @type {Object}
 */
Card = {};

Card.faceDown = 0x0; // 0000
Card.faceUp = 0x1; // 0001
Card.suitFilter = 3; // 0011

/**
 * Creates a new card
 * @param {Number} value The value of the card from 1(Ace) to 13(King)
 * @param {Number} suit The value of the suit. 1=Clubs, 2=Diamonds, 3=Hearts, 4=Spades
 * @param {Boolean} faceUp Indicates if the card is face up or not.
 * @returns {Number} Returns an integer representation of this card.  Can be processed using other functions on Card.
 */
Card.newCard = function(value, suit, faceUp) {
  return (value << 3) | (suit << 1) | faceUp;
};

/**
 * Takes the string representation of a card and turns it into an integer representation
 * @param string A string representation (AH, 8S, KD, etc) of a card
 */
Card.fromString = function(string) {
  string = string.trim();
  var value = string.substr(1, string.length - 3).trim();
  var suit = string.substr(string.length - 2, 1);

  var faceUp = string[0] === '[';

  // are the value and suit unknown?
  if ((value === '?' || value === '??') && suit === '?') {
    // reutrn 1 or 0 depending on if the card is face up
    return faceUp ? 1 : 0;
  }

  // figure out the numeric value if we have a string value.
  if (value === 'A') {
    value = 1;
  } else if (value === 'J') {
    value = 11;
  } else if (value === 'Q') {
    value = 12;
  } else if (value === 'K') {
    value = 13;
  } else if (!(value >= 2 || value <= 10)) {
    throw new Error('Invalid Value ' + value);
  }

  // figure out the suit
  if (suit === 'C') {
    suit = 0;
  } else if (suit === 'D') {
    suit = 1;
  } else if (suit === 'H') {
    suit = 2;
  } else if (suit === 'S') {
    suit = 3;
  } else {
    throw new Error('Invalid Suit ' + suit);
  }

  return Card.newCard(parseInt(value, 10), parseInt(suit, 10), faceUp);
};

/**
 * Returns the numeric value of the card provided
 * @param {int} card A card as an integer
 * @returns {int} The numeric value of the provided card (1 to 13)
 */
Card.numericValue = function(card) {
  return card >> 3;
};

/**
 * Returns the string value of the card provided (a, 2-10, j, q, k)
 * @param {int} card A card as an integer
 * @returns {String} The string representation of the card
 */
Card.value = function(card) {
  if (card === 0 || card === 1) throw new Error('Unknown Value');

  var value = Card.numericValue(card);

  // replace the numeric value with an alpha value where needed
  if (value === 1) {
    return 'A';
  } else if (value === 11) {
    return 'J';
  } else if (value === 12) {
    return 'Q';
  } else if (value === 13) {
    return 'K';
  } else {
    return value;
  }
};

/**
 * returns the numeric value of the suit
 * @param card The card to get the numeric suit from
 * @return {int}
 */
Card.numericSuit = function(card) {
  if (card === 0 || card === 1) throw new Error('Unknown Suit');

  return (card >> 1) & Card.suitFilter;
};

/**
 * Returns the suit of the card provided
 * @param {int} card
 * @returns {string} The suit of the card in unicode
 */
Card.suit = function(card) {
  if (card === 0 || card === 1) throw new Error('Unknown Suit');

  var suit = Card.numericSuit(card);

  if (suit === 0) {
    //return "♣";
    return 'C';
  } else if (suit === 1) {
    //return "♢";
    return 'D';
  } else if (suit === 2) {
    //return "♡";
    return 'H';
  } else {
    // 3
    //return "♠";
    return 'S';
  }
};

/**
 * Returns the color of the card provided
 * @param {int} card
 * @returns {int} The color of the card (0=black or 1=red)
 */
//todo: write a test for this
Card.color = function(card) {
  if (card === 0 || card === 1) throw new Error('Unknown Suit');

  var suit = Card.numericSuit(card);

  if (suit === 0 || suit === 3) {
    return 0;
  } else {
    // if(suit === 1 || suit === 2)
    return 1;
  }
};

/**
 * Indicates if the card is faceup
 * @param {int} card The card to check if is face up
 * @return {Boolean} Indicates if the card is face up or not
 */
Card.isFaceUp = function(card) {
  return card & Card.faceUp;
};

/**
 * Flips a card over such that a faceup card is now face down and vice versa
 * @param {int} card The card to flip
 * @returns {int} The flipped card
 */
Card.flip = function(card) {
  return card ^ Card.faceUp;
};

/**
 * This is a test
 * @param card The card to convert to a string
 */
Card.asString = function(card) {
  if (card === 0) {
    return '(???)';
  } else if (card === 1) {
    return '[???]';
  }

  if (Card.isFaceUp(card)) {
    return `[${Card.value(card).toString().padStart(2, ' ')}${Card.suit(card)}]`;
  } else {
    return `(${Card.value(card).toString().padStart(2, ' ')}${Card.suit(card)})`;
  }

  //return Card.isFaceUp(card) ? Card.value(card) + Card.suit(card) : "XX";
};

module.exports = Card;
