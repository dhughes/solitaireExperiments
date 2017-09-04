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

    let log = '------------------------\n';
    log += 'Before Hash: ' + gameState.hash + '\n';
    log += 'Before State Score: ' + gameState.stateScore + '\n';
    log += Spiderette.asString(gameState);
    log += '\n';

    //console.log(move.asString());

    // to do this move on the specified state!  This will update the gameState.
    //let oldHash = gameState.hash;
    Spiderette.doMove(gameState, move);
    //gameState.previousState = oldHash;

    log += Spiderette.asString(gameState);
    log += '\nAfter Hash: ' + gameState.hash;
    log += '\nAfter State Score: ' + gameState.stateScore + '\n';
    console.log(log);

    // did we win?
    if (gameState.won) {
      callback(true, Player.moves);
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
      moveScore: 20,
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

  // loop over each tableau to try moving from
  for (f = 0; f < piles.tableaux.length; f++) {
    from = piles.tableaux[f];
    fromLen = pileLengths.tableaux[f];

    // loop backwards over the cards in this tableau and identify potential stacks to move
    let sequentialSuit = true;
    for (
      var c = fromLen - 1;
      c !== 255 && Card.isFaceUp(from[c]) && (c === fromLen - 1 || Card.numericValue(from[c]) === cardNumericValue + 1);
      c--
    ) {
      let moveScore = fromLen - c + 1;
      card = from[c];

      cardNumericSuit = Card.numericSuit(card);

      cardNumericValue = Card.numericValue(card);

      // check to see if we're working with a sequential-suit stack
      if (sequentialSuit && c < fromLen - 1) {
        sequentialSuit = sequentialSuit && cardNumericSuit === Card.numericSuit(from[c + 1]);
      }

      //if (f === 5 && fromLen - c === 2) console.log(moveScore);

      // give bonus points for sequential-suit stacks
      moveScore += sequentialSuit && c !== fromLen - 1 ? 1 : 0;
      //if (f === 5 && fromLen - c === 2) console.log(moveScore);

      // give bonus points for move that would empty a tableau
      moveScore += c === 0 ? 2 : 0;
      //if (f === 5 && fromLen - c === 2) console.log(moveScore);

      // give bonus points for moves that would expose a face-down card
      moveScore += c !== 0 && !Card.isFaceUp(from[c - 1]) ? 1 : 0;
      //if (f === 5 && fromLen - c === 2) console.log(moveScore);

      // deduct points if we would break up a stack
      moveScore += c !== 0 && Card.numericValue(from[c - 1]) === Card.numericValue(card) + 1 ? -2 : 0;
      //if (f === 5 && fromLen - c === 2) console.log(moveScore);

      // deduct points if we would break up a sequential stack
      moveScore +=
        c !== 0 &&
        Card.numericValue(from[c - 1]) === Card.numericValue(card) + 1 &&
        Card.numericSuit(from[c - 1]) === Card.numericSuit(card)
          ? -1
          : 0;
      //if (f === 5 && fromLen - c === 2) console.log(moveScore);

      // we can always potentially move this card
      potentialMoves.push({
        from: 'tableaux',
        fromIndex: f,
        count: fromLen - c,
        to: 'tableaux',
        moveScore: moveScore++,
        sequentialSuit
      });
    }
  }

  let firstEmptyTableau = null;
  let stockIsEmpty = pileLengths.stock === 0;

  // now, let's find places where we can actually move the potential moves
  for (let potentialMove of potentialMoves) {
    // find the card we're trying to move
    from = piles.tableaux[potentialMove.fromIndex];
    card = from[from.len() - potentialMove.count];

    // find potential matches for this card
    for (t = 0; t < piles.tableaux.length; t++) {
      // don't try moving to the same tableau
      if (potentialMove.fromIndex == t) continue;
      let thisMove = Object.assign({}, potentialMove);

      // get a handle on the target pile and its last card
      to = piles.tableaux[t];
      toLen = pileLengths.tableaux[t];
      lastCard = to[to.len() - 1];

      if (!firstEmptyTableau && !toLen) {
        firstEmptyTableau = t;
      }

      // is this tableau empty? If so, we can always move to it (unless the stock is empty and this isn't the first open tableau)
      if (!toLen && (!stockIsEmpty || t === firstEmptyTableau)) {
        // we can always potentially move this card

        // in general, we don't want to do a lot of moves to empty tableaux. reset the score to be pretty low
        thisMove.moveScore = 0;

        collection.add(
          Object.assign({}, thisMove, { toIndex: t, stateScore: gameState.stateScore, hash: gameState.hash })
        );

        continue;
      }

      //is the last card's value one larger than the card being moved?
      if (Card.numericValue(lastCard) === Card.numericValue(card) + 1) {
        // this is a move that can be made!!
        thisMove.toIndex = t;
        // if (thisMove.fromIndex === 1) {
        //   console.log('---');
        //   console.log(thisMove);
        // }
        // is the potential move a sequential-suit one?
        // and, does the suit of the card being moved match that of the target?
        if (thisMove.sequentialSuit && Card.numericSuit(lastCard) === Card.numericSuit(card)) {
          thisMove.moveScore += 1;
        }

        // if (thisMove.fromIndex === 1) {
        //   console.log(thisMove);
        // }

        // give bonus points for size of stack (and continuing matching suit)
        let previousCard = lastCard;

        // if (thisMove.fromIndex === 1) {
        //   console.log(Card.asString(lastCard));
        // }
        for (
          let s = to.len() - 2;
          s !== 255 && Card.isFaceUp(to[s]) && Card.numericValue(to[s]) === Card.numericValue(lastCard) + 1;
          s--
        ) {
          // if (thisMove.fromIndex === 1) {
          //   console.log('test');
          // }
          // this continues to be sequential
          thisMove.moveScore += 1;

          // does this continue a sequential-suit stack?
          thisMove.sequentialSuit =
            thisMove.sequentialSuit && Card.numericSuit(previousCard) === Card.numericSuit(to[s]);

          // if this continues a sequential-suit stack, keep giving bonus points
          thisMove.moveScore += thisMove.sequentialSuit ? 1 : 0;

          lastCard = to[s];
        }

        // if (thisMove.fromIndex === 1) {
        //   console.log(thisMove);
        // }
        collection.add(Object.assign({}, thisMove, { stateScore: gameState.stateScore, hash: gameState.hash }));
        identifiedMoves++;
      }
    }
  }

  // draw from stock, so long as there are no empty tableau
  if (pileLengths.stock && piles.tableaux.filter(pile => pile.len() === 0).length === 0) {
    collection.add({
      stateScore: gameState.stateScore,
      moveScore: 1,
      from: 'stock',
      to: 'tableaux',
      hash: gameState.hash
    });
  }
};

module.exports = Player;
