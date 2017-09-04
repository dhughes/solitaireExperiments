const Player = require('../Player.Spiderette');
const Mockette = require('./mock/Spiderette.mock');
const Spiderette = require('../Spiderette');
const prettyjson = require('prettyjson');
const gameStates = require('./stub/Spiderette.games');

// suit order: 0=c 1=d 2=h 3=s
let sampleGame3,
  sampleGame4,
  sampleGame5,
  sampleGame6,
  sampleGame7,
  sampleGame8,
  sampleGame9,
  sampleGame10,
  sampleGame11,
  sampleGame12,
  sampleGame13;

describe('Player', () => {
  beforeEach(() => {
    sampleGame3 = Mockette.createGame(gameStates.sampleGame3);
    sampleGame4 = Mockette.createGame(gameStates.sampleGame4);
    sampleGame5 = Mockette.createGame(gameStates.sampleGame5);
    sampleGame6 = Mockette.createGame(gameStates.sampleGame6);
    sampleGame7 = Mockette.createGame(gameStates.sampleGame7);
    sampleGame8 = Mockette.createGame(gameStates.sampleGame8);
    sampleGame9 = Mockette.createGame(gameStates.sampleGame9);
    sampleGame10 = Mockette.createGame(gameStates.sampleGame10);
    sampleGame11 = Mockette.createGame(gameStates.sampleGame11);
    sampleGame12 = Mockette.createGame(gameStates.sampleGame12);
    sampleGame13 = Mockette.createGame(gameStates.sampleGame13);
  });

  test('identifies moving complete stack to foundation', () => {
    var queue = Player.createPriorityQueue();
    Player.identifyMoves(sampleGame4, queue);

    // should only find that move, ignoring others
    expect(queue.size()).toBe(1);
  });

  test('identifies several valid moves', () => {
    // try to identify possible moves.
    var queue = Player.createPriorityQueue();
    Player.identifyMoves(sampleGame6, queue);

    expect(queue.size()).toBe(9);
  });

  test('identifies moves to empty tableau', () => {
    // try to identify possible moves.
    var queue = Player.createPriorityQueue();
    Player.identifyMoves(sampleGame7, queue);

    expect(queue.toArray().filter(move => move.toIndex === 2).length).toBeGreaterThan(0);
  });

  test('ignores multiple open tableaux when stock is empty', () => {
    // try to identify possible moves.
    var queue = Player.createPriorityQueue();
    Player.identifyMoves(sampleGame8, queue);

    expect(queue.toArray().filter(move => move.toIndex === 2).length).toBe(0);
  });

  test('uses multiple open tableaux when stock is not empty', () => {
    // try to identify possible moves.
    var queue = Player.createPriorityQueue();
    Player.identifyMoves(sampleGame9, queue);

    expect(queue.toArray().filter(move => move.toIndex === 1).length).toBeGreaterThan(0);
    expect(queue.toArray().filter(move => move.toIndex === 2).length).toBeGreaterThan(0);
    expect(queue.toArray().filter(move => move.toIndex === 1).length).toBe(
      queue.toArray().filter(move => move.toIndex === 2).length
    );
  });

  test('identifies one-card tableau to tableau move', () => {
    var queue = Player.createPriorityQueue();
    Player.identifyMoves(sampleGame5, queue);

    // should only find that move, ignoring others
    expect(queue.toArray().filter(move => move.from === 'tableaux').length).toBe(1);
  });

  test('does not identify drawing from stock when there is an open tableau', () => {
    var queue = Player.createPriorityQueue();
    Player.identifyMoves(sampleGame7, queue);

    expect(queue.toArray().filter(move => move.from === 'stock').length).toBe(0);
  });

  test('identifies drawing from stock when there is are no open tableau', () => {
    var queue = Player.createPriorityQueue();
    Player.identifyMoves(sampleGame6, queue);

    expect(queue.toArray().filter(move => move.from === 'stock').length).toBe(1);
  });

  test('identifies moving 9h to 10d before 9h to 10c due to it being a longer stack', () => {
    var queue = Player.createPriorityQueue();
    Player.identifyMoves(sampleGame10, queue);

    // iterate through the queue and make sure we see t1 to t0 before we see t1 to t4
    let move;
    while ((move = queue.dequeue())) {
      if (move.from === 'tableaux' && move.fromIndex === 1 && move.to === 'tableaux' && move.toIndex === 0) {
        break;
      }
      if (move.from === 'tableaux' && move.fromIndex === 1 && move.to === 'tableaux' && move.toIndex === 4) {
        fail('found t4 before t0');
      }
    }
  });

  test('favors drawing from stock over breaking up stack', () => {
    var queue = Player.createPriorityQueue();
    Player.identifyMoves(sampleGame11, queue);

    while ((move = queue.dequeue())) {
      if (move.from === 'stock') {
        break;
      }
      if (move.from === 'tableaux' && move.fromIndex === 2) {
        fail('should not favor breaking stack over drawing from stock');
      }
    }
  });

  test('identify moves from game 13', () => {
    var queue = Player.createPriorityQueue();

    Player.identifyMoves(sampleGame13, queue);

    while ((move = queue.dequeue())) {
      console.log(move);
    }
  });

  test('play game 12', done => {
    var queue = Player.createPriorityQueue();

    Player.maxMoves = 500;

    console.log(Spiderette.asString(sampleGame12));

    Player.isWinnable(sampleGame12, (won, moves, finalState) => {
      console.log(won, moves);
      // console.log(Spiderette.asString(finalState));
      // asserts that the callback was invoked
      done();
    });
  });

  // test('winnable game isWinnable', () => {
  //   Player.isWinnable(winnableGame, (won, moves) => {
  //     expect(won).toBe(true);
  //     expect(moves).toBe(180);
  //   });
  // });
  //
  test('evaluate random Spiderette game for winnability', done => {
    const gameState = Spiderette.newGame(1);
    Player.maxMoves = 500;
    console.log(Spiderette.asString(gameState));
    Player.isWinnable(gameState, (won, moves, finalState) => {
      console.log(won, moves);
      // console.log(Spiderette.asString(finalState));
      // asserts that the callback was invoked
      done();
    });
  });
});
