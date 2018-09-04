const domgame = require('../')
const html = require('bel')

// create 10 targets with random values between 0 and 5000
const targets = Array(10).fill(1).map(x => Math.floor(Math.random()*5000))

// instantiate a 60 second long game where points are earned by clicking on the 10 targets
const game = domgame(function () {
  return html`<body id="game">
    <div id="time">Time remaining: ${this.time_remaining()}</div>
    <div id="score">Score: ${this.score()}</div>
    ${targets.map((target, id) => html`<div id="target-${id}" class="target" onclick=${() => this.click(id)}>target ${id}: ${targets[id]} points</div>`)}
  </body>`
}, { timeLimit: 60000, targetValues: targets })

// start game when loaded into dom
game.on('ready', function (state) {
  state.start()
  game.once('end', gameHistory => {
    console.log('game over', gameHistory)
  })
})

// attach to the dom
document.body = game()
