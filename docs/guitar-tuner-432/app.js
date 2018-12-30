window.addEventListener('load', function () {
  const context = new AudioContext()

  const buttons = document.querySelectorAll('button')

  // Golden ratio frequencies for guitar strings taken from here:
  // http://andreamaicreative.com/how-to-tune-your-guitar-to-432-hz/
  // Lower frequencies are played with a lower volume so it is necessary to adjust gain.
  const notes = [
    {
      notation: 'E4',
      frequency: 323,
      gain: 0.2
    },
    {
      notation: 'B3',
      frequency: 242,
      gain: 0.3
    },
    {
      notation: 'G3',
      frequency: 193,
      gain: 0.5
    },
    {
      notation: 'D3',
      frequency: 144,
      gain: 0.7
    },
    {
      notation: 'A2',
      frequency: 108,
      gain: 0.9
    },
    {
      notation: 'E2',
      frequency: 81,
      gain: 1.1
    }
  ]

  let playing = false
  const duration = 4

  buttons.forEach((button, i) => {
    button.addEventListener('click', () => {
      if (playing) {
        return
      } else {
        playing = true

        buttons.forEach((button, j) => {
          if (i !== j) {
            button.disabled = true
          }
        })

        setTimeout(() => {
          playing = false

          buttons.forEach(button => {
            button.disabled = false
          })
        }, duration * 1000)
      }

      const oscillator = context.createOscillator()
      oscillator.frequency.value = notes[i].frequency
      oscillator.type = 'triangle'

      const gainNode = context.createGain()
      gainNode.gain.value = notes[i].gain

      // Fade out.
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);

      oscillator.connect(gainNode)
      gainNode.connect(context.destination)

      oscillator.start()
      oscillator.stop(context.currentTime + duration)
    })
  })
})
