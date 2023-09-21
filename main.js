import { EVENT_MOVEMENTS } from './consts'
import './style.css'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const EMPTY_CELL_COLOR = 'black'
const SOLID_PIECE_COLOR = 'white'
const FREE_PIECE_COLOR = 'gray'

const BLOCK_SIZE = 20
const BOARD_WIDTH = 14
const BOARD_HEIGHT = 30

const board = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0],
]

const currentPiece = {
  position: { x: 5, y: 5 },
  shape: [
    [1, 0], [1, 1]
  ]
}

canvas.width = (BLOCK_SIZE * BOARD_WIDTH)
canvas.height = (BLOCK_SIZE * BOARD_HEIGHT)

ctx.scale(BLOCK_SIZE, BLOCK_SIZE)
drawBoard()
drawCurrentPiece()
listenToKeyboard()

function drawBoard() {
  ctx.fillStyle = EMPTY_CELL_COLOR
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        ctx.fillStyle = SOLID_PIECE_COLOR
        ctx.fillRect(x, y, 1, 1)
      }
    })
  })
}

function drawCurrentPiece() {
  ctx.fillStyle = FREE_PIECE_COLOR

  currentPiece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        ctx.fillRect(x + currentPiece.position.x, y + currentPiece.position.y, 1, 1)
      }
    })
  })
}

function updateBoard() {
  drawBoard()
  drawCurrentPiece()
}

function hasCollision(x, y) {
  if (y <= board.length - 1) {
    if (x <= board[y].length - 1) {
      return board[y][x] === 0 ? false : true
    }
  }
  
  return true
}

function handleCollision() {
  currentPiece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      board[currentPiece.position.y + y][currentPiece.position.x + x] = value
    })
  })
  currentPiece.position.y = 0
  currentPiece.position.x = 0
}

function handleKeydown(keyName) {
  switch (keyName) {
    case EVENT_MOVEMENTS.LEFT:
      if (!hasCollision(currentPiece.position.x - 1, currentPiece.position.y)) {
        currentPiece.position.x--
      }
      break

    case EVENT_MOVEMENTS.RIGHT:
      if (!hasCollision(currentPiece.position.x + 1, currentPiece.position.y)) {
        currentPiece.position.x++
      }
      break

    case EVENT_MOVEMENTS.DOWN:
      if (!hasCollision(currentPiece.position.x, currentPiece.position.y + 1)) {
        currentPiece.position.y++
      } else {
        handleCollision()
      }
      break

    default: break
  }
  updateBoard()
}

function listenToKeyboard() {
  document.addEventListener('keydown', e => handleKeydown(e.key))
}