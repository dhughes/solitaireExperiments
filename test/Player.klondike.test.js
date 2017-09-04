const Player = require('../Player.klondike');
const Mockdike = require('./mock/Klondike.mock');
const Klondike = require('../Klondike');
const prettyjson = require('prettyjson');
const gameStates = require('./stub/Klondike.games');

// suit order: 0=c 1=d 2=h 3=s
let aceToFoundation, aceToFoundation2, allOtherMoves, winnableGame;

describe('Player', () => {
  beforeEach(() => {
    aceToFoundation = Mockdike.createGame(gameStates.aceCanMoveToFoundation, 1);
    aceToFoundation2 = Mockdike.createGame(gameStates.aceCanMoveToFoundation2, 1);
    allOtherMoves = Mockdike.createGame(gameStates.aceCanMoveToFoundation3, 1);
    winnableGame = Mockdike.createGame(gameStates.winnableGame, 1);
  });

  test('identifies ace to foundation', () => {
    const queue = Player.createPriorityQueue();
    Player.identifyMoves(aceToFoundation, queue);

    const move = queue.dequeue();

    expect(move.stateScore).toBe(25);
    expect(move.moveScore).toBe(6);
    expect(move.from).toBe('tableaux');
    expect(move.fromIndex).toBe(1);
    expect(move.to).toBe('foundations');
    expect(move.toIndex).toBe(2);
    expect(move.hash).toBe(-1478072029);
  });

  test('identify moves ace from waste', () => {
    // try to identify possible moves.
    // this should only identify the ace to the foundation, since that is the only logical move here.
    let queue = Player.createPriorityQueue();
    Player.identifyMoves(aceToFoundation2, queue);

    let move = queue.dequeue();

    expect(move.stateScore).toBe(25);
    expect(move.moveScore).toBe(6);
    expect(move.from).toBe('waste');
    expect(move.to).toBe('foundations');
    expect(move.toIndex).toBe(2);
    expect(move.hash).toBe(-1478426309);
  });

  test('identifies all valid moves', () => {
    // try to identify possible moves.
    var queue = Player.createPriorityQueue();
    Player.identifyMoves(allOtherMoves, queue);

    expect(queue.size()).toBe(9);
  });

  test('identifies moves in random game', () => {
    const gameState = Klondike.newGame(1);
    // try to identify possible moves.
    var queue = Player.createPriorityQueue();
    Player.identifyMoves(gameState, queue);

    expect(queue.size()).toBeGreaterThan(0);
  });

  test('winnable game isWinnable', () => {
    Player.isWinnable(winnableGame, (won, moves) => {
      expect(won).toBe(true);
      expect(moves).toBe(180);
    });
  });

  test('evaluate random game for winnability', done => {
    const gameState = Klondike.newGame(1);
    Player.maxMoves = 500;

    Player.isWinnable(gameState, (won, moves) => {
      // asserts that the callback was invoked
      done();
    });
  });
});
