'use strict'

import { userService } from './userService.js'
import { utilService } from './utilService.js'
import { storageService } from './storageService.js'

export const drawService = {
    setLetterMove,
    getWordsScoreName,
    getWords,
    setCurrWord,
    getGuessWordTxt,
    setGuessWordTxt,
    getRandomLetter,
    addDraw,
    getDrawToGuess,
    getCurrDraw,
    addLetterDrawToGuess,
    getIsUseBomb,
    changeLetters,
    setDrawLettersList,
    playGuess,
    setLetterMove,
    moveNextTurn,
    drawsList
}

var gCurrWord = {
    txt: '',
    score: ''
};

var gGuessedWordTxt = '';

var currGame = {}

var draw = {
    _id: '123',
    word: {
        txt: 'חתול',
        score: 2
    },
    drawDots: [
        { x: 81, y: 74, color: 'black', brushSize: 1 },
        { x: 77, y: 90, color: 'black', brushSize: 1 },
        { x: 73, y: 100, color: 'black', brushSize: 1 },
        { x: 70, y: 110, color: 'black', brushSize: 1 },
        { x: 67, y: 119, color: 'red', brushSize: 3 },
        { x: 60, y: 130, color: 'red', brushSize: 3 },
        { x: 58, y: 120, color: 'red', brushSize: 3 },
        { x: 57, y: 100, color: 'red', brushSize: 3 },
    ],
    extraLetters: [],
    isBombUsed: false,
    letters: [],
    createdBy: userService.getLogginUser(),
    turn: 1
}

const gWords = [
    {
        txt: 'חתול',
        score: 1
    },
    {
        txt: 'מגנט',
        score: 2
    },
    {
        txt: 'מלח',
        score: 3
    },
]

const gWordScoreName = {
    1: 'קל',
    2: 'בינוני',
    3: 'קשה'
}

const gLetters = 'אבגדהוזחטיכלמנסעפצקרשת'.split('');


function drawsList() {
    
    var Draws = storageService.loadFromStorage('DrawsList')

    if (!Draws || !Draws.length) {
        gDrawsToGuess = Draws;
    }
    gDrawsToGuess = [];
    storageService.saveToStorage('gDrawsToGuess',gDrawsToGuess);
}

var gCurrDrawToGuess = {}

var gLettersMoves = []

function setLetterMove(letter, idx, isIn = false) {
    var move = {
        letter,
        idx,
        in: isIn
    }
    gLettersMoves.push(move)
}

function getWords() {
    return gWords;
}

function getWordsScoreName() {
    return gWordScoreName;
}

function setCurrWord(currWord) {
    gCurrWord = { ...currWord }
}

function getGuessWordTxt() {
    return gGuessedWordTxt;
}

function setGuessWordTxt(gussWordTxt) {
    gGuessedWordTxt = gussWordTxt;
}

function getRandomLetter() {
    return gLetters[parseInt(Math.random() * gLetters.length)]
}

function addDraw(draw) {
    const newDraw = {
        _id: utilService.makeId(),
        word: {
            txt: gCurrWord.txt,
            score: gCurrWord.score,
        },
        drawDots: draw.drawDots,
        extraLetters: [],
        isBombUsed: false,
        createdBy: userService.getLogginUser(),
        letters: [],
        turn: 1
    }

    gCurrWord = {
        txt: '',
        score: 0
    }

    gDrawsToGuess.push(newDraw);
    storageService.saveToStorage('DrawsList',gDrawsToGuess);
    userService.addUserDraw(newDraw);
}

function moveNextTurn() {
    //TODO: MOVE THE TURN TO NEXT TURN
}

function getDrawToGuess() {
    //TODO: CHANGE FROM [0] TO POP():
    // gCurrDrawToGuess = gDrawsToGuess.pop();
    gCurrDrawToGuess = gDrawsToGuess[0];
    return gCurrDrawToGuess;
}

function getCurrDraw() {
    console.log('gCurrDrawToGuess',gCurrDrawToGuess);
    return gCurrDrawToGuess;
}

function addLetterDrawToGuess(letter) {
    gCurrDrawToGuess.extraLetters.push(letter)
}


function getIsUseBomb() {
    console.log(gCurrDrawToGuess.iBombUsed);
    return gCurrDrawToGuess.iBombUsed
}

function changeLetters() {
    gCurrDrawToGuess.extraLetters = [];
}

function setDrawLettersList(letters) {
    gCurrDrawToGuess.letters = letters;
}

// function nextLevel() {

// }


function playGuess() {
    gLettersMoves.forEach((move, idx) => {
        setTimeout(_doMove, 10 * idx, move)
    })
}

function _doMove(move) {
    console.log(move);
}