const buckets = require('buckets-js');
const Card = require('./Card');
const Klondike = require('./Klondike');

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

    var foundationLengths = new Uint8Array(4);
    foundationLengths.set(gameState.pileLengths.foundations);

    var tableauxLengths = new Uint8Array(7);
    tableauxLengths.set(gameState.pileLengths.tableaux);

    Player.savedStates[gameState.hash] = {
      data: data,
      pileLengths: {
        foundations: foundationLengths,
        tableaux: tableauxLengths,
        waste: gameState.pileLengths.waste,
        stock: gameState.pileLengths.stock
      },
      identifiedMoves: 0,
      testedMoves: 0,
      drawCount: gameState.drawCount,
      stateScore: gameState.stateScore,
      stringRepresentation: gameState.stringRepresentation,
      foundationSuits: gameState.foundationSuits.clone(),
      lowestFoundationValue: gameState.lowestFoundationValue,
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
  var data = new Uint8Array(212);
  data.set(Player.savedStates[hash].data);

  var foundationLengths = new Uint8Array(4);
  foundationLengths.set(Player.savedStates[hash].pileLengths.foundations);

  var tableauxLengths = new Uint8Array(7);
  tableauxLengths.set(Player.savedStates[hash].pileLengths.tableaux);

  return {
    data: data,
    piles: Klondike.getPiles(data),
    pileLengths: {
      foundations: foundationLengths,
      tableaux: tableauxLengths,
      waste: Player.savedStates[hash].pileLengths.waste,
      stock: Player.savedStates[hash].pileLengths.stock
    },
    identifiedMoves: Player.savedStates[hash].identifiedMoves,
    testedMoves: Player.savedStates[hash].testedMoves,
    drawCount: Player.savedStates[hash].drawCount,
    stateScore: Player.savedStates[hash].stateScore,
    stringRepresentation: Player.savedStates[hash].stringRepresentation,
    foundationSuits: Player.savedStates[hash].foundationSuits.clone(),
    lowestFoundationValue: Player.savedStates[hash].lowestFoundationValue,
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

    //console.log(gameState.hash);
    //console.log(gameState.stringRepresentation);

    //console.log(move.asString());

    // to do this move on the specified state!  This will update the gameState.
    Klondike.doMove(gameState, move);

    //console.log(gameState.stringRepresentation.indent(1));

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
  callback(false, Player.moves);
};

/**
 * Inspects a game state and determines what moves are possible.
 * @param {Object} gameState
 * @param {Object} collection A collection object (with add() method) that will receive all of the possible moves we identify
 */
Player.identifyMoves = function(gameState, collection) {
  Player.saveState(gameState);

  // get our piles
  var piles = gameState.piles;
  var pileLengths = gameState.pileLengths;

  // get the lowest foundation value
  var lowestFoundationValue = gameState.lowestFoundationValue;

  // find out what suits the foundations are
  var foundationSuits = gameState.foundationSuits;

  var card, bonus, from, fromLen, f, to, toLen, t, cardColor, cardNumericValue, cardNumericSuit;
  var identifiedMoves = 0;

  //**** ForcedTableauToFoundation ****//
  // If we have a card that is only one more than the lowest value in any foundation, we must move this card and
  // skip all other moves.

  // loop over each tableau to try moving from it
  for (f = 0; f < piles.tableaux.length; f++) {
    from = piles.tableaux[f];
    fromLen = pileLengths.tableaux[f];

    // if the first card in the tableau is 255 then the pile is empty
    if (!fromLen) {
      continue;
    }
    card = from[fromLen - 1];
    bonus = 0;

    // are we moving the last card out of this tableau?
    // todo: test in unit test
    if (from[1] === 0) {
      bonus++;
    }

    if (Card.numericValue(card) === lowestFoundationValue + 1) {
      collection.add({
        stateScore: gameState.stateScore,
        moveScore: 6 + bonus,
        from: 'tableaux',
        fromIndex: f,
        to: 'foundations',
        toIndex: foundationSuits.indexOf(Card.numericSuit(card)),
        hash: gameState.hash
      });
      identifiedMoves++;
      return; // note, once we find one card that needs to go to the foundation, do no more.  If there are more, we'll find them in the next test.
    }
  }

  //**** ForcedWasteToFoundation ****//
  if (pileLengths.waste) {
    card = piles.waste[pileLengths.waste - 1];

    if (Card.numericValue(card) === lowestFoundationValue + 1) {
      collection.add({
        stateScore: gameState.stateScore,
        moveScore: 6,
        from: 'waste',
        to: 'foundations',
        toIndex: foundationSuits.indexOf(Card.numericSuit(card)),
        hash: gameState.hash
      });
      identifiedMoves++;
      return; // note, once we find one card that needs to go to the foundation, do no more.  If there are more, we'll find them in the next test.
    }
  }

  //**** TableauToFoundation ****//
  // I need to loop over the tableaux and see if any card in the tableau can be moved to a foundation

  // loop over each tableau to try moving from it
  for (f = 0; f < piles.tableaux.length; f++) {
    from = piles.tableaux[f];
    fromLen = pileLengths.tableaux[f];
    if (!fromLen) {
      continue;
    }
    card = from[fromLen - 1];
    bonus = 0;

    // are we moving the last card out of this tableau?
    //todo: test in unit test
    if (from[1] === 0) {
      bonus++;
    }

    // this is the foundation this card would go to if it is able
    t = foundationSuits.indexOf(Card.numericSuit(card));
    to = piles.foundations[t];
    toLen = pileLengths.foundations[t];

    // can move this card to a foundation?
    if (Card.numericValue(to[toLen - 1]) === Card.numericValue(card) - 1) {
      collection.add({
        stateScore: gameState.stateScore,
        moveScore: 5 + bonus,
        from: 'tableaux',
        fromIndex: f,
        to: 'foundations',
        toIndex: t,
        hash: gameState.hash
      });
      identifiedMoves++;
    }
  }

  //**** WasteToFoundation ****//
  if (pileLengths.waste) {
    card = piles.waste[pileLengths.waste - 1];
    cardNumericSuit = Card.numericSuit(card);

    // this is the foundation this card would go to if it is able
    t = foundationSuits.indexOf(cardNumericSuit);
    to = piles.foundations[t];
    toLen = pileLengths.foundations[t];

    if (
      toLen &&
      Card.numericSuit(to[toLen - 1]) === cardNumericSuit &&
      Card.numericValue(to[toLen - 1]) === Card.numericValue(card) - 1
    ) {
      collection.add({
        stateScore: gameState.stateScore,
        moveScore: 5,
        from: 'waste',
        to: 'foundations',
        toIndex: t,
        hash: gameState.hash
      });
      identifiedMoves++;
    }
  }

  //**** TableauToTableau ****//
  // I need to loop over the tableaux and see if any card in the tableau can be moved to any other tableau

  // only move a subset of the visible cards if, by doing this, you can move the exposed card to a foundation or expose a facedown card

  // loop over each tableau to try moving from
  for (f = 0; f < piles.tableaux.length; f++) {
    from = piles.tableaux[f];
    fromLen = pileLengths.tableaux[f];

    // loop backwards over the cards in this tableau
    for (var c = fromLen - 1; c !== 255 && Card.isFaceUp(from[c]); c--) {
      card = from[c];
      cardColor = Card.color(card);
      cardNumericValue = Card.numericValue(card);
      bonus = 0;
      var validToMove = false; // only try to move either the entire stack of visible cards or the last visible card.

      var prevFaceUp = Card.isFaceUp(from[c - 1]);

      // assuming we're not at the 0th card, let's get the previous card in the stack
      // todo: make sure this logic is actually working.  I don't currently have a way to do this.
      if (from[c - 1] && prevFaceUp) {
        // check to see if the previous card could be moved to a foundation.  If so, this is the only case where you would want to move a partial stack.
        var previousCard = from[c - 1];
        // if we expose this card, could it be moved to the foundations?
        var foundation = piles.foundations[foundationSuits.indexOf(Card.numericSuit(previousCard))];
        var foundationLen = pileLengths.foundations[foundationSuits.indexOf(Card.numericSuit(previousCard))];
        // indicate that we should see if this card should be moved.
        validToMove = foundationLen + 1 === Card.numericValue(previousCard);
        bonus++;
      } else if (from[c - 1] !== undefined && !prevFaceUp) {
        // if the previous card would be turned face up then we can see about moving this stack
        validToMove = true;
      } else if (c === 0 && cardNumericValue === 13) {
        // if we've got a king at the top of a tableau, we'll never move it to another tableau
        break;
      } else if (c === 0) {
        // if we're moving the last card out of a tableau, it gets bonus points
        validToMove = true;
        bonus++;
      }

      if (validToMove) {
        // now see if we can move this card (and ultimately ones stacked on it) can be moved to another tableau
        for (t = 0; t < 7; t++) {
          if (t === f) {
            continue;
          }

          to = piles.tableaux[t];
          toLen = pileLengths.tableaux[t];

          if (
            toLen &&
            Card.color(to[toLen - 1]) !== cardColor &&
            Card.numericValue(to[toLen - 1]) === cardNumericValue + 1
          ) {
            // by moving this card, do we expose another new card?

            collection.add({
              stateScore: gameState.stateScore,
              moveScore: 3 + bonus,
              from: 'tableaux',
              fromIndex: f,
              count: fromLen - c,
              to: 'tableaux',
              toIndex: t,
              hash: gameState.hash
            });
            identifiedMoves++;
          } else if (!toLen && cardNumericValue === 13) {
            // if the to tableau is empty and we have a king we can move it here

            collection.add({
              stateScore: gameState.stateScore,
              moveScore: 3 + bonus,
              from: 'tableaux',
              fromIndex: f,
              to: 'tableaux',
              toIndex: t,
              hash: gameState.hash
            });
            identifiedMoves++;
            break;
          }
        }
      }
    }
  }

  //**** WasteToTableau ****//
  if (pileLengths.waste) {
    card = piles.waste[pileLengths.waste - 1];
    cardNumericValue = Card.numericValue(card);
    cardColor = Card.color(card);

    // I need to loop over the tableaux and see this card can be moved to a tableau

    // can move this card to a tableau?
    for (t = 0; t < 7; t++) {
      to = piles.tableaux[t];
      toLen = pileLengths.tableaux[t];

      if (
        toLen &&
        Card.color(to[toLen - 1]) !== cardColor &&
        Card.numericValue(to[toLen - 1]) === cardNumericValue + 1
      ) {
        collection.add({
          stateScore: gameState.stateScore,
          moveScore: 3,
          from: 'waste',
          to: 'tableaux',
          toIndex: t,
          hash: gameState.hash
        });
        identifiedMoves++;
      } else if (!toLen && cardNumericValue === 13) {
        // if the to tableau is empty and we have a king, we can move it here
        //todo: test in unit test
        collection.add({
          stateScore: gameState.stateScore,
          moveScore: 3,
          from: 'waste',
          to: 'tableaux',
          toIndex: t,
          hash: gameState.hash
        });
        identifiedMoves++;
        break; // once we've determined that we can move a king there's nothing else to do here.
      }
    }
  }

  //**** Draw ****//
  // if there are cards in the stock I need to draw, otherwise I need to reset
  if (pileLengths.stock) {
    collection.add({
      stateScore: gameState.stateScore,
      moveScore: 0,
      from: 'stock',
      to: 'waste',
      count: gameState.drawCount,
      hash: gameState.hash
    });
    identifiedMoves++;
  } else if (pileLengths.waste) {
    //todo: test in unit test
    collection.add({
      stateScore: gameState.stateScore,
      moveScore: 0,
      from: 'waste',
      to: 'stock',
      count: pileLengths.waste,
      hash: gameState.hash
    });
    identifiedMoves++;
  }

  //**** FoundationToTableau ****//
  // I need to loop over the foundations and see if any card in a foundation can be moved to a tableau
  // never move down from foundations when value of card is one more or less than the lowest foundation value
  // loop over each foundation to try moving from
  for (f = 0; f < piles.foundations.length; f++) {
    from = piles.foundations[f];
    fromLen = pileLengths.foundations[f];

    if (!fromLen) {
      continue;
    }

    card = from[fromLen - 1];
    cardColor = Card.color(card);
    cardNumericValue = Card.numericValue(card);

    // if this card is equal one more than the lowst foundation value, never move it.
    if (cardNumericValue - 1 === lowestFoundationValue) {
      continue;
    }

    // can move this card to a tableau?
    for (t = 0; t < piles.tableaux.length; t++) {
      to = piles.tableaux[t];
      toLen = pileLengths.tableaux[t];

      if (
        toLen &&
        Card.color(to[toLen - 1]) !== cardColor &&
        Card.numericValue(to[toLen - 1]) === cardNumericValue + 1
      ) {
        collection.add({
          stateScore: gameState.stateScore,
          moveScore: 0,
          from: 'foundations',
          fromIndex: f,
          to: 'tableaux',
          toIndex: t,
          hash: gameState.hash
        });
        identifiedMoves++;
      } else if (!toLen && cardNumericValue === 13) {
        // if the to tableau is empty and we have a king, we can move it here

        //todo: test in unit test
        collection.add({
          stateScore: gameState.stateScore,
          moveScore: 0,
          from: 'foundations',
          fromIndex: f,
          to: 'tableaux',
          toIndex: t,
          hash: gameState.hash
        });
        identifiedMoves++;
        break; // once we've determined that we can move a king there's nothing else to do here.
      }
    }

    // we're getting a direct reference to the gamestate in the
    Player.savedStates[gameState.hash].identifiedMoves = identifiedMoves;
  }
};

module.exports = Player;
