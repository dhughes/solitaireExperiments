const Spiderette = require('../Spiderette');
const Deck = require('../Deck');
const TableauMove = require('../TableauMove');

//console.log(Deck.shuffled().map(card => card.toString(true)).join(' '));

describe('Spiderette', () => {
  test('can create new Spiderette game with a deck of cards', () => {
    const game = new Spiderette(Deck.shuffled());
    expect(game).not.toBeNull();
  });

  test('expect toString() for an unshuffled deck to be particular pattern when all face up', () => {
    const game = new Spiderette(Deck.deck());
    expect(game.toString(true).replace(/[ \n]/g, '')).toBe(orderedFaceUp.replace(/[ \n]/g, ''));
  });

  test('expect toString() for an unshuffled deck to be particular pattern', () => {
    const game = new Spiderette(Deck.deck());
    expect(game.toString().replace(/[ \n]/g, '')).toBe(ordered.replace(/[ \n]/g, ''));
  });

  test('expect toString() for a shuffled deck NOT to match the standard pattern when all face up', () => {
    const game = new Spiderette(Deck.shuffled());
    expect(game.toString(true).replace(/[ \n]/g, '')).not.toBe(orderedFaceUp.replace(/[ \n]/g, ''));
  });

  test('expected that parsed game toString() matches the source string', () => {
    const game = Spiderette.parse(randomGame1FaceUp);
    expect(game.toString(true).replace(/[ \n]/g, '')).toBe(randomGame1FaceUp.replace(/[ \n]/g, ''));
  });

  test('can parse hard game 1', () => {
    const game = Spiderette.parse(hardGame1);
    expect(game.toString(true).replace(/[ \n]/g, '')).toBe(hardGame1.replace(/[ \n]/g, ''));
  });

  test('move queen to first king in hard game', () => {
    const game = Spiderette.parse(hardGame1);
    game.applyMove(new TableauMove(1, 6, 0));
    expect(game.toString(true).replace(/[ \n]/g, '')).toBe(hardGame1_1.replace(/[ \n]/g, ''));
  });

  test('fail to move 6 to first king in hard game', () => {
    const game = Spiderette.parse(hardGame1);
    game.applyMove(new TableauMove(1, 5, 0));
    expect(game.toString(true).replace(/[ \n]/g, '')).toBe(hardGame1.replace(/[ \n]/g, ''));
  });
});

/************************ GAMES ************************/

const hardGame1 = `( J♡) ( 6♠) ( 4♣) ( K♡) ( Q♢) ( A♢) ( 5♠) ( 8♠) ( 3♠) ( 2♣) ( K♣) ( J♠) ( 9♠) ( 3♢) ( 3♣) ( J♣) ( 5♡) ( 9♣) ( J♢) ( A♣) ( A♡) ( 7♠) ( 4♠) ( 2♢)

-
-
-
-

[ K♠] ( 8♣) ( 9♡) (???) (???) ( Q♠) (???)
      [ 4♢] ( 7♡) (???) (???) ( Q♡) ( 6♡)
            [ 8♢] ( 4♡) (???) ( 2♠) ( 6♠)
                  [10♠] ( 8♡) ( 9♢) ( 2♡)
                        [ K♢] (10♣) ( 7♣)
                              [ 6♢] ( 5♣)
                                    [ Q♠]
`;

const hardGame1_1 = `( J♡) ( 6♠) ( 4♣) ( K♡) ( Q♢) ( A♢) ( 5♠) ( 8♠) ( 3♠) ( 2♣) ( K♣) ( J♠) ( 9♠) ( 3♢) ( 3♣) ( J♣) ( 5♡) ( 9♣) ( J♢) ( A♣) ( A♡) ( 7♠) ( 4♠) ( 2♢)

-
-
-
-

[ K♠] ( 8♣) ( 9♡) (???) (???) ( Q♠) (???)
[ Q♠] [ 4♢] ( 7♡) (???) (???) ( Q♡) ( 6♡)
            [ 8♢] ( 4♡) (???) ( 2♠) ( 6♠)
                  [10♠] ( 8♡) ( 9♢) ( 2♡)
                        [ K♢] (10♣) ( 7♣)
                              [ 6♢] [ 5♣]
`;

const orderedFaceUp = `( 3♡) ( 4♡) ( 5♡) ( 6♡) ( 7♡) ( 8♡) ( 9♡) (10♡) ( J♡) ( Q♡) ( K♡) ( A♠) ( 2♠) ( 3♠) ( 4♠) ( 5♠) ( 6♠) ( 7♠) ( 8♠) ( 9♠) (10♠) ( J♠) ( Q♠) ( K♠)

-
-
-
-

[ A♣] ( 2♣) ( 3♣) ( 4♣) ( 5♣) ( 6♣) ( 7♣)
      [ 8♣] ( 9♣) (10♣) ( J♣) ( Q♣) ( K♣)
            [ A♢] ( 2♢) ( 3♢) ( 4♢) ( 5♢)
                  [ 6♢] ( 7♢) ( 8♢) ( 9♢)
                        [10♢] ( J♢) ( Q♢)
                              [ K♢] ( A♡)
                                    [ 2♡]`;

const ordered = `(***) (***) (***) (***) (***) (***) (***) (***) (***) (***) (***) (***) (***) (***) (***) (***) (***) (***) (***) (***) (***) (***) (***) (***)

-
-
-
-

[ A♣] (***) (***) (***) (***) (***) (***)
      [ 8♣] (***) (***) (***) (***) (***)
            [ A♢] (***) (***) (***) (***)
                  [ 6♢] (***) (***) (***)
                        [10♢] (***) (***)
                              [ K♢] (***)
                                    [ 2♡]`;

const randomGame1FaceUp = `[ K♠] [ 6♣] [ 9♡] [10♢] [ A♢] [ J♣] [ 8♡] [ 6♠] [ A♡] [ 5♣] [ Q♣] [ 7♡] [ 6♡] [10♠] [ 5♢] [ 8♠] [ 4♣] [ Q♠]

-
-
-
-

[ J♠]       [ 4♠] [ 9♢] [ 3♠] [ A♠] [ J♢]
[10♡]       [ 8♢] [ 5♠] [ 3♢] [ 6♢] [ K♢]
[ 7♠]       [ 7♢] [ 9♣] [ 4♢] [10♣] [ 3♡]
            [ K♡] [ 2♠] [ 2♣] [ K♣] [ Q♡]
            [ Q♢] [ 9♠] [ 7♣] [ 8♣] [ 3♣]
            [ J♡]       [ A♣] [ 5♡] [ 2♢]
                              [ A♣] [ 2♡]
                                    [ 4♡]`;
