/**
 * Deck is used to create sets of shuffled cards.
 * @type {Object}
 */
Deck = {};

/**
 * Creates and returns a new un-shuffled deck of 52 cards, all face down
 * @returns {Uint8Array} The array of cards
 */
Deck.newDeck = function() {
  const deck = new Uint8Array(52);

  // loop from 0 to 3 for suits
  var i = -1;
  for (var s = 0; s <= 3; s++) {
    // loop from 1 to 13
    for (var v = 1; v <= 13; v++) {
      i++;
      // create this card
      deck[i] = Card.newCard(v, s, false);
    }
  }

  return deck;
};

/**
 * Shuffles the collection of cards the specified number of times
 * @param {Uint8Array} deck The array of cards to shuffle
 * @returns {Uint8Array} The shuffled array (which was also updated byref)
 */
Deck.shuffle = function(deck) {
  const shuffledDeck = deck.slice();

  let index = shuffledDeck.length;
  while (index !== 0) {
    const randomIndex = Math.floor(Math.random() * index);
    index--;

    const temp = shuffledDeck[index];
    shuffledDeck[index] = shuffledDeck[randomIndex];
    shuffledDeck[randomIndex] = deck[index];
  }

  return shuffledDeck;
};

module.exports = Deck;
