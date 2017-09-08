const Spiderette = require('../Spiderette');
const Mockette = require('./mock/Spiderette.mock');
const prettyjson = require('prettyjson');
const gameStates = require('./stub/Spiderette.games');

let gameState, wonGame;

describe('Spiderette', () => {
  beforeEach(() => {
    gameState = Spiderette.newGame();
    wonGame = Mockette.createGame(gameStates.wonGame);

    //console.log(Spiderette.asString(gameState));
  });

  // test('name game default score should be 7', () => {
  //   expect(gameState.stateScore).toBe(7);
  // });

  test('name game foundation should be empty', () => {
    expect(gameState.piles.foundation.len()).toBe(0);
  });

  test('name game tableaux should have correct number of cards', () => {
    expect(gameState.piles.tableaux[0].len()).toBe(1);
    expect(gameState.piles.tableaux[1].len()).toBe(2);
    expect(gameState.piles.tableaux[2].len()).toBe(3);
    expect(gameState.piles.tableaux[3].len()).toBe(4);
    expect(gameState.piles.tableaux[4].len()).toBe(5);
    expect(gameState.piles.tableaux[5].len()).toBe(6);
    expect(gameState.piles.tableaux[6].len()).toBe(7);
  });

  test('new game stock should have 24 cards', () => {
    expect(gameState.piles.stock.len()).toBe(24);
  });

  test('can create string representation of game', () => {
    Spiderette.setStringRepresentation(gameState);

    expect(gameState.stringRepresentation.length).not.toBe(0);
  });

  test('new game tableaux should have correct number of cards with remaining being empty (255)', () => {
    // validate the state of the piles
    const piles = gameState.piles;

    // now validate the tableaux
    for (let t = 0; t < piles.tableaux.length; t++) {
      for (let i = 0; i < piles.tableaux[t].length; i++) {
        if (i < t) {
          expect(piles.tableaux[t][i]).not.toBe(255);
          expect(Card.isFaceUp(piles.tableaux[t][i])).toBe(0);
        } else if (i === t) {
          expect(piles.tableaux[t][i]).not.toBe(255);
          expect(Card.isFaceUp(piles.tableaux[t][i])).toBe(1);
        } else {
          expect(piles.tableaux[t][i]).toBe(255);
        }
      }
    }
  });

  test('new game should have 24 cards in the stock, all face down', () => {
    // validate the state of the piles
    const piles = gameState.piles;

    // we should have 23 cards in the stock
    for (let s = 0; s < piles.stock.length; s++) {
      expect(piles.stock[s]).not.toBe(255);
      expect(Card.isFaceUp(piles.stock[s])).toBe(0);
    }
  });

  // test('gameState score should be updated correctly', () => {
  //   // manually reset the state score
  //   gameState.stateScore = 0;
  //
  //   expect(gameState.stateScore).toBe(0);
  //
  //   // we need to update the pileLengths before this will work
  //   Spiderette.updatePileLengths(gameState);
  //
  //   // calculate the score
  //   Spiderette.updateScore(gameState);
  //
  //   // score should be 8 by default
  //   expect(gameState.stateScore).toBe(7);
  //
  //   // get the piles
  //   var piles = gameState.piles;
  //
  //   // move a card to another tableaux (we don't care that this is a valid ace since we're just testing the score
  //   piles.tableaux[0][1] = piles.tableaux[1][1];
  //   piles.tableaux[1][1] = 255;
  //   piles.tableaux[1][0] = Card.flip(piles.tableaux[1][0]);
  //
  //   // we need to update the pileLengths before this will work
  //   Spiderette.updatePileLengths(gameState);
  //
  //   // calculate the score
  //   Spiderette.updateScore(gameState);
  //
  //   // score should be 10 now
  //   expect(gameState.stateScore).toBe(8);
  //
  //   // showing an extra card in the tableaux should increase the score by 1
  //   piles.tableaux[2][1] = Card.flip(piles.tableaux[2][1]);
  //
  //   // we need to update the pileLengths before this will work
  //   Spiderette.updatePileLengths(gameState);
  //   Spiderette.updateScore(gameState);
  //
  //   // score should be 11 now
  //   expect(gameState.stateScore).toBe(9);
  // });

  // test('game with all cards in foundation has a score of 104', () => {
  //   expect(wonGame.stateScore).toBe(104);
  // });

  test('can parse game with all known values', () => {
    const gameState = Mockette.createGame(gameStates.sampleGame1);

    Spiderette.setStringRepresentation(gameState);

    expect(gameState.stateScore).toBe(12);
  });

  test('string representation created for completely known game', () => {
    // create a draw-1 game
    const gameState = Mockette.createGame(gameStates.sampleGame1, 1);

    expect(gameState.stringRepresentation).toBe('');

    // set the string state
    Spiderette.setStringRepresentation(gameState);

    expect(gameState.stringRepresentation.trim().replace(/^\s*(.*?)$/gm, '$1')).toBe(
      gameStates.sampleGame1.trim().replace(/^\s*(.*?)$/gm, '$1')
    );
  });

  test('string representation created for known game with unknown values', () => {
    // create a draw-1 game
    const gameState = Mockette.createGame(gameStates.gameWithUnknownValues, 1);

    expect(gameState.stringRepresentation).toBe('');

    // set the string state
    Spiderette.setStringRepresentation(gameState);

    expect(gameState.stringRepresentation.trim().replace(/^\s*(.*?)$/gm, '$1')).toBe(
      gameStates.gameWithUnknownValues.trim().replace(/^\s*(.*?)$/gm, '$1')
    );
  });

  test('setHash sets the hash', () => {
    // get a known gameState
    var testState1 = Mockette.createGame(gameStates.sampleGame1, 1);

    testState1.hash = -1;

    Spiderette.setHash(testState1);

    // I am honestly not sure if this is correct or unique...
    expect(testState1.hash).toBe(7639199038);
  });

  test('automatically creating string representation automatically creates string representation', () => {
    Spiderette.automaticallyCreateStringRepresentation = true;
    let gameState = Spiderette.newGame(1);

    expect(gameState.stringRepresentation).not.toBe('');
  });

  test('test moving tableau to tableau', () => {
    let gameState = Mockette.createGame(gameStates.sampleGame2, 1);

    let move = {
      from: 'tableaux',
      fromIndex: 5,
      count: 1,
      to: 'tableaux',
      toIndex: 6
    };

    // do the move
    Spiderette.doMove(gameState, move);

    expect(gameState.piles.tableaux[6].len()).toBe(8);
    expect(gameState.piles.tableaux[5].len()).toBe(5);
    // expect the last card in 5 to be face up
    expect(Card.isFaceUp(gameState.piles.tableaux[5].last())).toBe(1);
  });

  test('test moving multiple tableau to tableau', () => {
    let gameState = Mockette.createGame(gameStates.sampleGame2, 1);

    let move = {
      from: 'tableaux',
      fromIndex: 1,
      count: 2,
      to: 'tableaux',
      toIndex: 0
    };

    // do the move
    Spiderette.doMove(gameState, move);

    expect(gameState.piles.tableaux[0].len()).toBe(3);
    expect(gameState.piles.tableaux[1].len()).toBe(1);
    // expect the last card in 1 to be face up
    expect(Card.isFaceUp(gameState.piles.tableaux[1].last())).toBe(1);
  });

  test('test drawing from the stock to the tableau', () => {
    let gameState = Mockette.createGame(gameStates.sampleGame1, 1);

    let move = {
      from: 'stock',
      to: 'tableaux'
    };

    // do the move
    Spiderette.doMove(gameState, move);

    expect(gameState.piles.tableaux[0].len()).toBe(4);
    expect(gameState.piles.tableaux[1].len()).toBe(5);
    expect(gameState.piles.tableaux[2].len()).toBe(4);
    expect(gameState.piles.tableaux[3].len()).toBe(2);
    expect(gameState.piles.tableaux[4].len()).toBe(4);
    expect(gameState.piles.tableaux[5].len()).toBe(7);
    expect(gameState.piles.tableaux[6].len()).toBe(9);

    // expect the last cards in tableaux to be face up
    expect(Card.isFaceUp(gameState.piles.tableaux[0].last())).toBe(1);
    expect(Card.isFaceUp(gameState.piles.tableaux[1].last())).toBe(1);
    expect(Card.isFaceUp(gameState.piles.tableaux[2].last())).toBe(1);
    expect(Card.isFaceUp(gameState.piles.tableaux[3].last())).toBe(1);
    expect(Card.isFaceUp(gameState.piles.tableaux[4].last())).toBe(1);
    expect(Card.isFaceUp(gameState.piles.tableaux[5].last())).toBe(1);
    expect(Card.isFaceUp(gameState.piles.tableaux[6].last())).toBe(1);
  });

  test('drawing last three cards from stock only adds to first three tableaux', () => {
    let gameState = Mockette.createGame(gameStates.sampleGame9, 1);

    let move = {
      from: 'stock',
      to: 'tableaux'
    };

    // do the move
    Spiderette.doMove(gameState, move);

    expect(gameState.piles.tableaux[0].len()).toBe(5);
    expect(gameState.piles.tableaux[1].len()).toBe(1);
    expect(gameState.piles.tableaux[2].len()).toBe(1);
    expect(gameState.piles.tableaux[3].len()).toBe(7);
    expect(gameState.piles.tableaux[4].len()).toBe(6);
    expect(gameState.piles.tableaux[5].len()).toBe(17);
    expect(gameState.piles.tableaux[6].len()).toBe(15);
  });

  test('test moving full stack to foundation', () => {
    let gameState = Mockette.createGame(gameStates.sampleGame3, 1);

    let move = {
      from: 'tableaux',
      fromIndex: 5,
      count: 13,
      to: 'foundation'
    };

    // do the move
    Spiderette.doMove(gameState, move);

    expect(gameState.piles.foundation.len()).toBe(13);
    expect(gameState.piles.tableaux[5].len()).toBe(5);

    // expect the last cards in tableaux to be face up
    expect(Card.isFaceUp(gameState.piles.tableaux[5].last())).toBe(1);
  });
});
