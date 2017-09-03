# Experiments with Solitaire Games

I've had an ongoing curiosity about Solitaire games. I play a lot of Solitaire. These days I mostly play Spiderette, a variation on [Spider](https://en.wikipedia.org/wiki/Spider_(solitaire)). In the past I've played a lot of [Klondike](https://en.wikipedia.org/wiki/Klondike_(solitaire)) and [Freecell](https://en.wikipedia.org/wiki/FreeCell) too.

Any time I'm playing a game, I am forced to wonder whether or not the game is winnable. Happily, [Solibon Solitaire](http://www.solebon.com/), which I play most of the time, has a feature to only deal winnable games. But, it wasn't always that way. At one point in time I worked on an iOS Solitaire app, Gem Solitaire, which I had planned would tell you whether or not a game was winnable. Unfortunately, I got distracted by like and never finished the app.

As a part of that process, I wrote a JavaScript proof of concept that could take a random game of Klondike Solitaire and play it automatically. It would usually win a game within about 1/2 a second in a few hundred moves. If the game stretched beyond about 5000 moves I assumed it wasn't winnable. This project is an expansion on that proof of concept. 

This project contains the following objects:

## Details

### `Card`
Cards are represented by 8bit integers from 8 to 111. In the binary value, the first five bits are the value of the card (vals: 1 to 13). The next two are the suit (vals: 0 to 3). The last bit is the faceup state (vals: 0 or 1).

If a card's value is 0 it's unknown and face down
If a card's value is 1 it's unknown and face up

The `Card` object can interpret this integer value and extract information such as the card's value, suit, and the direction its facing. 

### Deck
`Deck` is an object that can create a set of 52 card integers and shuffle them. It's mostly a convenience.

### Klondike
Games are represented via a simple object called a "`GameState`". GameStates differ between games, but contain important information such as `Uint8Array`s for each pile in the game, an overall array of all data in the game, a score, a string representation of the game, and more. 

The `Klondike` object knows how to manipulate Klondike GameStates. It can, for example:
* create a new game
* create a new (empty) GameState
* perform a move
* refresh the GameState
* calculate scores
* calculate a string representation
* calculate a hash for the gamestate

#### Hashes
My ultimate goal is to create a program that can automatically play Solitaire games. One of the challenges in this area is knowing whether or not I've already worked with a particular state. Consider this: I have a game where in one state I can move a 5♥ to a 6♡ and a J♢ to a Q♠. The resulting state is the same no matter which of those two possible moves I make first.

I have to evaluate every single possible state to see what moves can be made, strategize about the best moves to make, and then test moves in the best possible order. But, I could easily get stuck testing the same state over and over again. 

To resolve this problem I decided to calculate a hash based on the current state. This hash is unique to each state and, therefore, can be used as a key. Thus, for any given state, I can check to see if I've analyzed it before doing so.

### Klondike Player
The Player.klondike.js file contains a `Player` object that knows how to play Klondike. I can feed it any Klondike GameState and it will work through the game, trying to win it. It has a few strategies to make the best guesses. For example, if we have a card that is only one more than the _lowest_ value in any foundation cell, it always makes sense to make this move and skip all others. 

### Spiderette
I am mid-process in implementing Spiderette and its associated Player. Right now, the `Spiderette` object can create games and update the GameState. It can't execute any moves. Also, I haven't started on the Spiderette Player yet. 

### Tests
There are currently 81 tests (all passing) with roughly 95% coverage. These run in about a second on my laptop. Two test fully test identifying a winnable game and an un-winnable game.

## Want to play along?

To experiment with this project, you will need a Node.js and Jest. Once you've got those up and running clone this repository. In the resulting directory run `npm install`. Once that's done you can execute the tests by running `jest`.

There is currently no program that runs these objects, it's just experiments with unit tests and objects.