const Deck = require('../Deck');

describe('Deck', () => {
  test('can get an unshuffled deck of cards using Deck', () => {
    expect(Deck.deck().length).toBe(52);
  });

  test('can get a shuffled deck of cards using Deck', () => {
    expect(Deck.shuffled().length).toBe(52);
  });

  test('shuffled deck is shuffled', () => {
    let deck = Deck.deck();
    let shuffled = Deck.shuffled();
    let differences = 0;

    for (let i = 0; i < deck.length; i++) {
      differences += !deck[i].equals(shuffled[i]);
    }
    expect(differences).toBeGreaterThan(0);
  });
});
