require('./Util');
const Deck = require('./Deck');
const Card = require('./Card');

/**
 * Spiderette is an object that can create and manipulate Spiderette game states.
 * @type {Object}
 */
Spiderette = {};

Spiderette.automaticallyCreateStringRepresentation = false;

/**
 * Creates a new, virginal, gameState
 * @return {Object} The new gameState
 */
Spiderette.newGameState = function() {
  // create the game state
  let data = Uint8Array.ofSize(412).map(i => -1);
  let piles = Spiderette.getPiles(data);
  let gameState = {
    data: data, // 52 + (48*7) + 24
    piles: piles,
    pileLengths: {
      foundation: 0,
      tableaux: Uint8Array.ofSize(7).map(i => 0),
      stock: 0
    },
    stateScore: 0,
    stringRepresentation: '',
    hash: 0,
    won: false
  };

  Spiderette.updatePileLengths(gameState);

  return gameState;
};

/**
 * Creates and deals a new game
 * @param drawCount
 */

Spiderette.newGame = function() {
  // create and shuffle a new deck
  let cards = Deck.shuffle(Deck.newDeck());

  // create the game state
  let gameState = Spiderette.newGameState();

  // figure out what piles we've got
  let piles = gameState.piles;

  // deal the game out

  // populate the Tableau columns
  let i = -1;
  for (let r = 0; r < 7; r++) {
    for (let t = 0 + r; t < 7; t++) {
      i++;
      piles.tableaux[t][r] = cards[i];
      if (r === t) {
        piles.tableaux[t][r] = Card.flip(piles.tableaux[t][r]);
      }
    }
  }

  // stock the stock
  piles.stock.set(cards.subarray(28, 52));

  // set the calculated values in the gameState
  Spiderette.updateState(gameState);

  // return the gameState (this can be worked with by any function on this Spiderette object.
  return gameState;
};

/**
 * Creates a set of subarrays within the game state.cards element for each pile
 * @param gameState
 * @returns {Object} Object with elements (all arrays): foundation0, foundation1, foundation2, foundation3, tableau0, tableau1, tableau2, tableau3, tableau4, tableau5, tableau6, waste, stock
 */
Spiderette.getPiles = function(data) {
  return {
    foundation: data.subarray(0, 52), // 52
    tableaux: Spiderette.getTableaux(data), // 48 * 7
    stock: data.subarray(388, 412) // 24
  };
};

/**
 * Gets the tableaux from the game
 * @param  {Object} gameState The gameState to get the tableaux from
 * @return {Array} The array of tableaux
 */
Spiderette.getTableaux = function(data) {
  return [
    data.subarray(52, 100), // 48
    data.subarray(100, 148), // 48
    data.subarray(148, 196), // 48
    data.subarray(196, 244), // 48
    data.subarray(244, 292), // 48
    data.subarray(292, 340), // 48
    data.subarray(340, 388) // 48
  ];
};

/**
 * Updates the lengths of piles in the provided gameState
 * @param {Object} gameState The gameState containing the piles
 * @param {Array} specificPiles This is an array of specific piles to update. Each element is an object consisting of {pile, index}.
 */
Spiderette.updatePileLengths = function(gameState, specificPiles) {
  let piles = gameState.piles;

  if (specificPiles !== undefined) {
    // only update specific piles
    for (let i = 0; i < specificPiles.length; i++) {
      if (specificPiles[i].index !== undefined) {
        gameState.pileLengths[specificPiles[i].pile][specificPiles[i].index] = gameState.piles[specificPiles[i].pile][
          specificPiles[i].index
        ].len();
      } else if (specificPiles[i].pile === 'tableaux' && !specificPiles[i].index) {
        // we need to update all tableaux lengths
        gameState.piles.tableaux.forEach((tableaux, t) => {
          gameState.pileLengths.tableaux[t] = tableaux.len();
        });
      } else {
        gameState.pileLengths[specificPiles[i].pile] = gameState.piles[specificPiles[i].pile].len();
      }
    }
  } else {
    // update all piles
    gameState.pileLengths.foundation = piles.foundation.len();

    gameState.pileLengths.tableaux[0] = piles.tableaux[0].len();
    gameState.pileLengths.tableaux[1] = piles.tableaux[1].len();
    gameState.pileLengths.tableaux[2] = piles.tableaux[2].len();
    gameState.pileLengths.tableaux[3] = piles.tableaux[3].len();
    gameState.pileLengths.tableaux[4] = piles.tableaux[4].len();
    gameState.pileLengths.tableaux[5] = piles.tableaux[5].len();
    gameState.pileLengths.tableaux[6] = piles.tableaux[6].len();

    gameState.pileLengths.stock = piles.stock.len();
  }
};

/**
 * This is a convenience function to refesh all calculated values in a gamestate
 * @param gameState
 */
Spiderette.updateState = function(gameState, specificPiles) {
  // update the pile lengths
  Spiderette.updatePileLengths(gameState, specificPiles);

  // update the score
  Spiderette.updateScore(gameState);

  // generate the string representation of this state
  if (Spiderette.automaticallyCreateStringRepresentation) {
    Spiderette.setStringRepresentation(gameState);
  }

  // set the game's hash
  Spiderette.setHash(gameState);
};

/**
 * Updates the score in the gameState
 * @param {Object} gameState The gameState to update.
 */
Spiderette.updateScore = function(gameState) {
  gameState.stateScore = 0;

  // get the piles
  let piles = gameState.piles;
  let pileLengths = gameState.pileLengths;

  // todo: count every card build sequentialy downward
  // tell if we're making good progress in the game

  // add the foundations into the score
  gameState.stateScore += pileLengths.foundation * 4;

  // determine the score for each tableau
  for (t = 0; t < piles.tableaux.length; t++) {
    let pile = piles.tableaux[t];
    // loop backwards over this foundation until we find a card that's not face up
    for (let c = pile.len() - 2; c >= 0 && Card.isFaceUp(pile[c]); c--) {
      let card = pile[c];

      if (Card.numericValue(card) === Card.numericValue(pile[c + 1]) + 1) {
        gameState.stateScore += 2;
      }

      if (Card.numericSuit(card) === Card.numericSuit(pile[c + 1])) {
        gameState.stateScore += 2;
      }
    }
  }

  // check if we won!
  if (gameState.stateScore === 208) {
    gameState.won = true;
  } else {
    gameState.won = false;
  }
};

/**
 * Sets the hash value of a given gameState
 * @param {Object} gameState the gameState
 */
Spiderette.setHash = function(gameState) {
  gameState.hash = 0;

  for (let i = 0; i < gameState.data.length; i++) {
    //console.log(i + " / " + gameState.data[i]);
    if (gameState.data[i] !== 255) {
      let val = ((gameState.data[i] * (i + 1)) << i) + i;
      gameState.hash += val;
      //console.log("   " + val + " = " + gameState.hash);

      //console.log("   " + (i << 8) + gameState.data[i]);
      //gameState.hash += ((i << 8) + gameState.data[i]);
    }
  }
};

/**
 * Creates the string representation of a game state
 * @param {Object} gameState The gameState to update
 */
Spiderette.setStringRepresentation = function(gameState) {
  let text = '';
  const piles = gameState.piles;
  const pileLengths = gameState.pileLengths;
  let i;

  gameState.stringRepresentation = `
    ST: ${Array.from(piles.stock.filter(card => card !== 255)).map(card => Card.asString(card)).join(',')}

    FO: ${Array.from(piles.foundation.filter(card => card !== 255)).map(card => Card.asString(card)).join(',')}

    T0: ${Array.from(piles.tableaux[0].filter(card => card !== 255)).map(card => Card.asString(card)).join(',')}
    T1: ${Array.from(piles.tableaux[1].filter(card => card !== 255)).map(card => Card.asString(card)).join(',')}
    T2: ${Array.from(piles.tableaux[2].filter(card => card !== 255)).map(card => Card.asString(card)).join(',')}
    T3: ${Array.from(piles.tableaux[3].filter(card => card !== 255)).map(card => Card.asString(card)).join(',')}
    T4: ${Array.from(piles.tableaux[4].filter(card => card !== 255)).map(card => Card.asString(card)).join(',')}
    T5: ${Array.from(piles.tableaux[5].filter(card => card !== 255)).map(card => Card.asString(card)).join(',')}
    T6: ${Array.from(piles.tableaux[6].filter(card => card !== 255)).map(card => Card.asString(card)).join(',')}
  `
    .split('\n')
    .map(line => line.trim())
    .join('\n');
};

/**
 * A convenience method to get a string representation for a given gameState
 * @param  {[type]} gameState [description]
 * @return {[type]}           [description]
 */
Spiderette.asString = function(gameState) {
  Spiderette.setStringRepresentation(gameState);
  return gameState.stringRepresentation;
};

/**
 * Makes a move as specified by the move object.  If this move wins the game the won attribute is set to true!
 * @param {Object} move The move to make.
 */
Spiderette.doMove = function(gameState, move) {
  // default the count, if need be
  move.count = move.count || 1;

  // get the piles from the gameState
  let piles = gameState.piles;
  let pileLengths = gameState.pileLengths;

  let from = piles[move.from];
  let fromLen = pileLengths[move.from];

  if (move.fromIndex !== undefined) {
    from = from[move.fromIndex];
    fromLen = fromLen[move.fromIndex];
  }

  let to = piles[move.to];
  if (move.toIndex !== undefined) {
    to = to[move.toIndex];
  }

  // figure out the index of what we're moving
  let start = fromLen - move.count;
  let end = fromLen;
  let i, card;

  // if we're moving to or from the stock we need to loop backwards, otherwise we loop forward and move the cards to the to pile
  if (move.from === 'stock') {
    // loop backwards
    let tableau = 0;
    for (i = end - 1; from[i] && i >= end - 7 && i !== 255; i--) {
      // remove the card
      card = from[i];
      from[i] = 255;
      // flip this card to the target
      if (card !== 255) {
        to[tableau++].push(Card.flip(card));
        //console.log(i + ": " + card + "/" + Card.asString(card !== 255 && Card.isFaceUp(card) ? card : Card.flip(card)));
      }
    }
  } else {
    // loop forward
    for (i = start; i < end; i++) {
      // remove the card
      card = from[i];
      from[i] = 255;
      // add this card to the target
      to.push(card);
      //console.log(i + ": " + Card.asString(card));
    }

    // make sure the exposed card is face up
    card = from[fromLen - move.count - 1];
    if (card !== 255 && !Card.isFaceUp(card)) {
      from[fromLen - move.count - 1] = Card.flip(card);
    }
  }

  // update the game's state
  Spiderette.updateState(gameState, [
    { pile: move.from, index: move.fromIndex },
    { pile: move.to, index: move.toIndex }
  ]);

  //console.log(gameState.stringRepresentation.indent(1));
};

module.exports = Spiderette;
