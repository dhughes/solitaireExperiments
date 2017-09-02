const Card = require('../Card');

describe('Card', () => {
  test('can create a card', () => {
    expect(new Card()).not.toBeNull();
  });

  test('card has a value of 5', () => {
    expect(new Card(5).getValue()).toBe(5);
  });

  test('card has a value of 10', () => {
    expect(new Card(10).getValue()).toBe(10);
  });

  test('Jack has a value of 11', () => {
    expect(Card.JACK).toBe(11);
  });

  test('card has a value of Jack', () => {
    expect(new Card(Card.JACK).getValue()).toBe(Card.JACK);
  });

  test('card has a value of Ace (which is 1)', () => {
    expect(new Card(Card.ACE).getValue()).toBe(1);
  });

  test('card has a suit of Clubs', () => {
    expect(new Card(5, Card.CLUBS).getSuit()).toBe(Card.CLUBS);
  });

  test('card has a suit of Spades', () => {
    expect(new Card(5, Card.SPADES).getSuit()).toBe(Card.SPADES);
  });

  test('card is facing up', () => {
    expect(new Card(4, Card.SPADES, Card.UP).getFacing()).toBe(Card.UP);
  });

  test('card is facing down', () => {
    expect(new Card(4, Card.SPADES, Card.DOWN).getFacing()).toBe(Card.DOWN);
  });

  test('face up 5 of diamonds toString() returns [ 5♢]', () => {
    expect(new Card(5, Card.DIAMONDS, Card.UP).toString()).toBe('[ 5♢]');
  });

  test('face up 10 of hearts toString() returns [10♡]', () => {
    expect(new Card(10, Card.HEARTS, Card.UP).toString()).toBe('[10♡]');
  });

  test("default unknown card toString() returns -???- since we don't know what it is or which way its facing", () => {
    expect(new Card().toString()).toBe('-???-');
  });

  test('face down QUEEN of clubs toString() returns (***)', () => {
    expect(new Card(Card.QUEEN, Card.CLUBS, Card.DOWN).toString()).toBe('(***)');
  });

  test('unknown card which is face down toString() returns (***)', () => {
    expect(new Card(undefined, undefined, Card.DOWN).toString()).toBe('(***)');
  });

  test("5 of spades face down toString(true) returns ( 5♠) because we're peeking at the values", () => {
    expect(new Card(5, Card.SPADES, Card.DOWN).toString(true)).toBe('( 5♠)');
  });

  test('parsing [ 5♡] gives us a five of hearts that is face up', () => {
    const card = Card.parse('[ 5♡]');

    expect(card.getValue()).toBe(5);
    expect(card.getSuit()).toBe(Card.HEARTS);
    expect(card.getFacing()).toBe(Card.UP);
  });

  test('parsing [***] gives us an unknown card that is face up', () => {
    const card = Card.parse('[***]');

    expect(card.getValue()).toBe(undefined);
    expect(card.getSuit()).toBe(undefined);
    expect(card.getFacing()).toBe(Card.UP);
  });

  test('parsing [???] gives us an unknown card that is face up', () => {
    const card = Card.parse('[???]');

    expect(card.getValue()).toBe(undefined);
    expect(card.getSuit()).toBe(undefined);
    expect(card.getFacing()).toBe(Card.UP);
  });

  test('parsing (***) gives us an unknown card that is face down', () => {
    const card = Card.parse('(***)');

    expect(card.getValue()).toBe(undefined);
    expect(card.getSuit()).toBe(undefined);
    expect(card.getFacing()).toBe(Card.DOWN);
  });

  test('parsing (???) gives us an unknown card that is face down', () => {
    const card = Card.parse('(???)');

    expect(card.getValue()).toBe(undefined);
    expect(card.getSuit()).toBe(undefined);
    expect(card.getFacing()).toBe(Card.DOWN);
  });

  test('parsing [10♠] gives us a 10 of spades that is face up', () => {
    const card = Card.parse('[10♠]');

    expect(card.getValue()).toBe(10);
    expect(card.getSuit()).toBe(Card.SPADES);
    expect(card.getFacing()).toBe(Card.UP);
  });

  test('parsing [ K♣] gives us a King of clubs that is face up', () => {
    const card = Card.parse('[ K♣]');

    expect(card.getValue()).toBe(Card.KING);
    expect(card.getSuit()).toBe(Card.CLUBS);
    expect(card.getFacing()).toBe(Card.UP);
  });

  test('parsing [ 2♢] and using toString() gives us [ 2♢]', () => {
    const card = Card.parse('[ 2♢]');

    expect(card.toString()).toBe('[ 2♢]');
  });

  test('two instances of 3 of hearts shows are equal using equals()', () => {
    const card1 = new Card(3, Card.HEARTS, Card.UP);
    const card2 = new Card(3, Card.HEARTS, Card.UP);
    expect(card1.equals(card2)).toBe(true);
  });

  test('3 of hearts and 3 of spades are not equal using equals()', () => {
    const card1 = new Card(3, Card.HEARTS, Card.UP);
    const card2 = new Card(3, Card.SPADES, Card.UP);
    expect(card1.equals(card2)).toBe(false);
  });

  test('face down 5 of diamonds toString(true) returns [ 5♢] because peek is true', () => {
    expect(new Card(5, Card.DIAMONDS, Card.DOWN).toString(true)).toBe('( 5♢)');
  });

  test('face down 5 of diamonds toString() returns (***) because we are not peeking', () => {
    expect(new Card(5, Card.DIAMONDS, Card.DOWN).toString()).toBe('(***)');
  });

  test('can flip card facing down to up', () => {
    const card1 = new Card(3, Card.HEARTS, Card.DOWN);
    card1.flip();
    expect(card1.getFacing()).toBe(Card.UP);
  });

  test('cards facing down always show parenthesis', () => {
    const card1 = new Card(3, Card.HEARTS, Card.DOWN);
    expect(card1.toString()).toBe('(***)');
    expect(card1.toString(true)).toBe('( 3♡)');
  });

  test('cards with unknown values that are facing down always show parenthesis', () => {
    const card1 = new Card(undefined, undefined, Card.DOWN);
    expect(card1.toString()).toBe('(***)');
    expect(card1.toString(true)).toBe('(???)');
  });

  test('can parse face down 5 of hearts', () => {
    const card = Card.parse('( 5♡)');

    expect(card.getValue()).toBe(5);
    expect(card.getSuit()).toBe(Card.HEARTS);
    expect(card.getFacing()).toBe(Card.DOWN);
  });

  test("parsing card (???), which is face down, should match resulting card's toString() when we are peeking", () => {
    const card = Card.parse('(???)');
    expect(card.toString(true)).toBe('(???)');
  });
});
