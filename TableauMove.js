const Card = require('./Card');

const TableauMove = function(quantity, from, to) {
  this.getQuanitity = () => quantity;
  this.getFrom = () => from;
  this.getTo = () => to;
};

TableauMove.validate = function(movedCards, to) {
  const toCard = to[to.length - 1];

  if (toCard.getFacing() === Card.DOWN) return false;

  let correctCardValue = toCard.getValue() + 1;

  // are the numbers sequential?
  for (let x = 0; x < movedCards.length; x++) {
    if (movedCards[x].getFacing() === Card.DOWN || movedCards[x].getValue() !== correctCardValue) {
      return false;
    }
    correctCardValue++;
  }

  return true;
};

module.exports = TableauMove;
