'use strict'
import { utilService } from './utilService.js'
import { userService } from './userService.js'
import { userController } from './userController.js'
import { canvasController } from './canvasController.js'
import { drawService } from './drawService.js'


window.onload = onInit

// Set-up the canvas and add our event handlers after the page has loaded
function onInit() {
    canvasController.initCanvas()
    userController.renderUser()
    var gDrawsToGuess = window.gDrawsToGuess = [];
    drawService.drawsList()
    _renderModalSize(document.querySelector('.container-brush .modal-size'))
    _renderModalSize(document.querySelector('.container-eraser .modal-size'))
    // buttons
    document.querySelector('.btn-draw-word').addEventListener('click', _onDrawWord)
    document.querySelector('.btn-guess-word').addEventListener('click', _onGuessWord)
    document.querySelector('.btn-guess-words').addEventListener('click', _onGuessWords)

    document.querySelector('.btn-clear').addEventListener('click', canvasController.clearCanvas)
    document.querySelector('.btn-cancel').addEventListener('click', _onExitWord)

    document.querySelectorAll('.circle-size').forEach(item => {
        item.addEventListener('click', (ev) => { canvasController.onSetBrushSize(ev) })
    })


    document.querySelector('.btn-play').addEventListener('click', _onPlayDraw)
    document.querySelector('.btn-send').addEventListener('click', _onSendDraw)
    document.querySelector('.btn-bomb').addEventListener('click', _onUseBomb)
    document.querySelector('.btn-replace-letters').addEventListener('click', _onPutLetters)
    document.querySelector('.btn-go').addEventListener('click', _onNextLevel)

    document.querySelector('.btn-brush-size').addEventListener('click', _onToggleBrushSize)
    document.querySelector('.btn-brush-size').addEventListener('click', () => canvasController.setDraw('color', 'black'))
    document.querySelector('.btn-eraser-size').addEventListener('click', onToggleEraserSize)
    document.querySelector('.btn-eraser-size').addEventListener('click', () => canvasController.setDraw('color', 'white'))
    _renderWords();
}

function _onNextLevel() {
    document.querySelector('.next-turn').hidden = true;
    document.querySelector('.home-game').hidden = false;
    document.querySelector('.next-turn').hidden = true;
    document.querySelector('.next-turn').style.display = 'none';

    const drawToGuss = drawService.getDrawToGuess();
    _onPlayDraw(drawToGuss.drawDots);
    drawService.playGuess();


    // canvasController.clearCanvas();
    // clearDraw();
    _onDrawWord();
}

function _renderWords() {
    const words = drawService.getWords();
    const wordsScoreName = drawService.getWordsScoreName()
    const strHTMLs = words.map(word => `
    <li data-txt="${word.txt}" data-score="${word.score}">
    <span class="word-score-name">${wordsScoreName[word.score]}</span>
    <span class="word-txt">${word.txt}</span>    
    <span>${'<img src="img/currency.png" />'.repeat(word.score)}</span>
    </li>`)
    document.querySelector('.word-list').innerHTML = strHTMLs.join('')
    document.querySelector('.word-list').addEventListener('click', ev => _onChooseWord(ev))
}

function _onDrawWord() {
    const elheaderAction = document.querySelector('.header-action');
    elheaderAction.innerHTML = `<button class="btn-back-home">
    <i class="fas fa-chevron-left"></i>
    </button>`
    document.querySelector('.new-game').style.display = "none";
    // document.querySelector('.home-game').hidden = true
    document.querySelector('.step-select-word').hidden = false
    document.querySelector('.btn-back-home').addEventListener('click', _onBackHome)
    document.querySelector('.btn-cancel-guess').addEventListener('click', _onExitWord)
}

function _onGuessWord() {
    const drawToGuss = drawService.getDrawToGuess();
    window.gameState = 'playing-draw'
    if (!drawToGuss) console.log('No draws');
    else {
        document.querySelector('.btns-action').style.display = 'none';
        document.querySelector('.color-palt').hidden = true;
        document.querySelector('.step-draw h2').innerText = 'אתה מנחש עכשיו עבור ' + drawToGuss.createdBy.username
        _onPutLetters();
    }
}

function _onGuessWords() {
    const drawToGuss = drawService.getDrawToGuess();
    window.gameState = 'playing-draw'
    if (!drawToGuss) console.log('No draws');
    else {
        document.querySelector('.btns-action').style.display = 'none';
        document.querySelector('.color-palt').hidden = true;
        document.querySelector('.step-draw h2').innerText = 'אתה מנחש עכשיו עבור ' + drawToGuss.createdBy.username
        _onPutLetters();
    }
}

function _onBackHome() {
    const isSure = true;
    // = confirm('האם תרצה לצאת?')
    if (isSure) _backHome();
}

function _backHome() {
    document.querySelector('.new-game').style.display = "flex";
    document.querySelector('.home-game').hidden = false
    document.querySelector('.step-draw').hidden = true
    document.querySelector('.step-guess').hidden = true
    document.querySelector('.step-select-word').hidden = true
    userController.renderUserImg()
}

function _onChooseWord(ev) {
    window.gameState = 'making-draw'
    document.querySelector('.home-game').hidden = true;
    document.querySelector('.step-draw').hidden = false;
    document.querySelector('.btns-action').style.display = 'flex';
    document.querySelector('.color-palt').hidden = false;
    document.querySelector('.btn-send').hidden = false;
    const el = ev.target.closest('[data-txt]')
    const { txt, score } = el.dataset
    if (!txt) return
    const word = {
        txt,
        score
    }
    drawService.setCurrWord(word)
    document.querySelector('.step-draw h2').innerText = 'אתה מצייר עכשיו ' + word.txt
}

function _onExitWord() {
    const word = {
        txt: null,
        score: 0
    }
    drawService.setCurrWord(word)
    canvasController.clearCanvas()
    canvasController.clearDraw()
    _backHome()
    // document.querySelector('.home-game').hidden = false
    // document.querySelector('.step-draw h2 span').innerText = ''
    // document.querySelector('.step-draw').hidden = true
    // document.querySelector('.step-guess').hidden = true
}

function _onSendDraw() {
    var newDraw = canvasController.drawEnd();
    drawService.addDraw(newDraw);
    canvasController.clearCanvas();
    _backHome();
}

function _onRevertLetter(ev) {
    var guessWordTxt = drawService.getGuessWordTxt();
    const el = ev.target.closest('[data-idx]')
    if (!el) return;
    const letter = el.innerText
    const { idx } = el.dataset
    drawService.setLetterMove('', parseInt(idx))
    el.innerText = '';
    var letters = guessWordTxt.split('')
    letters.splice(idx, 1, ' ')
    guessWordTxt = letters.join('')
    drawService.setGuessWordTxt(guessWordTxt)
    let elLetter = document.querySelector(`.${letter}`)
    elLetter.classList.remove('letter-choosen');
    elLetter.classList.remove(`${letter}`);
}

function _onChooseLetter(ev) {
    var guessWordTxt = drawService.getGuessWordTxt();
    const currDraw = drawService.getCurrDraw();
    const el = ev.target.closest('[data-letter]')
    if (!el) return;
    const { letter } = el.dataset
    el.classList.add('letter-choosen');
    el.classList.add(`${letter}`);
    // el.removeEventListener('click', _onChooseLetter);

    const lis = Array.from(document.querySelectorAll('.spot-list li'));
    const idxFreeSpot = lis.findIndex(li => !li.innerText.trim())
    if (idxFreeSpot === -1) return;
    lis[idxFreeSpot].innerText = letter;
    drawService.setLetterMove(letter, idxFreeSpot, true)

    if (idxFreeSpot >= guessWordTxt.length) {
        guessWordTxt += letter;
    } else {
        const letters = guessWordTxt.split('')
        letters.splice(idxFreeSpot, 1, letter)
        guessWordTxt = letters.join('')
    }

    drawService.setGuessWordTxt(guessWordTxt)
    console.log('Curr word:', guessWordTxt)
    console.log(currDraw.word.txt);
    if (guessWordTxt === currDraw.word.txt) {
        userService.addUserScore(currDraw.word.score);
        drawService.moveNextTurn();
        _turnOver(currDraw);
        // backHome();
    }
}

function _turnOver(currDraw) {
    document.querySelector('.correct').hidden = false
    document.querySelector('.spot-list-container').style.background = '#4ecd4a'
    const elSpots = document.querySelectorAll('.spot-list li')
    elSpots.forEach(elSpot => elSpot.style.background = '#4ecd4a')

    //TODO: NEXT LEVEL: ADD SCORE 
    // nextLevel()

    setTimeout(() => {
        document.querySelector('.step-guess').hidden = true
        document.querySelector('.step-draw').hidden = true
        document.querySelector('.next-turn').hidden = false
        document.querySelector('.next-turn').style.display = 'flex'

        document.querySelector('.next-turn .prev-num').innerText = currDraw.turn;
        document.querySelector('.next-turn .next-num').innerText = currDraw.turn + 1;

        document.querySelector('.correct').hidden = true
        document.querySelector('.spot-list-container').style.background = 'rgb(82, 209, 251, 0.8)'
        elSpots.forEach(elSpot => elSpot.style.background = 'rgb(82, 209, 251, 0.8)')

    }, 2500)
}

function _onPlayDraw() {
    canvasController.clearCanvas();
    const currDraw = drawService.getCurrDraw();
    currDraw.drawDots.push({brushSize: 1,color: "black",x: 0,y: 0})
    currDraw.drawDots.forEach((dot, idx) => {
        dot.play = true;
        setTimeout(canvasController.drawDot, 10 * idx, dot)
    })


}

function _onUseBomb() {
    if (drawService.getIsUseBomb()) return
    // useBomb()
    var drawToGuess = drawService.getDrawToGuess();
    var letters = drawToGuess.word.txt.split('')
    while (letters.length < 8) {
        letters.push(drawToGuess.extraLetters.pop())
    }

    utilService.shuffleArray(letters)
    drawService.setDrawLettersList(letters)

    const strHTMLs = letters.map(letter => `<li data-letter="${letter}">
    ${letter}
    </li>`)

    document.querySelector('.letter-list').innerHTML = strHTMLs.join('')
    document.querySelector('.spot-list').innerHTML = drawToGuess.word.txt.split('').map((letter, idx) => `<li data-idx="${idx}"></li>`).join('')
}

function _onPutLetters() {
    if (drawService.getIsUseBomb()) return
    drawService.changeLetters();
    const drawToGuss = drawService.getDrawToGuess();
    document.querySelector('.home-game').hidden = true
    document.querySelector('.step-draw').hidden = false
    document.querySelector('.step-guess').hidden = false
    document.querySelector('.btn-send').hidden = true

    _onPlayDraw(drawToGuss.drawDots)
    const currWordTxt = drawToGuss.word.txt;
    var letters = currWordTxt.split('')
    while (letters.length < 12) {
        const letter = drawService.getRandomLetter();
        letters.push(letter)
        drawService.addLetterDrawToGuess(letter)
    }
    utilService.shuffleArray(letters)
    const strHTMLs = letters.map(letter => `<li data-letter="${letter}">
        ${letter}
        </li>`)


    document.querySelector('.letter-list').innerHTML = strHTMLs.join('')
    document.querySelector('.spot-list').innerHTML = currWordTxt.split('').map((letter, idx) => `<li data-idx="${idx}"></li>`).join('')
    document.querySelector('.letter-list').addEventListener('click', ev => _onChooseLetter(ev))
    document.querySelector('.spot-list').addEventListener('click', ev => _onRevertLetter(ev))

}

function _renderModalSize(elContainer) {
    let strHtml = ``;
    for (let i = 4; i > 0; i--) {
        strHtml += `<div data-size=${i} class='circle-size'>
                     <span data-size=${i} class='size${i}'></span>
                    </div>`
    }
    elContainer.innerHTML = strHtml;
    elContainer.style.display = 'none';
}

function _onToggleBrushSize() {
    _onToggleSize(document.querySelector('.container-brush .modal-size'));
    let elIsOpenOrNot = document.querySelector('.container-eraser .modal-size');
    if ((elIsOpenOrNot.style.display !== 'none')) {
        _onToggleSize(elIsOpenOrNot)
    }
}

function onToggleEraserSize() {
    _onToggleSize(document.querySelector('.container-eraser .modal-size'))
    let elIsOpenOrNot = document.querySelector('.container-brush .modal-size');
    if ((elIsOpenOrNot.style.display !== 'none')) {
        _onToggleSize(elIsOpenOrNot)
    }

}

function _onToggleSize(elContainer) {
    (elContainer.style.display === 'none') ?
        elContainer.style.display = 'flex'
        : elContainer.style.display = 'none';
}