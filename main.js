/* eslint-disable no-unused-vars */
const cellSize = 10

let width = 1190
let height = 700

let n = Math.round(width / cellSize)
let m = Math.round(height / cellSize)

let stopped = true
let grid = true

let cellColor = '#5fa4f4'
let backgroundColor = '#212121'
let lineColor = '#4c4c4c'

let field = []
for (let i = 0; i < n; i++) {
  field[i] = []
  for (let j = 0; j < m; j++) {
    field[i][j] = 0
  }
}

function initField () {
  let canvas = document.getElementById('canvas')

  canvas.addEventListener('click', function (evt) {
    let i = Math.ceil(evt.clientX / cellSize) - 1
    let j = Math.ceil(evt.clientY / cellSize) - 6

    if (field[i][j] === 1) {
      field[i][j] = 0
    } else {
      field[i][j] = 1
    }

    drawField()

    console.log(evt.clientX / cellSize + ',' + evt.clientY / cellSize)
  }, false)

  resetFiled()

  drawField()
}

function drawField () {
  let canvas = document.getElementById('canvas')
  let context = canvas.getContext('2d')

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (field[i][j] === 1) {
        context.fillStyle = cellColor
        context.fillRect(i * cellSize, j * cellSize, cellSize, cellSize)
      } else {
        context.fillStyle = backgroundColor
        context.fillRect(i * cellSize, j * cellSize, cellSize, cellSize)
      }
    }
  }

  plotGrid()
}

function plotGrid () {
  let canvas = document.getElementById('canvas')
  let context = canvas.getContext('2d')

  for (let x = 0; x < width + 1; x += cellSize) {
    context.moveTo(x, 0)
    context.lineTo(x, height)
  }

  for (let y = 0; y < height + 1; y += cellSize) {
    context.moveTo(0, y)
    context.lineTo(width, y)
  }
  if (!grid) {
    context.strokeStyle = backgroundColor
  } else {
    context.strokeStyle = lineColor
  }

  context.stroke()
}

function start () {
  if (stopped) {
    stopped = false
    updateField()
  } else {
    stopped = true
  }
}

function initRandom () {
  resetFiled()

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      field[i][j] = (Math.random() > 0.5) ? 1 : 0
    }
  }

  drawField()
}

/**
 C   N                  new C
 1   0,1             ->  0  # Lonely
 1   4,5,6,7,8       ->  0  # Overcrowded
 1   2,3             ->  1  # Lives
 0   3               ->  1  # It takes three to give birth!
 0   0,1,2,4,5,6,7,8 ->  0  # Barren
 **/
function updateField () {
  if (stopped) return

  let j
  let i
  let newFiled = []

  // Init all elements to 0
  for (i = 0; i < n; i++) {
    newFiled[i] = []
    for (j = 0; j < m; j++) { newFiled[i][j] = 0 }
  }

  for (i = 1; i < n - 1; i++) {
    for (j = 1; j < m - 1; j++) {
      let currentCell = field[i][j]

      let top = field[i - 1][j]
      let bottom = field[i + 1][j]
      let left = field[i][j - 1]
      let right = field[i][j + 1]

      let topLeft = field[i - 1][j - 1]
      let topRight = field[i - 1][j + 1]
      let bottomLeft = field[i + 1][j - 1]
      let bottomRight = field[i + 1][j + 1]

      let neighbors = top + bottom + left + right + topLeft + topRight + bottomLeft + bottomRight

      if (currentCell === 1) {
        if (neighbors < 2 || neighbors > 3) {
          newFiled[i][j] = 0
        } else {
          newFiled[i][j] = currentCell
        }
      } else if (currentCell === 0 && neighbors === 3) {
        newFiled[i][j] = 1
      }
    }
  }

  field = newFiled
  drawField()
  setTimeout(updateField, 100)
}

function resetFiled () {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) { field[i][j] = 0 }
  }
}

function toggleGrid () {
  grid = !grid

  if (stopped) {
    plotGrid()
  }
}

function initGun () {
  resetFiled()

  let gun = []
  for (var i = 0; i < 36; i++) {
    gun[i] = []
    for (var j = 0; j < 9; j++) { gun[i][j] = 0 }
  }
  gun[0] = gun[1] = [0, 0, 0, 0, 1, 1, 0, 0, 0]
  gun[34] = gun[35] = [0, 0, 1, 1, 0, 0, 0, 0, 0]
  gun[10] = gun[16] = [0, 0, 0, 0, 1, 1, 1, 0, 0]
  gun[11] = gun[15] = [0, 0, 0, 1, 0, 0, 0, 1, 0]
  gun[12] = gun[13] = [0, 0, 1, 0, 0, 0, 0, 0, 1]
  gun[14][5] = gun[17][5] = 1
  gun[20] = gun[21] = [0, 0, 1, 1, 1, 0, 0, 0, 0]
  gun[22] = [0, 1, 0, 0, 0, 1, 0, 0, 0]
  gun[24] = [1, 1, 0, 0, 0, 1, 1, 0, 0]

  for (i = 0; i < 36; i++) {
    for (j = 0; j < 9; j++) { field[i + 1][j + 1] = gun[i][j] }
  }

  drawField()
}

function clearAll () {
  resetFiled()
  drawField()
}
