const Card = require('./Card');

const deck = function() {
  const cards = [];

  for (let suit = Card.CLUBS; suit <= Card.SPADES; suit++) {
    for (let value = Card.ACE; value <= Card.KING; value++) {
      cards.push(new Card(value, suit, Card.DOWN));
    }
  }

  return cards;
};

const shuffled = function() {
  const cards = deck();
  let index = cards.length;

  while (index !== 0) {
    const randomIndex = Math.floor(Math.random() * index);
    index--;

    const temp = cards[index];
    cards[index] = cards[randomIndex];
    cards[randomIndex] = temp;
  }

  return cards;
};

module.exports.deck = deck;
module.exports.shuffled = shuffled;
