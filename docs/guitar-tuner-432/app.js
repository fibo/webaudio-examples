window.addEventListener('load', function () {
  const context = new AudioContext()

  const buttons = document.querySelectorAll('button')

  // Golden ratio frequencies for guitar strings taken from here:
  // http://andreamaicreative.com/how-to-tune-your-guitar-to-432-hz/
  const frequencies = [323, 242, 193, 144, 108, 81]

  let playing = false
  const duration = 4

  buttons.forEach((button, i) => {
    button.addEventListener('click', () => {
      if (playing) {
        return
      } else {
        playing = true

        setTimeout(() => {
          playing = false
        }, duration * 1000)
      }
      const oscillator = context.createOscillator()
      oscillator.frequency.value = frequencies[i]
      oscillator.type = 'sine'

      const gainNode = context.createGain()
      gainNode.gain.value = .5

      oscillator.connect(context.destination)

      oscillator.start()
      oscillator.stop(context.currentTime + duration)
    })
  })
})
