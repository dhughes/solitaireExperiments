const TableauMove = require('../TableauMove');
const Card = require('../Card');

describe('TableauMove', () => {
  test('can create new SpideTableauMove', () => {
    expect(new TableauMove()).not.toBeNull();
  });

  test('move 2 cards from tableau 6 to 3', () => {
    const move = new TableauMove(2, 6, 3);

    expect(move.getQuanitity()).toBe(2);
    expect(move.getFrom()).toBe(6);
    expect(move.getTo()).toBe(3);
  });

  test('can move 5 of hearts > 6 of spades to 4 of clubs when all are face up', () => {
    const movedCards = [new Card(5, Card.HEARTS, Card.UP), new Card(6, Card.SPADES, Card.UP)];
    const to = [new Card(4, Card.CLUBS, Card.UP)];

    expect(TableauMove.validate(movedCards, to)).toBe(true);
  });

  test('can not move 3 of hearts > 6 of spades to 7 of clubs when all are face up', () => {
    const movedCards = [new Card(3, Card.HEARTS, Card.UP), new Card(6, Card.SPADES, Card.UP)];
    const to = [new Card(7, Card.CLUBS, Card.UP)];

    expect(TableauMove.validate(movedCards, to)).toBe(false);
  });

  test('can not move to face down card', () => {
    const movedCards = [new Card(5, Card.HEARTS, Card.UP), new Card(6, Card.SPADES, Card.UP)];
    const to = [new Card(4, Card.CLUBS, Card.DOWN)];

    expect(TableauMove.validate(movedCards, to)).toBe(false);
  });

  test('can not move face down card', () => {
    const movedCards = [new Card(5, Card.HEARTS, Card.DOWN), new Card(6, Card.SPADES, Card.UP)];
    const to = [new Card(4, Card.CLUBS, Card.UP)];

    expect(TableauMove.validate(movedCards, to)).toBe(false);
  });
});
