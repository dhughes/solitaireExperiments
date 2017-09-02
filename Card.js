// card value constants
const JACK = 11;
const QUEEN = 12;
const KING = 13;
const ACE = 1;

// card suit constants
const CLUBS = 0;
const DIAMONDS = 1;
const HEARTS = 2;
const SPADES = 3;

// card facing directions
const DOWN = 0;
const UP = 1;

// the card itself
const Card = function(value, suit, facing) {
  /**
   * gets the card's value
   * @return {[type]} [description]
   */
  this.getValue = function() {
    return value;
  };

  /**
   * gets the card's suit
   * @return {[type]} [description]
   */
  this.getSuit = function() {
    return suit;
  };

  /**
   * returns whether the card is face up or down
   * @return {[type]} [description]
   */
  this.getFacing = function() {
    return facing;
  };

  /**
   * flips the card
   * @type {[type]}
   */
  this.flip = function() {
    facing = facing === UP ? DOWN : UP;
  };

  /**
   * returns a string version of this card
   * @return {[type]} [description]
   */
  this.toString = function(peek) {
    if (value === undefined && suit === undefined && facing === undefined) return '-???-';
    if (value === undefined && suit === undefined && facing === DOWN && peek) return '(???)';
    if (value === undefined && suit === undefined && facing === DOWN && !peek) return '(***)';

    if (facing === DOWN) {
      return `(${valueToString(peek)}${suitToString(peek)})`;
    } else {
      return `[${valueToString(peek)}${suitToString(peek)}]`;
    }
  };

  /**
   * Determines if two cards represent the same card
   * @param  {[type]} card [description]
   * @return {[type]}      [description]
   */
  this.equals = function(card) {
    return (
      this.getValue() === card.getValue() && this.getSuit() === card.getSuit() && this.getFacing() === card.getFacing()
    );
  };

  const suitToString = function(peek) {
    if (peek != true && facing === DOWN) return '*';

    switch (suit) {
      case CLUBS:
        return '♣';
      case DIAMONDS:
        return '♢';
      case HEARTS:
        return '♡';
      case SPADES:
        return '♠';
      default:
        return '?';
    }
  };

  const valueToString = function(peek) {
    if (peek != true && facing === DOWN) return '**';

    switch (value) {
      case ACE:
        return ' A';
      case JACK:
        return ' J';
      case QUEEN:
        return ' Q';
      case KING:
        return ' K';
      case undefined:
        return '??';
      default:
        return ('' + value).padStart(2);
    }
  };
};

Card.parse = function(str) {
  if (str === '[***]' || str === '[???]') return new Card(undefined, undefined, UP);
  if (str === '(***)' || str === '(???)') return new Card(undefined, undefined, DOWN);

  const value = stringToValue(str.substr(1, 2));
  const suit = stringToSuit(str.substr(3, 1));

  if (str[0] === '(') {
    return new Card(value, suit, DOWN);
  } else {
    return new Card(value, suit, UP);
  }
};

stringToSuit = function(str) {
  switch (str) {
    case '♣':
      return CLUBS;
    case '♢':
      return DIAMONDS;
    case '♡':
      return HEARTS;
    case '♠':
      return SPADES;
  }
};

stringToValue = function(str) {
  switch (str.trim()) {
    case 'A':
      return ACE;
    case 'J':
      return JACK;
    case 'Q':
      return QUEEN;
    case 'K':
      return KING;
    default:
      return parseInt(str.trim());
  }
};

module.exports = Card;

// export constants
module.exports.JACK = JACK;
module.exports.QUEEN = QUEEN;
module.exports.KING = KING;
module.exports.ACE = ACE;

module.exports.CLUBS = CLUBS;
module.exports.DIAMONDS = DIAMONDS;
module.exports.HEARTS = HEARTS;
module.exports.SPADES = SPADES;

module.exports.DOWN = DOWN;
module.exports.UP = UP;
