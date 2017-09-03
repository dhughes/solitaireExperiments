const Klondike = require('../Klondike');
const Mockdike = require('./mock/Klondike.mock');
const prettyjson = require('prettyjson');

// suit order: 0=c 1=d 2=h 3=s

let draw1Game, draw3Game;

describe('Klondike', () => {
  beforeEach(() => {
    draw1Game = Klondike.newGame(1);
    draw3Game = Klondike.newGame(3);
  });

  test('new Draw 1 game default score should be 8', () => {
    // the score on this game should be 8
    expect(draw1Game.stateScore).toBe(8);
  });

  test('new Draw 1 game draw count should be 1', () => {
    // make sure the drawCount is set correctly
    expect(draw1Game.drawCount).toBe(1);
  });

  test('new Draw 1 game foundations should have default suits', () => {
    // make sure the foundation suits should be their default:
    expect(draw1Game.foundationSuits[0]).toBe(0);
    expect(draw1Game.foundationSuits[1]).toBe(1);
    expect(draw1Game.foundationSuits[2]).toBe(2);
    expect(draw1Game.foundationSuits[3]).toBe(3);
  });

  test('new Draw 1 game lowest foundation value should be 0', () => {
    // the lowest foundation value should be 0
    expect(draw1Game.lowestFoundationValue).toBe(0);
  });

  test('new Draw 1 game foundations should be empty (all 255)', () => {
    // validate the state of the piles
    const piles = draw1Game.piles;

    // foundations first!
    for (let f = 0; f < piles.foundations.length; f++) {
      for (let i = 0; i < piles.foundations[f].length; i++) {
        expect(piles.foundations[f][i]).toBe(255);
      }
    }
  });

  test('new Draw 1 game tableaux should have correct number of cards with remaining being empty (255)', () => {
    // validate the state of the piles
    const piles = draw1Game.piles;

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

  test('new Draw 1 game should have 23 cards in the stock, all face down. remaining should be 255', () => {
    // validate the state of the piles
    const piles = draw1Game.piles;

    // we should have 23 cards in the stock
    for (let s = 0; s < piles.stock.length; s++) {
      if (s < piles.stock.length - 1) {
        expect(piles.stock[s]).not.toBe(255);
        expect(Card.isFaceUp(piles.stock[s])).toBe(0);
      } else {
        expect(piles.stock[s]).toBe(255);
      }
    }
  });

  test('new Draw 1 should have one card in waste, rest being 255', () => {
    // validate the state of the piles
    const piles = draw1Game.piles;

    // we should have one card in the waste
    for (let w = 0; w < piles.waste.length; w++) {
      if (w < 1) {
        expect(piles.waste[w]).not.toBe(255);
        expect(Card.isFaceUp(piles.waste[w])).toBe(1);
      } else {
        expect(piles.waste[w]).toBe(255);
      }
    }
  });

  test('new Draw 3 game default score should be 8', () => {
    // the score on this game should be 8
    expect(draw3Game.stateScore).toBe(8);
  });

  test('new Draw 3 game draw count should be 3', () => {
    // make sure the drawCount is set correctly
    expect(draw3Game.drawCount).toBe(3);
  });

  test('new Draw 3 game foundations should have default suits', () => {
    // make sure the foundation suits should be their default:
    expect(draw3Game.foundationSuits[0]).toBe(0);
    expect(draw3Game.foundationSuits[1]).toBe(1);
    expect(draw3Game.foundationSuits[2]).toBe(2);
    expect(draw3Game.foundationSuits[3]).toBe(3);
  });

  test('new Draw 3 game lowest foundation value should be 0', () => {
    // the lowest foundation value should be 0
    expect(draw3Game.lowestFoundationValue).toBe(0);
  });

  test('new Draw 3 game foundations should be empty (all 255)', () => {
    // validate the state of the piles
    const piles = draw3Game.piles;

    // foundations first!
    for (let f = 0; f < piles.foundations.length; f++) {
      for (let i = 0; i < piles.foundations[f].length; i++) {
        expect(piles.foundations[f][i]).toBe(255);
      }
    }
  });

  test('new Draw 3 game tableaux should have correct number of cards with remaining being empty (255)', () => {
    // validate the state of the piles
    const piles = draw3Game.piles;

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

  test('new Draw 3 game should have 21 cards in the stock, all face down. remaining should be 255', () => {
    // validate the state of the piles
    const piles = draw3Game.piles;

    // we should have 23 cards in the stock
    for (let s = 0; s < piles.stock.length; s++) {
      if (s < piles.stock.length - 3) {
        expect(piles.stock[s]).not.toBe(255);
        expect(Card.isFaceUp(piles.stock[s])).toBe(0);
      } else {
        expect(piles.stock[s]).toBe(255);
      }
    }
  });

  test('new Draw 3 should have 3 cards in waste, rest being 255', () => {
    // validate the state of the piles
    const piles = draw3Game.piles;

    // we should have one card in the waste
    for (let w = 0; w < piles.waste.length; w++) {
      if (w < 3) {
        expect(piles.waste[w]).not.toBe(255);
        expect(Card.isFaceUp(piles.waste[w])).toBe(1);
      } else {
        expect(piles.waste[w]).toBe(255);
      }
    }
  });

  ///////

  test('updateScore', () => {
    // manually reset the state score
    draw1Game.stateScore = 0;

    expect(draw1Game.stateScore).toBe(0);

    // we need to update the pileLengths before this will work
    Klondike.updatePileLengths(draw1Game);

    // calculate the score
    Klondike.updateScore(draw1Game);

    // score should be 8 by default
    expect(draw1Game.stateScore).toBe(8);

    // get the piles
    var piles = draw1Game.piles;

    // move a card to the foundation (we don't care that this is a valid ace since we're just testing the score
    piles.foundations[0][0] = piles.tableaux[1][0];
    piles.tableaux[1][1] = 255;
    piles.tableaux[1][0] = Card.flip(piles.tableaux[1][0]);

    // we need to update the pileLengths before this will work
    Klondike.updatePileLengths(draw1Game);

    // calculate the score
    Klondike.updateScore(draw1Game);

    // score should be 10 now
    expect(draw1Game.stateScore).toBe(10);

    // showing an extra card in the tableaux should increase the score by 1
    piles.tableaux[2][1] = Card.flip(piles.tableaux[2][1]);

    // we need to update the pileLengths before this will work
    Klondike.updatePileLengths(draw1Game);
    Klondike.updateScore(draw1Game);

    // score should be 11 now
    expect(draw1Game.stateScore).toBe(11);
  });

  test('can parse game with all known values', () => {
    const gameState = Mockdike.createGame(aceCanMoveToFoundationEverythingKnown, 1);

    Klondike.setStringRepresentation(gameState);

    expect(gameState.stateScore).toBe(25);
  });

  test('can parse game with unknown values', () => {
    const gameState = Mockdike.createGame(aceCanMoveToFoundation, 1);

    expect(gameState.stateScore).toBe(25);
  });

  test('string representation created for random game', () => {
    // manually remove the stringRepresentation
    draw1Game.stringRepresentation = '';

    expect(draw1Game.stringRepresentation).toBe('');

    // set the string state
    Klondike.setStringRepresentation(draw1Game);

    //console.log(draw1Game.stringRepresentation);
    expect(draw1Game.stringRepresentation.length).toBeGreaterThan(0);
  });

  test('string representation created for completely known game', () => {
    // create a draw-1 game
    const gameState = Mockdike.createGame(aceCanMoveToFoundationEverythingKnown, 1);

    expect(gameState.stringRepresentation).toBe('');

    // set the string state
    Klondike.setStringRepresentation(gameState);

    expect(gameState.stringRepresentation.trim().replace(/^\s*(.*?)$/gm, '$1')).toBe(
      aceCanMoveToFoundationEverythingKnown.trim().replace(/^\s*(.*?)$/gm, '$1')
    );
  });

  test('string representation created for known game with unknown values', () => {
    // create a draw-1 game
    const gameState = Mockdike.createGame(aceCanMoveToFoundation, 1);

    expect(gameState.stringRepresentation).toBe('');

    // set the string state
    Klondike.setStringRepresentation(gameState);

    expect(gameState.stringRepresentation.trim().replace(/^\s*(.*?)$/gm, '$1')).toBe(
      aceCanMoveToFoundation.trim().replace(/^\s*(.*?)$/gm, '$1')
    );
  });

  test('there are four foundations, each being 13 long', () => {
    // get the piles
    var piles = draw1Game.piles;

    // we should have four foundations
    expect(piles.foundations.length).toBe(4);

    // each foundation should be 13 long
    expect(piles.foundations[0].length).toBe(13);
    expect(piles.foundations[1].length).toBe(13);
    expect(piles.foundations[2].length).toBe(13);
    expect(piles.foundations[3].length).toBe(13);
  });

  test('there should be 7 tableaux, having lengths from 13 to 19', () => {
    // get the piles
    var piles = draw1Game.piles;

    // we should have 7 tableaux
    expect(piles.tableaux.length).toBe(7);

    // check the max length of each tableau
    expect(piles.tableaux[0].length).toBe(13);
    expect(piles.tableaux[1].length).toBe(14);
    expect(piles.tableaux[2].length).toBe(15);
    expect(piles.tableaux[3].length).toBe(16);
    expect(piles.tableaux[4].length).toBe(17);
    expect(piles.tableaux[5].length).toBe(18);
    expect(piles.tableaux[6].length).toBe(19);
  });

  test('stock and waste should have lengths of 24', () => {
    // get the piles
    var piles = draw1Game.piles;

    // the waste and stock should be 24 long
    expect(piles.waste.length).toBe(24);
    expect(piles.stock.length).toBe(24);
  });

  test('setting the foundation suits on empty foundations assigns expected suits', () => {
    // get a known gameState
    var testState1 = Mockdike.createGame(knownFoundationOrder, 1);

    testState1.foundationSuits = undefined;

    Klondike.setFoundationSuits(testState1);

    // check the foundation suits
    expect(testState1.foundationSuits[0]).toBe(0);
    expect(testState1.foundationSuits[1]).toBe(1);
    expect(testState1.foundationSuits[2]).toBe(2);
    expect(testState1.foundationSuits[3]).toBe(3);
  });

  test('setting the foundation suits on non-empty foundations assigns expected suits', () => {
    // get a known gameState
    var testState2 = Mockdike.createGame(knownFoundationOrder2, 1);

    testState2.foundationSuits = undefined;

    Klondike.setFoundationSuits(testState2);

    // check the foundation suits
    expect(testState2.foundationSuits[0]).toBe(2);
    expect(testState2.foundationSuits[1]).toBe(3);
    expect(testState2.foundationSuits[2]).toBe(1);
    expect(testState2.foundationSuits[3]).toBe(0);
  });

  test('lowest foundation value on new game should be 0', () => {
    draw1Game.lowestFoundationValue = -1;

    Klondike.setLowestFoundationValue(draw1Game);

    expect(draw1Game.lowestFoundationValue).toBe(0);
  });

  test('lowest foundation value on known game should be correct', () => {
    // get a known gameState
    var testState1 = Mockdike.createGame(knownFoundationOrder, 1);

    testState1.lowestFoundationValue = -1;

    // the above game's lowest value is 0 since foundation 2 is empty
    Klondike.setLowestFoundationValue(testState1);

    expect(testState1.lowestFoundationValue).toBe(0);
  });

  test('lowest foundation value on a game with non-empty foundations should be correct', () => {
    // get a known gameState
    var testState2 = Mockdike.createGame(higherMinimumFoundationValue, 1);

    testState2.lowestFoundationValue = -1;

    // the above game's lowest value is 0 since foundation 2 is empty
    Klondike.setLowestFoundationValue(testState2);

    expect(testState2.lowestFoundationValue).toBe(3);
  });

  test('lowest foundation value on game with all but last king in foundation should be correct', () => {
    // get a known gameState
    var testState3 = Mockdike.createGame(allButLastKing, 1);

    testState3.lowestFoundationValue = -1;

    // the above game's lowest value is 12 since we have all but one king up.
    Klondike.setLowestFoundationValue(testState3);

    expect(testState3.lowestFoundationValue).toBe(12);
  });

  test('setHash', () => {
    // get a known gameState
    var testState1 = Mockdike.createGame(aceCanMoveToFoundation, 1);

    testState1.hash = -1;

    Klondike.setHash(testState1);

    // I am honestly not sure if this is correct or unique...
    expect(testState1.hash).toBe(-530537581);
  });

  test('setHash for all but last king in foundations', () => {
    var testState3 = Mockdike.createGame(allButLastKing, 1);

    testState3.hash = -1;

    Klondike.setHash(testState3);
    //console.log(testState3.hash);

    // I am honestly not sure if this is correct or unique...
    expect(testState3.hash).toBe(5544926705);
  });

  // todo: add a test that makes sure all 52 cards are dealt out without any duplicates
});

const aceCanMoveToFoundationEverythingKnown = `
  ST: ( 6C),( 7C),( 8C),( 9C),(10C),( JC),( QC),( KC),( 2D),( 3D),( 4D),( 6D),( 7D)
  WA: [ 5S],( 8D),( 9D)

  F0: [ AS],[ 2S],[ 3S],[ 4S]
  F1: [ AD]
  F2:
  F3: [ AC],[ 2C],[ 3C],[ 4C]

  T0:
  T1: (10D),[ AH]
  T2: ( JD),( QD),[ KD]
  T3: ( 2H),( 3H),( 4H),[ 5C]
  T4: ( 5H),( 7H),( 8H),( 9H),[ JH]
  T5: (10H),( QH),( KH),( 6S),( 7S),[ 5D]
  T6: ( 8S),( 9S),(10S),( JS),( QS),( KS),[ 6H]`;

const aceCanMoveToFoundation = `
  ST: (???),(???),(???),(???),(???),(???),(???),(???),(???),(???),(???),(???),(???)
  WA: [ 5S],(???),(???)

  F0: [ AS],[ 2S],[ 3S],[ 4S]
  F1: [ AD]
  F2:
  F3: [ AC],[ 2C],[ 3C],[ 4C]

  T0:
  T1: (???),[ AH]
  T2: (???),(???),[ KD]
  T3: (???),(???),(???),[ 5C]
  T4: (???),(???),(???),(???),[ JH]
  T5: (???),(???),(???),(???),(???),[ 5D]
  T6: (???),(???),(???),(???),(???),( KS),[ 6H]`;

const knownFoundationOrder = `
  ST: (???),(???),(???),(???),(???),(???),(???),(???),(???),(???),(???),(???),(???)
  WA: [ 5S],(???),(???)

  F0: [ AC],[ 2C],[ 3C],[ 4C]
  F1: [ AD]
  F2:
  F3: [ AS],[ 2S],[ 3S],[ 4S]

  T0:
  T1: (???),[ AH]
  T2: (???),(???),[ KD]
  T3: (???),(???),(???),[ 5C]
  T4: (???),(???),(???),(???),[ JH]
  T5: (???),(???),(???),(???),(???),[ 5D]
  T6: (???),(???),(???),(???),(???),( KS),[ 6H]`;

const knownFoundationOrder2 = `
  ST: (???),(???),(???),(???),(???),(???),(???),(???),(???),(???),(???),(???),(???)
  WA: [ 5S],(???),(???)

  F0:
  F1: [ AS],[ 2S],[ 3S],[ 4S]
  F2: [ AD]
  F3: [ AC],[ 2C],[ 3C],[ 4C]

  T0:
  T1: (???),[ AH]
  T2: (???),(???),[ KD]
  T3: (???),(???),(???),[ 5C]
  T4: (???),(???),(???),(???),[ JH]
  T5: (???),(???),(???),(???),(???),[ 5D]
  T6: (???),(???),(???),(???),(???),( KS),[ 6H]`;

const higherMinimumFoundationValue = `
  ST: (???),(???),(???),(???),(???),(???),(???),(???),(???),(???),(???),(???),(???)
  WA: [ 5S],(???),(???)

  F0: [ AH],[ 2H],[ 3H]
  F1: [ AS],[ 2S],[ 3S],[ 4S]
  F2: [ AD],[ 2D],[ 3D]
  F3: [ AC],[ 2C],[ 3C],[ 4C]

  T0:
  T1: (???),[10H]
  T2: (???),(???),[ KD]
  T3: (???),(???),(???),[ 5C]
  T4: (???),(???),(???),(???),[ JH]
  T5: (???),(???),(???),(???),(???),[ 5D]
  T6: (???),(???),(???),(???),(???),( KS),[ 6H]`;

const allButLastKing = `
    ST:
    WA:

    F0: [ AH],[ 2H],[ 3H],[ 4H],[ 5H],[ 6H],[ 7H],[ 8H],[ 9H],[ 10H],[ JH],[ QH],[ KH]
    F1: [ AS],[ 2S],[ 3S],[ 4S],[ 5S],[ 6S],[ 7S],[ 8S],[ 9S],[ 10S],[ JS],[ QS]
    F2: [ AD],[ 2D],[ 3D],[ 4D],[ 5D],[ 6D],[ 7D],[ 8D],[ 9D],[ 10D],[ JD],[ QD],[ KD]
    F3: [ AC],[ 2C],[ 3C],[ 4C],[ 5C],[ 6C],[ 7C],[ 8C],[ 9C],[ 10C],[ JC],[ QC],[ KC]

    T0: [ KS]
    T1:
    T2:
    T3:
    T4:
    T5:
    T6: `;

//   // get another known gameState
//   var testState3 = Mockdike.createGame(
//     ' AC| AD| AH|   |   |   |   |' +
//       ' 2C| 2D| 2H| AS|   |   |   |' +
//       ' 3C| 3D| 3H| 2S|   |   |   |' +
//       ' 4C| 4D| 4H| 3S|   |   |   |' +
//       ' 5C| 5D| 5H| 4S|   |   |   |' +
//       ' 6C| 6D| 6H| 5S|   |   |   |' +
//       ' 7C| 7D| 7H| 6S|   |   |   |' +
//       ' 8C| 8D| 8H| 7S|   |   |   |' +
//       ' 9C| 9D| 9H| 8S|   |   |   |' +
//       '10C|10D|10H| 9S|   |   |   |' +
//       ' JC| JD| JH|10S|   |   |   |' +
//       ' QC| QD| QH| JS|   |   |   |' +
//       ' KC| KD| KH| QS|   | []| []|' +
//       '---------------------------|' +
//       ' KS| []| []| []| []| []| []|',
//     1
//   );
//
