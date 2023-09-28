# Tic-Tac-Toe

This project was built as part of The Odin Project: JavaScript course in order to practice what I've learned about JavaScript factory functions and the module pattern.

## Understand the Problem

Write a program with a user interface that allows a user to play tic-tac-toe in the browser.

The interface should initially allow a user to select whether they'd like to play as X or O (X goes first). The other player will be assigned the other marker.

A gameboard of 3 x 3 squares should then appear. Player X will be able to select a square in which to place an X. Player O will then be able to do the same. Players should not be able to select the same spot that has already been selected.

Once a user has marked 3 squares in a row (whether via row, column, or diagonal) or once a tie/stalemate occurs, the outcome is announced and a point is added to the appropriate score (player X, player O, or tie).

Users should have the ability to put in their names. There should be a button to start/restart the game.

### Extra credit: create an AI so that a player can play against the computer.

The interface should additionally initially allow a user to select whether they would like to play against another player or the computer.

## Plan

1. The main goal is to have as little global code as possible. I need to try tucking everything away inside of a module or factory function. Rule of thumb: if I need ONE of something (e.g. gameBoard, displayController), use a module; if I need multiples (e.g. players), use a factory function.
  - Store the gameboard as an array inside of a gameboard object.
  - Store the players in objects.
  - I'll need an object to control the flow of the game itself.

2. Set up HTML and CSS

3. Write a JavaScript function that will render the contents of the gameboard array to the webpage (initially just manually fill the array with Xs and Os)

4. Build the functions that allow players to place marks on a specific spot on the board; tie it to the DOM
  - Think carefully about where each bit of logic should reside: game, player, or gameboard object

5. Build logic that checks for when the game is over: 3-in-a-row and tie.

6. Finishing touches:
  1. Button to start/restart the game
  2. Display element that congratulates the winning player
  3. Display element that keeps track of scores

7. AI...