const Card = require('./Card');
const TableauMove = require('./TableauMove');

const Spiderette = function(options) {
  let deck, tableaus, foundations, stock;

  if (options instanceof Array) {
    deck = options;
    tableaus = [[], [], [], [], [], [], []];
    foundations = [[], [], [], []];
    stock = [];

    // deal the game
    deal();
  } else {
    tableaus = options.tableaus;
    foundations = options.foundations;
    stock = options.stock;
  }

  this.applyMove = function(move) {
    if (move instanceof TableauMove) {
      const from = tableaus[move.getFrom()];
      const to = tableaus[move.getTo()];

      // get the cards to move
      const toMove = from.splice(-move.getQuanitity());

      // make sure this move is allowed
      if (TableauMove.validate(toMove, to)) {
        // push them into the target tableau
        to.push(...toMove);

        // flip the last card in the from tableau, if any
        if (from.length) from[from.length - 1].flip();
      }
    }
  };

  /**
   * Creates a string representation of the tableaus
   * @param  {[type]} allFaceUp [description]
   * @return {[type]}           [description]
   */
  function tableausToString(allFaceUp) {
    const longestTableau = tableaus.reduce((acc, tableau) => (tableau.length > acc ? tableau.length : acc), 0);
    let result = '';

    for (let row = 0; row < longestTableau; row++) {
      for (let tableau = 0; tableau < 7; tableau++) {
        const card = tableaus[tableau][row];
        result += card ? ` ${card.toString(allFaceUp)}` : '      ';
      }
      result += '\n';
    }

    return result;
  }

  /**
   * deals a new game of spiderette
   * @return {[type]} [description]
   */
  function deal() {
    let index = 0;

    for (let row = 0; row < 7; row++) {
      for (let tableau = 0; tableau < 7; tableau++) {
        if (row <= tableau) {
          const card = deck[index++];
          if (row === tableau) {
            card.flip();
          }
          tableaus[tableau].push(card);
        }
      }
    }

    stock.push(...deck.slice(index));
  }

  /**
   * returns a string representation of this game
   * @param  {[type]} allFaceUp [description]
   * @return {[type]}           [description]
   */
  this.toString = function(allFaceUp) {
    let result = ' ' + stock.map(card => card.toString(allFaceUp)).join(' ') + '\n\n';

    result += foundations
      .map(foundation => {
        if (foundation.length) {
          return ' ' + foundation.map(card => card.toString(allFaceUp)).join(' ');
        } else {
          return ' -';
        }
      })
      .join('\n');

    result += '\n\n' + tableausToString(allFaceUp);

    return result;
  };
};

Spiderette.parse = function(str) {
  let deck = [];

  str = str.trim().replace(/\n/g, '\n ').replace(/ {6}/g, ' -').replace(/\[ /g, '[-').replace(/\( /g, '(-');

  rows = str.split('\n').map(row =>
    row.trim().split(' ').map(card => {
      card = card.replace(/-/g, ' ').trim();
      return card === '' ? undefined : Card.parse(card);
    })
  );

  let stock = rows[0];
  let foundations = [
    rows[2].filter(card => card != undefined),
    rows[3].filter(card => card != undefined),
    rows[4].filter(card => card != undefined),
    rows[5].filter(card => card != undefined)
  ];
  let tableaus = [[], [], [], [], [], [], []];

  for (let r = 7; r < rows.length; r++) {
    let row = rows[r];
    for (let i = 0; i < tableaus.length; i++) {
      if (row[i] !== undefined) {
        tableaus[i].push(row[i]);
      }
    }
  }

  return new Spiderette({ deck, tableaus, foundations, stock });
};

module.exports = Spiderette;
