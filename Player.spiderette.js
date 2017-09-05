const buckets = require('buckets-js');
const Card = require('./Card');
const Spiderette = require('./Spiderette');

/**
 * Player is an object that can identify possible moves and automatically play
 * a game state to a win or loss.
 * @type {Object}
 */
Player = {};

/**
 * This is the number of moves this player has made so far.
 * @type {Number}
 */
Player.moves = null;
Player.priorities = null;
Player.maxMoves = 5000;

/**
 * This is an object that holds states as they are created.  Don't update directly, please!
 * @type {Object}
 */
Player.savedStates = {};

/**
 * Takes a given game state and saves a deep copy of it.
 * @param {Object} gameState The game state to save
 */
Player.saveState = function(gameState) {
  //console.log("saving state for hash: " + gameState.hash);
  if (Player.savedStates[gameState.hash] === undefined) {
    var data = new Uint8Array(gameState.data.length);
    data.set(gameState.data);

    var tableauxLengths = new Uint8Array(7);
    tableauxLengths.set(gameState.pileLengths.tableaux);

    Player.savedStates[gameState.hash] = {
      data: data,
      pileLengths: {
        foundation: gameState.pileLengths.foundation,
        tableaux: tableauxLengths,
        stock: gameState.pileLengths.stock
      },
      identifiedMoves: 0,
      testedMoves: 0,
      stateScore: gameState.stateScore,
      stringRepresentation: gameState.stringRepresentation,
      hash: gameState.hash,
      won: gameState.won
    };
  }
};

/**
 * Returns a COPY of the gameState identified by the hash
 * @param {int} hash The hash to lookup the state by
 * @return {Object} The gameState that is returned
 */
Player.getState = function(hash) {
  var data = new Uint8Array(Player.savedStates[hash].data.length);
  data.set(Player.savedStates[hash].data);

  var tableauxLengths = new Uint8Array(7);
  tableauxLengths.set(Player.savedStates[hash].pileLengths.tableaux);

  return {
    data: data,
    piles: Spiderette.getPiles(data),
    pileLengths: {
      foundation: Player.savedStates[hash].pileLengths.foundation,
      tableaux: tableauxLengths,
      stock: Player.savedStates[hash].pileLengths.stock
    },
    identifiedMoves: Player.savedStates[hash].identifiedMoves,
    testedMoves: Player.savedStates[hash].testedMoves,
    stateScore: Player.savedStates[hash].stateScore,
    stringRepresentation: Player.savedStates[hash].stringRepresentation,
    hash: Player.savedStates[hash].hash,
    won: Player.savedStates[hash].won
  };
};

/**
 * Creates an empty priority queue we can use to store our game states
 * @return {buckets.PriorityQueue}
 */

Player.createPriorityQueue = function() {
  return new buckets.PriorityQueue(function(a, b) {
    if (a.stateScore + a.moveScore <= b.stateScore + b.moveScore) {
      return -1;
    } else if (a.stateScore + a.moveScore > b.stateScore + b.moveScore) {
      return 1;
    } else {
      return 0; // I don't think we can actually reach this.
    }
  });
};

/**
 * Attempts to determine if the game is winnable by brute-force playing the game to win.
 * @param {Function} callback The function to call once we know if the game is winnable or not
 */
Player.isWinnable = function(gameState, callback) {
  Player.savedStates = {};
  Player.priorities = Player.createPriorityQueue();

  // this function identifies moves
  Player.identifyMoves(gameState, Player.priorities);

  for (Player.moves = 0; Player.moves < Player.maxMoves && Player.priorities.size() > 0; Player.moves++) {
    //console.log(Player.moves);

    var move = Player.priorities.dequeue();

    // get the game state this move is for
    gameState = Player.getState(move.hash);

    // In the interest of controlling memory usage, we're tracking the number of tested moves vs. possible moves for a gamestate
    // since the gamestate is updated by the move, we're pre-incrementing this.
    Player.savedStates[move.hash].testedMoves++;

    // have we made all the possible moves for this gamestate?
    if (Player.savedStates[move.hash].identifiedMoves === Player.savedStates[move.hash].testedMoves) {
      // if so, nullify the gamestate in the cache. since we're nulling it, the player will see that it's already tested the move.
      //console.log("nullifying state in cache");
      Player.savedStates[move.hash] = null;
    }
    //
    // let log = '------------------------\n';
    // log += 'Before Hash: ' + gameState.hash + '\n';
    // log += 'Before State Score: ' + gameState.stateScore + '\n';
    // log += 'Move Score: ' + move.moveScore + '\n';
    // log += 'Total Score: ' + (gameState.stateScore + move.moveScore) + '\n';
    // log += Spiderette.asString(gameState);
    // log += '\n';

    // to do this move on the specified state!  This will update the gameState.
    //let oldHash = gameState.hash;
    Spiderette.doMove(gameState, move);
    //gameState.previousState = oldHash;

    // log += Spiderette.asString(gameState);
    // log += '\nAfter Hash: ' + gameState.hash;
    // log += '\nAfter State Score: ' + gameState.stateScore + '\n';
    // console.log(log);

    // did we win?
    if (gameState.won) {
      callback(true, Player.moves, gameStte);
      return;
    }

    //console.log(gameState.hash);

    // have we seen this gameState before?
    if (Player.savedStates[gameState.hash] === undefined) {
      // no, this is a new state to us!

      // identify moves from this state.
      Player.identifyMoves(gameState, Player.priorities);
    }
  }

  // there's no winning this game :(
  callback(false, Player.moves, gameState);
};

/**
 * Inspects a game state and determines what moves are possible.
 * @param {Object} gameState
 * @param {Object} collection A collection object (with add() method) that will receive all of the possible moves we identify
 */
Player.identifyMoves = function(gameState, collection) {
  Player.saveState(gameState);

  // get our piles
  let piles = gameState.piles;
  let pileLengths = gameState.pileLengths;

  let card, bonus, from, fromLen, f, to, toLen, t, cardColor, cardNumericValue, cardNumericSuit;
  let identifiedMoves = 0;

  //**** Forced Full Stack to Foundation ****//
  // If we have a full stack of a specific suit, we must move this card and
  // skip all other moves.

  // loop over each tableau and look for ones ending in Ace
  checkForFullStacks: for (f = 0; f < piles.tableaux.length; f++) {
    from = piles.tableaux[f];
    fromLen = pileLengths.tableaux[f];

    // get the last card
    card = from[fromLen - 1];

    // if the last card in the tableau is not Ace, then this is not a full stack
    // if the pile is not at least 13 cards then this is not a full stack
    if (fromLen < 13 || Card.numericValue(card) !== 1) {
      continue;
    }

    // we found a candidate ace. now we need to check to see if there's a complete sequence
    // loop backwards from the ace up to 13 cards and check to see if each has an the next
    // value and the same suit
    cardNumericSuit = Card.numericSuit(card);

    let expected = 2;
    for (let c = fromLen - 2; c >= fromLen - 13; c--) {
      // if the card isn't the same suit or sequential then we're done
      if (Card.numericSuit(from[c]) !== cardNumericSuit || Card.numericValue(from[c]) !== expected) {
        continue checkForFullStacks;
      }
      expected++;
    }

    collection.add({
      stateScore: gameState.stateScore,
      moveScore: 50,
      from: 'tableaux',
      fromIndex: f,
      to: 'foundation',
      hash: gameState.hash
    });
    identifiedMoves++;
    return; // note, once we find a stack that needs to go to the foundation, do no more.  If there are more, we'll find them in the next test.
  }

  //**** Tableau To Tableau ****//
  // I need to loop over the tableaux and see if any card in the tableau can be moved to any other tableau

  // we're going to first identify cards and stacks that we can potentially move
  let potentialMoves = [];

  // loop over each tableau to determine what we can move _from_
  for (f = 0; f < piles.tableaux.length; f++) {
    from = piles.tableaux[f];
    fromLen = pileLengths.tableaux[f];

    // loop backwards over the cards in this tableau and identify potential stacks to move
    let pushedPotentialMove = false;
    for (
      var c = fromLen - 1;
      c !== 255 && Card.isFaceUp(from[c]) && (c === fromLen - 1 || Card.numericValue(from[c]) === cardNumericValue + 1);
      c--
    ) {
      // get this card
      card = from[c];

      // get this card's numeric suit and value
      cardNumericSuit = Card.numericSuit(card);
      cardNumericValue = Card.numericValue(card);

      // create an object for this potential move
      let potentialMove = {
        from: 'tableaux',
        fromIndex: f,
        card,
        cardIndex: c,
        complete: false
      };

      // is the starting card? if so, it's individual by fiat
      if (c === fromLen - 1) {
        potentialMove.fromType = 'individual';
      } else {
        // is this a sequential suit stack?
        let previousPotentialMove = potentialMoves[potentialMoves.length - 1];
        if (
          (previousPotentialMove.fromType === 'individual' || previousPotentialMove.fromType === 'sequential-suit') &&
          Card.numericSuit(previousPotentialMove.card) === Card.numericSuit(card) &&
          Card.numericValue(previousPotentialMove.card) + 1 === Card.numericValue(card)
        ) {
          // this is a sequential-suit stack
          potentialMove.fromType = 'sequential-suit';
        } else {
          potentialMove.fromType = 'sequential';
        }
      }

      // add this potential move to the set of potentialMoves
      potentialMoves.push(potentialMove);
      pushedPotentialMove = true;
    }

    // mark the last potential move as being complete (IE: the entire stack or individual card)
    if (pushedPotentialMove) {
      potentialMoves[potentialMoves.length - 1].complete = true;
    }
  }

  // find the first empty tableau
  let firstEmptyTableau = piles.tableaux.reduce(
    (acc, tableau, i) => (acc ? acc : tableau.len() === 0 ? i : null),
    null
  );

  // determine if the stock is empty
  let stockIsEmpty = pileLengths.stock === 0;

  // now, let's find places where we can actually move the potential moves
  for (let potentialMove of potentialMoves) {
    // find the card we're trying to MOVE
    from = piles.tableaux[potentialMove.fromIndex];
    card = from[potentialMove.cardIndex];

    // find potential matches for this card
    for (t = 0; t < piles.tableaux.length; t++) {
      // don't try moving to the same tableau
      if (potentialMove.fromIndex == t) continue;

      // create an object to hold this move (based off the potentialMove)
      let thisMove = Object.assign({}, potentialMove);

      // get a handle on the target pile and its last card
      to = piles.tableaux[t];
      toLen = pileLengths.tableaux[t];
      lastCard = to[to.len() - 1];

      // is the target tableau empty?
      if (toLen === 0) {
        // is the stock empty? is this NOT the first empty tableau? if so, skip outta here
        if (stockIsEmpty && t !== firstEmptyTableau) continue;

        // this is a legal move to an empty tableau
        thisMove.toType = 'empty';
      } else {
        // would this be a sequential move? if not, skip outta here!
        if (Card.numericValue(lastCard) !== Card.numericValue(potentialMove.card) + 1) continue;

        if (Card.numericSuit(lastCard) === Card.numericSuit(potentialMove.card)) {
          thisMove.toType = 'sequential-suit';
        } else {
          thisMove.toType = 'sequential';
        }
      }

      thisMove.to = 'tableaux';
      thisMove.toIndex = t;

      Player.scoreTableauxMove(thisMove);

      collection.add(Object.assign({}, thisMove, { stateScore: gameState.stateScore, hash: gameState.hash }));
    }
  }

  // draw from stock, so long as there are no empty tableau
  if (pileLengths.stock && piles.tableaux.filter(pile => pile.len() === 0).length === 0) {
    collection.add({
      stateScore: gameState.stateScore,
      moveScore: 4,
      from: 'stock',
      to: 'tableaux',
      hash: gameState.hash
    });
  }
};

Player.scoreTableauxMove = function(move) {
  let { complete, fromType, toType, cardIndex } = move;

  if (complete && fromType === 'sequential-suit' && toType === 'sequential-suit' && cardIndex === 0) {
    // full sequential-suit to sequential-suit from zero index
    move.moveScore = 20;
  } else if (complete && fromType === 'sequential-suit' && toType === 'sequential-suit' && cardIndex !== 0) {
    // full sequential-suit to sequential-suit not from zero index
    move.moveScore = 19;
  } else if (complete && fromType === 'sequential' && toType === 'sequential-suit' && cardIndex === 0) {
    // full sequential to sequential-suit from zero index
    move.moveScore = 18;
  } else if (complete && fromType === 'sequential' && toType === 'sequential-suit' && cardIndex !== 0) {
    // full sequential to sequential-suit not from zero index
    move.moveScore = 17;
  } else if (complete && fromType === 'sequential' && toType === 'sequential' && cardIndex === 0) {
    // full sequential to sequential from zero index
    move.moveScore = 16;
  } else if (complete && fromType === 'sequential' && toType === 'sequential' && cardIndex !== 0) {
    // full sequential to sequential not from zero index
    move.moveScore = 15;
  } else if (complete && fromType === 'sequential-suit' && toType === 'empty' && cardIndex !== 0) {
    // full sequential-suit to empty tableau not from zero index
    move.moveScore = 14;
  } else if (complete && fromType === 'sequential' && toType === 'empty' && cardIndex !== 0) {
    // full sequential to empty tableau not from zero index
    move.moveScore = 13;
  } else if (complete && fromType === 'individual' && toType === 'sequential-suit' && cardIndex === 0) {
    // lone individual to sequential-suit from zero index
    move.moveScore = 12;
  } else if (complete && fromType === 'individual' && toType === 'sequential-suit' && cardIndex !== 0) {
    // lone individual to sequential-suit not from zero index
    move.moveScore = 11;
  } else if (complete && fromType === 'individual' && toType === 'sequential' && cardIndex === 0) {
    // lone individual to sequential from zero index
    move.moveScore = 10;
  } else if (complete && fromType === 'individual' && toType === 'sequential' && cardIndex !== 0) {
    // lone individual to sequential not from zero index
    move.moveScore = 9;
  } else if (complete && fromType === 'individual' && toType === 'empty' && cardIndex !== 0) {
    // lone individual to empty tableau not from zero index
    move.moveScore = 8;
  } else if (complete && fromType === 'sequential-suit' && toType === 'empty' && cardIndex === 0) {
    // full sequential-suit to empty tableau from zero index
    move.moveScore = 7;
  } else if (complete && fromType === 'sequential' && toType === 'empty' && cardIndex === 0) {
    // full sequential to empty tableau from zero index
    move.moveScore = 6;
  } else if (complete && fromType === 'individual' && toType === 'empty' && cardIndex === 0) {
    // lone individual to empty tableau from zero index
    move.moveScore = 5;
  } else if (!complete && toType === 'sequential-suit') {
    // partial sequence/suit to sequential-suit not from zero index
    move.moveScore = 3;
  } else if (!complete && toType === 'sequential') {
    // partial sequence/suit to sequential not from zero index
    move.moveScore = 2;
  } else if (!complete && toType === 'empty') {
    // partial sequence/suit to empty tableau not from zero index
    move.moveScore = 1;
  }
};

module.exports = Player;
