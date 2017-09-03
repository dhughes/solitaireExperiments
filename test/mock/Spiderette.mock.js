const Spiderette = require('../../Spiderette');
const Deck = require('../../Deck');
const Card = require('../../Card');

Mockette = {};

Mockette.createGame = function(game, drawCount) {
  // create a placeholder for a game
  var gameState = Spiderette.newGameState(drawCount);

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

  piles.foundation.resetFrom(game.FO);

  piles.tableaux[0].resetFrom(game.T0);
  piles.tableaux[1].resetFrom(game.T1);
  piles.tableaux[2].resetFrom(game.T2);
  piles.tableaux[3].resetFrom(game.T3);
  piles.tableaux[4].resetFrom(game.T4);
  piles.tableaux[5].resetFrom(game.T5);
  piles.tableaux[6].resetFrom(game.T6);

  // set the calculated values in the gameState
  Spiderette.updateState(gameState);

  return gameState;
};

module.exports = Mockette;
