const domgame = require('./')
const html = require('bel')

const targets = Array(10).fill(1)
const targetValues = targets.reduce((map, target, id) => {
  map[id] = Math.floor(Math.random()*60000)
  return map
}, {})

const game = domgame(function () {
  return html`<body id="game">
    <div id="time">Time remaining: ${this.time_remaining()}</div>
    <div id="score">Score: ${this.score()}</div>
    ${targets.map((target, id) => html`<div class="target" onclick=${() => this.click(id)}>target ${id}: ${targetValues[id]} points</div>`)}
  </body>`
}, { timeLimit: 60000, targetValues })

game.on('ready', function (state) {
  state.start()
  game.once('end', gameHistory => {
    console.log('game over', gameHistory)
  })
})

document.body = game()