const Klondike = require('../../Klondike');
const Deck = require('../../Deck');
const Card = require('../../Card');

Mockdike = {};

Mockdike.createGame = function(game, drawCount) {
  // create a placeholder for a game
  var gameState = Klondike.newGameState(drawCount);

  // break the game up by lines
  game = game.split('\n').reduce((acc, line) => {
    const keyValues = line.split(':');
    const key = keyValues[0].trim();

    if (key)
      acc[key] = Uint8Array.from(
        keyValues[1].trim().split(',').filter(card => card !== '').map(card => Card.fromString(card))
      );
    return acc;
  }, {});

  // get the piles in the game
  var piles = gameState.piles;

  piles.stock.resetFrom(game.ST);
  piles.waste.resetFrom(game.WA);

  piles.foundations[0].resetFrom(game.F0);
  piles.foundations[1].resetFrom(game.F1);
  piles.foundations[2].resetFrom(game.F2);
  piles.foundations[3].resetFrom(game.F3);

  piles.tableaux[0].resetFrom(game.T0);
  piles.tableaux[1].resetFrom(game.T1);
  piles.tableaux[2].resetFrom(game.T2);
  piles.tableaux[3].resetFrom(game.T3);
  piles.tableaux[4].resetFrom(game.T4);
  piles.tableaux[5].resetFrom(game.T5);
  piles.tableaux[6].resetFrom(game.T6);

  // set the calculated values in the gameState
  Klondike.updateState(gameState);

  return gameState;
};

module.exports = Mockdike;
