'use strict'

export const canvasController = {
    initCanvas,
    setDraw,
    clearCanvas,
    // onSetColor,
    onSetBrushSize,
    clearDraw,
    drawEnd,
    drawDot
}


var gCanvas, gCtx,
    flag = false,
    prevX = -1,
    currX = -1,
    prevY = -1,
    currY = -1,
    dot_flag = false;
var isMouseDown = false;

var gDrawDots = window.dots = []
var gameState  = window.gameState = ''

const gDraw = {
    color: 'black',
    brushSize: 1
}

function initCanvas() {
    // Get the specific canvas element from the HTML document
    gCanvas = document.querySelector('canvas')
    gCtx = gCanvas.getContext('2d')
    gCanvas.addEventListener('mouseout', () => {
        isMouseDown = false

    })
    gCanvas.addEventListener('mousedown', _onCanvasMouseDown)
    gCanvas.addEventListener('touchstart', _onCanvasMouseDown)
    gCanvas.addEventListener('mousemove', _onCanvasMouseMove)
    gCanvas.addEventListener('touchmove', (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        var touch = ev.touches[0]

        var canvasPos = gCanvas.getBoundingClientRect();
        const mouseEv = {
            offsetX: touch.clientX - canvasPos.left,
            offsetY: touch.clientY - canvasPos.top
        }
        // console.log('TOUCH dispatching mouseEvent', mouseEvent);
        // gCanvas.dispatchEvent(mouseEvent)
        _onCanvasMouseMove(mouseEv)
    })
    gCanvas.addEventListener('mouseup', _onCanvasMouseUp)
    gCanvas.addEventListener('touchend', _onCanvasMouseUp)
    gCanvas.addEventListener('touchup', _onCanvasMouseUp)

    gCanvas.width = window.innerWidth;
}

// Keep track of the mouse button being pressed and draw a dot at current location
function _onCanvasMouseDown(ev) {

    isMouseDown = true
    let mousePos = _getMousePos(ev)

    if (isMouseDown && window.gameState === 'making-draw' ) {
        prevX = (currX === -1) ? mousePos.x : currX;
        prevY = (currY === -1) ? mousePos.y : currY;
        currX = mousePos.x;
        currY = mousePos.y;

        flag = true;
        dot_flag = true;
        if (dot_flag) {
            mousePos = { x: currX, y: currY };
            drawDot(mousePos)
            dot_flag = false;
        }
    }

    drawDot(mousePos)
}

function setDraw(type, val) {
    gDraw[type] = val;
}

function _getMousePos(ev) {
    const mousePos = {
        x: ev.offsetX || ev.layerX || 0,
        y: ev.offsetY || ev.layerY || 0
    }
    // if (isMouseDown) console.log('mousePos', mousePos);
    return mousePos
}

// Keep track of the mouse button being released
function _onCanvasMouseUp() {
    isMouseDown = false;
    flag = false;

    currX = -1;
    currY = -1;

    var dot = {
        x: -1,
        y: -1
    }
    gDrawDots.push(dot)

}

// Keep track of the mouse position and draw a dot if mouse button is currently pressed
function _onCanvasMouseMove(ev) {
    let mousePos = _getMousePos(ev)

    if (flag) {
        prevX = currX;
        prevY = currY;
        currX = mousePos.x;
        currY = mousePos.y;

        drawDot(mousePos)
    }
    // Draw a dot if the mouse button is currently being pressed

}


// Draws a dot at a specific position on the supplied canvas name
// Parameters are: A canvas context, the x position, the y position, the size of the dot
function drawDot(pos) {
    let dot = {}

    if (!pos.play) {
        dot = {
            x: pos.x,
            y: pos.y,
            color: pos.color || gDraw.color,
            brushSize: pos.brushSize || gDraw.brushSize
        }
        gDrawDots.push(dot)

    } else {
        dot = pos;
        prevX = (currX === -1) ? dot.x : currX;
        prevY = (currY === -1) ? dot.y : currY;
        currX = dot.x;
        currY = dot.y;
    }

    gCtx.fillStyle = dot.color
    gCtx.beginPath()
    gCtx.moveTo(prevX, prevY);
    if (dot.x !== -1 || dot.y !== -1) {
        gCtx.lineTo(currX,currY);
    }
    gCtx.strokeStyle = dot.color;
    gCtx.lineWidth = dot.brushSize * 1.7;
    gCtx.stroke();
    gCtx.closePath() 
}


function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
    gDraw.color = 'black'
    gDraw.brushSize = 1
}

function onSetColor(ev) {
    setDraw('color', ev.target.value)
}

function onSetBrushSize(ev) {
    var size = +ev.path[0].getAttribute('data-size');
 
    if (gDraw.color === 'white') size = size * 3;
    setDraw('brushSize', size)
}


function drawEnd() {
    var newDraw = {
        drawDots: [...gDrawDots]
    }
    gDrawDots = [];
    return newDraw;
}

function clearDraw() {
    gDrawDots = []
}