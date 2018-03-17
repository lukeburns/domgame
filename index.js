const xoo = require('xoo')

module.exports = function (view, config={}) {
  const timeLimit = config.timeLimit || 60000
  const targetValues = config.targetValues || { 'target': 1 }
  const clickLimit = Object.keys(targetValues).length
    
  // state
  const bind = xoo({
    view: 'ready',
    time: 0,
    clicks: [],
    interval: null,
    clicks_remaining () {
      return clickLimit - this.clicks.length
    },
    time_remaining () {
      return timeLimit - this.time
    },
    playing () {
      return this.time_remaining() > 0 && (this.clicks_remaining() > 0 || clickLimit === 0) && this.interval
    },
    correct () {
      return this.clicks.reduce((prev, next) => prev + (next.award ? 1 : 0), 0)
    },
    score () {
      return this.clicks.reduce((prev, next) => prev + next.award, 0)
    },
    points() {
      return this.time_remaining() + this.score()
    },
    reset () {
      this.view = 'ready'
      this.time = 0
      this.clicks = []
      this.interval = null
    },
    start () {
      this.interval = setInterval(() => this.tick(20), 20)
      game.emit('start')
    },
    click (target) { 
      if (!this.playing()) return
      
      const existing = this.clicks.find(el => el.target === target)
      
      if (!existing) {
        this.clicks.push({ target: target, time_remaining: this.time_remaining(), award: targetValues[target] })
      }

      if (!this.playing()) { this.end() }
    },
    tick (ms=10) { 
      if (this.time < timeLimit) {
        this.time += ms 
      } else {
        this.end()
        this.time = timeLimit
      }
    },
    end () {
      clearInterval(this.interval)
      game.emit('end', this.clicks)
    }
  })
  
  // view
  const game = bind(view)
  
  // events
  game.on('load', (state, element, ...external) => {
    state.reset()
    game.emit('ready', state, ...external)
  })
  
  return game
}