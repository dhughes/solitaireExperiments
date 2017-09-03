const Card = require('../Card');

// suit order: 0=c 1=d 2=h 3=s

const kingOfSpadesFaceUp = Card.newCard(13, 3, true);
const aceOfDiamondsFaceDown = Card.newCard(1, 1, false);
const eightOfHeartsFaceUp = Card.newCard(8, 2, true);
const tenOfClubsFaceUp = Card.newCard(10, 0, true);
const unknownFaceDown = 0;
const unknownFaceUp = 1;

describe('Card', () => {
  test('test cards are expected integer values', () => {
    expect(kingOfSpadesFaceUp).toBe(111);
    expect(aceOfDiamondsFaceDown).toBe(10);
    expect(eightOfHeartsFaceUp).toBe(69);
  });

  test('asString gives correct string representation for card', () => {
    expect(Card.asString(kingOfSpadesFaceUp)).toBe('[ KS]');
    expect(Card.asString(aceOfDiamondsFaceDown)).toBe('( AD)');
    expect(Card.asString(eightOfHeartsFaceUp)).toBe('[ 8H]');
    expect(Card.asString(tenOfClubsFaceUp)).toBe('[10C]');
    expect(Card.asString(unknownFaceUp)).toBe('[???]');
    expect(Card.asString(unknownFaceDown)).toBe('(???)');
  });

  test('numericValue gives correct numeric value for card', () => {
    expect(Card.numericValue(kingOfSpadesFaceUp)).toBe(13);
    expect(Card.numericValue(aceOfDiamondsFaceDown)).toBe(1);
    expect(Card.numericValue(eightOfHeartsFaceUp)).toBe(8);
  });

  test('value gives correct A,2,3...K value for card', () => {
    expect(Card.value(kingOfSpadesFaceUp)).toBe('K');
    expect(Card.value(aceOfDiamondsFaceDown)).toBe('A');
    expect(Card.value(eightOfHeartsFaceUp)).toBe(8);
  });

  test('suit gives correct C,D,H,S suit for card', () => {
    expect(Card.suit(kingOfSpadesFaceUp)).toBe('S');
    expect(Card.suit(aceOfDiamondsFaceDown)).toBe('D');
    expect(Card.suit(eightOfHeartsFaceUp)).toBe('H');
  });

  test('numeric suit gives correct 1...4 suit for card', () => {
    expect(Card.numericSuit(kingOfSpadesFaceUp)).toBe(3);
    expect(Card.numericSuit(aceOfDiamondsFaceDown)).toBe(1);
    expect(Card.numericSuit(eightOfHeartsFaceUp)).toBe(2);
  });

  test('isFaceUp gives correct 0 or 1 facing direction for card', () => {
    expect(Card.isFaceUp(kingOfSpadesFaceUp)).toBe(1);
    expect(Card.isFaceUp(aceOfDiamondsFaceDown)).toBe(0);
    expect(Card.isFaceUp(eightOfHeartsFaceUp)).toBe(1);
    expect(Card.isFaceUp(unknownFaceUp)).toBe(1);
    expect(Card.isFaceUp(unknownFaceDown)).toBe(0);
  });

  test('flip flips card', () => {
    expect(Card.isFaceUp(Card.flip(kingOfSpadesFaceUp))).toBe(0);
    expect(Card.isFaceUp(Card.flip(aceOfDiamondsFaceDown))).toBe(1);
    expect(Card.isFaceUp(Card.flip(eightOfHeartsFaceUp))).toBe(0);
    expect(Card.isFaceUp(Card.flip(unknownFaceUp))).toBe(0);
    expect(Card.isFaceUp(Card.flip(unknownFaceDown))).toBe(1);
  });

  test('fromString correctly parses value suit and direction', () => {
    expect(Card.fromString('[ KS]')).toBe(kingOfSpadesFaceUp);
    expect(Card.fromString('( AD)')).toBe(aceOfDiamondsFaceDown);
    expect(Card.fromString('[ 8H]')).toBe(eightOfHeartsFaceUp);
    expect(Card.fromString('[10C]')).toBe(tenOfClubsFaceUp);
    expect(Card.fromString('[??]')).toBe(unknownFaceUp);
    expect(Card.fromString('(??)')).toBe(unknownFaceDown);
    expect(Card.fromString('[???]')).toBe(unknownFaceUp);
    expect(Card.fromString('(???)')).toBe(unknownFaceDown);
  });

  test('value of unknown card throws', () => {
    expect(() => {
      Card.value(unknownFaceUp);
    }).toThrow(/Unknown Value/);

    expect(() => {
      Card.value(unknownFaceDown);
    }).toThrow(/Unknown Value/);
  });

  test('numericSuit of unknown card throws', () => {
    expect(() => {
      Card.numericSuit(unknownFaceUp);
    }).toThrow(/Unknown Suit/);

    expect(() => {
      Card.numericSuit(unknownFaceDown);
    }).toThrow(/Unknown Suit/);
  });

  test('suit of unknown card throws', () => {
    expect(() => {
      Card.suit(unknownFaceUp);
    }).toThrow(/Unknown Suit/);

    expect(() => {
      Card.suit(unknownFaceDown);
    }).toThrow(/Unknown Suit/);
  });

  test('color of unknown card throws', () => {
    expect(() => {
      Card.color(unknownFaceUp);
    }).toThrow(/Unknown Suit/);

    expect(() => {
      Card.color(unknownFaceDown);
    }).toThrow(/Unknown Suit/);
  });

  test('color of card is correct', () => {
    expect(Card.color(kingOfSpadesFaceUp)).toBe(0);
    expect(Card.color(aceOfDiamondsFaceDown)).toBe(1);
    expect(Card.color(eightOfHeartsFaceUp)).toBe(1);
    expect(Card.color(aceOfDiamondsFaceDown)).toBe(1);
  });

  test('frontString throws correct errors with bad input', () => {
    expect(() => {
      Card.fromString('[]');
    }).toThrow(/Invalid/);

    expect(() => {
      Card.fromString('8]');
    }).toThrow(/Invalid/);

    expect(() => {
      Card.fromString('[H');
    }).toThrow(/Invalid/);

    expect(() => {
      Card.fromString('XX');
    }).toThrow(/Invalid/);

    expect(() => {
      Card.fromString('(?H)');
    }).toThrow(/Invalid/);
  });
});
