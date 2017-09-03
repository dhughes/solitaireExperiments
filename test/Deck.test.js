const Deck = require('../Deck');
const Card = require('../Card');

// suit order: 0=c 1=d 2=h 3=s

const kingOfSpadesFaceDown = Card.newCard(13, 3, false);
const aceOfDiamondsFaceDown = Card.newCard(1, 1, false);
const eightOfHeartsFaceDown = Card.newCard(8, 2, false);

describe('Deck', () => {
  test('can create new deck', () => {
    const cards = Deck.newDeck();

    expect(cards.length).toBe(52);

    expect(cards[51]).toBe(kingOfSpadesFaceDown);
    expect(cards[13]).toBe(aceOfDiamondsFaceDown);
    expect(cards[33]).toBe(eightOfHeartsFaceDown);
  });

  test('can shuffle a deck of cards', () => {
    const cards = Deck.shuffle(Deck.newDeck());

    expect(cards.length).toBe(52);

    var i = -1;
    var diffCount = 0;
    for (var s = 0; s <= 3; s++) {
      // loop from 1 to 13
      for (var v = 1; v <= 13; v++) {
        i++;
        // most cards should not be in their default positions
        if (Card.newCard(v, s, false) !== cards[i]) {
          diffCount++;
        }
      }
    }

    expect(diffCount).toBeGreaterThan(26);
  });
});
