import { EVENT_MOVEMENTS, MOVEMENT_SPEED, PIECE_SHAPES } from './consts'
import './style.css'
import { getRandomNumberFromRange } from './utils'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
let interval

const EMPTY_CELL_COLOR = 'black'
const SOLID_PIECE_COLOR = 'white'
const FREE_PIECE_COLOR = 'gray'

const BLOCK_SIZE = 20
const BOARD_WIDTH = 14
const BOARD_HEIGHT = 30

const board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0))

const currentPiece = {
  position: { x: 5, y: 5 },
  shape: PIECE_SHAPES[Math.floor(Math.random() * PIECE_SHAPES.length)]
}

canvas.width = (BLOCK_SIZE * BOARD_WIDTH)
canvas.height = (BLOCK_SIZE * BOARD_HEIGHT)

ctx.scale(BLOCK_SIZE, BLOCK_SIZE)
drawBoard()
drawCurrentPiece()
listenToKeyboard()
initAutomaticMovement()

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

function hasCollision(xParam, yParam) {
  if (yParam <= board.length - 1) {
    if (xParam<= board[yParam].length - 1) {
      return currentPiece.shape.find((row, y) => {
        return row.some((value, x) => {
          if (!value) return false

          if (!board[y + yParam] || board[y + yParam][x + xParam] === undefined) return true

          return board[y + yParam][x + xParam] !== 0 ? true : false
        } )
      })
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
  resetCurrentPiece()
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
      clearInterval(interval)
      initAutomaticMovement()
      break

    default: break
  }
  updateBoard()
}

function listenToKeyboard() {
  document.addEventListener('keydown', e => handleKeydown(e.key))
}

function initAutomaticMovement() {
  interval = setInterval(() => handleKeydown(EVENT_MOVEMENTS.DOWN), MOVEMENT_SPEED)
}

function resetCurrentPiece() {
  let nextShape
  do {
    nextShape = PIECE_SHAPES[getRandomNumberFromRange(0, PIECE_SHAPES.length)]
  } while (!nextShape)

  let nextShapeWidth = 0
  nextShape.forEach((row, y) => {
    if (row.length > nextShapeWidth) {
      nextShapeWidth = row.length
    }
  })

  currentPiece.position.x = getRandomNumberFromRange(0, nextShapeWidth)
  currentPiece.position.y = 0
  currentPiece.shape = nextShape
}