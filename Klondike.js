require('./Util');
const Deck = require('./Deck');
const Card = require('./Card');

/**
 * Klondike is an object that can create and manipulate klondike game states.
 * @type {Object}
 */
Klondike = {};

Klondike.automaticallyCreateStringRepresentation = false;

/**
 * Creates a new, virginal, gameState
 * @return {Object} The new gameState
 */
Klondike.newGameState = function(drawCount) {
  // create the game state
  let data = Uint8Array.ofSize(212).map(i => -1);
  let piles = Klondike.getPiles(data);
  let gameState = {
    data: data, // 13+13+13+13 + 13+14+15+16+17+18+19 + 24 + 24
    piles: piles,
    pileLengths: {
      foundations: Uint8Array.ofSize(4).map(i => -1),
      tableaux: Uint8Array.ofSize(7).map(i => -1),
      waste: 0,
      stock: 0
    },
    drawCount: drawCount,
    stateScore: 0,
    stringRepresentation: '',
    foundationSuits: undefined,
    lowestFoundationValue: 0,
    hash: 0,
    won: false
  };

  Klondike.updatePileLengths(gameState);

  return gameState;
};

/**
 * Creates and deals a new game
 * @param drawCount
 */
Klondike.newGame = function(drawCount) {
  // create and shuffle a new deck
  let cards = Deck.shuffle(Deck.newDeck());

  // create the game state
  let gameState = Klondike.newGameState(drawCount);

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

  //console.log(Card.asString(cards[i]));

  // stock the stock
  piles.stock.set(cards.subarray(28, 52 - drawCount));

  // todo: I may want to factor this out into its own function so I can reuse the code for drawing
  // set the waste
  i = -1;
  for (let c = cards.length - 1; c > cards.length - 1 - drawCount; c--) {
    i++;
    piles.waste[i] = Card.flip(cards[c]);
  }

  // set the calculated values in the gameState
  Klondike.updateState(gameState);

  // return the gameState (this can be worked with by any function on this Klondike object.
  return gameState;
};

/**
 * Makes a move as specified by the move object.  If this move wins the game the won attribute is set to true!
 * @param {Object} move The move to make.
 */
Klondike.doMove = function(gameState, move) {
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
  if (move.from === 'stock' || move.to === 'stock') {
    // loop backwards
    for (i = end - 1; i >= start && i !== 255; i--) {
      // remove the card
      card = from[i];
      from[i] = 255;
      // flip this card to the target
      if (card !== 255) {
        to.push(Card.flip(card));
        //console.log(i + ": " + card + "/" + Card.asString(card !== 255 && Card.isFaceUp(card) ? card : Card.flip(card)));
      }
    }
  } else {
    // loop forwards
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
  Klondike.updateState(gameState, [{ pile: move.from, index: move.fromIndex }, { pile: move.to, index: move.toIndex }]);

  //console.log(gameState.stringRepresentation.indent(1));
};

/**
 * This is a convenience function to refesh all calculated values in a gamestate
 * @param gameState
 */
Klondike.updateState = function(gameState, specificPiles) {
  // update the pile lengths
  Klondike.updatePileLengths(gameState, specificPiles);

  // update the score
  Klondike.updateScore(gameState);

  // generate the string representation of this state
  if (Klondike.automaticallyCreateStringRepresentation) {
    Klondike.setStringRepresentation(gameState);
  }

  // populate the set of foundation suits
  Klondike.setFoundationSuits(gameState);

  // find the lowest foundation value
  Klondike.setLowestFoundationValue(gameState);

  // set the game's hash
  Klondike.setHash(gameState);
};

/**
 * Updates the score in the gameState
 * @param {Object} gameState The gameState to update.
 */
Klondike.updateScore = function(gameState) {
  gameState.stateScore = 0;

  // get the piles
  let piles = gameState.piles;
  let pileLengths = gameState.pileLengths;

  // add the foundations into the score
  for (let f = 0; f < piles.foundations.length; f++) {
    gameState.stateScore += pileLengths.foundations[f] * 2;
  }

  // add the tableaux into the score
  for (t = 0; t < piles.tableaux.length; t++) {
    // loop backwards over this foundation until we find a card that's not face up
    for (let c = piles.tableaux[t].length - 1; c !== 255; c--) {
      let card = piles.tableaux[t][c];
      if (card !== 255) {
        if (Card.isFaceUp(card)) {
          gameState.stateScore++;
        } else {
          break;
        }
      }
    }
  }

  // add the the waste
  if (pileLengths.waste) {
    gameState.stateScore++;
  }

  // check if we won!
  if (gameState.stateScore === 104) {
    gameState.won = true;
  } else {
    gameState.won = false;
  }
};

/**
 * Creates the string representation of a game state
 * @param {Object} gameState The gameState to update
 */
Klondike.setStringRepresentation = function(gameState) {
  let text = '';
  const piles = gameState.piles;
  const pileLengths = gameState.pileLengths;
  let i;

  gameState.stringRepresentation = `
    ST: ${Array.from(piles.stock.filter(card => card !== 255)).map(card => Card.asString(card)).join(',')}
    WA: ${Array.from(piles.waste.filter(card => card !== 255)).map(card => Card.asString(card)).join(',')}

    F0: ${Array.from(piles.foundations[0].filter(card => card !== 255)).map(card => Card.asString(card)).join(',')}
    F1: ${Array.from(piles.foundations[1].filter(card => card !== 255)).map(card => Card.asString(card)).join(',')}
    F2: ${Array.from(piles.foundations[2].filter(card => card !== 255)).map(card => Card.asString(card)).join(',')}
    F3: ${Array.from(piles.foundations[3].filter(card => card !== 255)).map(card => Card.asString(card)).join(',')}

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
 * Updates the lengths of piles in the provided gameState
 * @param {Object} gameState The gameSthat containing the piles
 * @param {Array} specificPiles This is an array of specific piles to update. Each element is an object consisting of {pile, index}.
 */
Klondike.updatePileLengths = function(gameState, specificPiles) {
  let piles = gameState.piles;

  if (specificPiles !== undefined) {
    // only update specific piles
    for (let i = 0; i < specificPiles.length; i++) {
      if (specificPiles[i].index !== undefined) {
        gameState.pileLengths[specificPiles[i].pile][specificPiles[i].index] = gameState.piles[specificPiles[i].pile][
          specificPiles[i].index
        ].len();
      } else {
        gameState.pileLengths[specificPiles[i].pile] = gameState.piles[specificPiles[i].pile].len();
      }
    }
  } else {
    // update all piles
    gameState.pileLengths.foundations[0] = piles.foundations[0].len();
    gameState.pileLengths.foundations[1] = piles.foundations[1].len();
    gameState.pileLengths.foundations[2] = piles.foundations[2].len();
    gameState.pileLengths.foundations[3] = piles.foundations[3].len();

    gameState.pileLengths.tableaux[0] = piles.tableaux[0].len();
    gameState.pileLengths.tableaux[1] = piles.tableaux[1].len();
    gameState.pileLengths.tableaux[2] = piles.tableaux[2].len();
    gameState.pileLengths.tableaux[3] = piles.tableaux[3].len();
    gameState.pileLengths.tableaux[4] = piles.tableaux[4].len();
    gameState.pileLengths.tableaux[5] = piles.tableaux[5].len();
    gameState.pileLengths.tableaux[6] = piles.tableaux[6].len();

    gameState.pileLengths.waste = piles.waste.len();
    gameState.pileLengths.stock = piles.stock.len();
  }
};

/**
 * Creates a set of subarrays within the game state.cards element for each pile
 * @param gameState
 * @returns {Object} Object with elements (all arrays): foundation0, foundation1, foundation2, foundation3, tableau0, tableau1, tableau2, tableau3, tableau4, tableau5, tableau6, waste, stock
 */
Klondike.getPiles = function(data) {
  return {
    foundations: Klondike.getFoundations(data),
    tableaux: Klondike.getTableaux(data),
    waste: data.subarray(164, 188), // 24
    stock: data.subarray(188, 212) // 24
  };
};

/**
 * Gets the foundations from the game
 * @param {Object} gameState The gameState to get the foundations from
 * @return {Array} The array of Foundations
 */
Klondike.getFoundations = function(data) {
  return [
    data.subarray(0, 13), // 13
    data.subarray(13, 26), // 13
    data.subarray(26, 39), // 13
    data.subarray(39, 52) // 13
  ];
};

/**
 * Gets the tableaux from the game
 * @param  {Object} gameState The gameState to get the tableaux from
 * @return {Array} The array of tableaux
 */
Klondike.getTableaux = function(data) {
  return [
    data.subarray(52, 65), // 13
    data.subarray(65, 79), // 14
    data.subarray(79, 94), // 15
    data.subarray(94, 110), // 16
    data.subarray(110, 127), // 17
    data.subarray(127, 145), // 18
    data.subarray(145, 164) // 19
  ];
};

/**
 * Sets the lowest foundation value into the gameState.
 * @param {Object} gameState The gameState
 */
Klondike.setLowestFoundationValue = function(gameState) {
  // get the foundations we're working with
  let foundations = gameState.piles.foundations;
  let foundationLengths = gameState.pileLengths.foundations;

  // record the lowest foundation value
  let lowestFoundationValue = 13;

  for (let f = 0; f < foundations.length; f++) {
    /*console.log("foundationLengths " + f + ": " + foundationLengths[f]);
		console.log("foundation.len() " + f + ": " + foundations[f].len());
		console.log(foundations[f].asString());*/
    if (foundationLengths[f] < lowestFoundationValue) {
      lowestFoundationValue = foundationLengths[f];
    }

    // if we find an empty foundation we're done.
    if (!lowestFoundationValue) {
      break;
    }
  }

  gameState.lowestFoundationValue = lowestFoundationValue;
};

/**
 * Sets the hash value of a given gameState
 * @param {Object} gameState the gameState
 */
Klondike.setHash = function(gameState) {
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
 * Sets the suits for the foundations based on what's in them already and what we expect.
 * @param {Uint8Array} gameState the gameState
 */
Klondike.setFoundationSuits = function(gameState) {
  // default order is: c d h s
  let suits = Uint8Array.ofSize(4);
  suits[0] = 0;
  suits[1] = 1;
  suits[2] = 2;
  suits[3] = 3;

  // set the default order
  let order = suits;

  // get the foundations we're working with
  let foundations = gameState.piles.foundations;

  let swap = function(arr, val1, val2) {
    let pos1 = -1;
    let pos2 = -1;

    for (let x = 0; x < arr.length; x++) {
      if (arr[x] === val1) {
        pos1 = x;
      }
      if (arr[x] === val2) {
        pos2 = x;
      }
      if (pos1 !== -1 && pos2 !== -1) {
        break;
      }
    }

    let temp = arr[pos1];
    arr[pos1] = arr[pos2];
    arr[pos2] = temp;
  };

  // loop over the foundations and see what card we actually have in each (if any)
  for (let i = 0; i < foundations.length; i++) {
    if (foundations[i][0] !== 255) {
      let suit = Card.numericSuit(foundations[i][0]);
      swap(order, suit, suits[i]);
    }
  }

  gameState.foundationSuits = order;
};

module.exports = Klondike;
