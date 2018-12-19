window.addEventListener('load', function () {
  const button = document.querySelector('button')
  const slider = document.querySelector('input[type=range]')
  const hertz = document.querySelector('label[for=frequency]')

  const context = new AudioContext()

  let playing = false
  let oscillator = null
  let frequency = slider.value

  slider.addEventListener('change', event => {
    frequency = event.target.value
    hertz.textContent = `${frequency} Hz`

    oscillator.frequency.setValueAtTime(frequency, context.currentTime)
    // oscillator.frequency.linearRampToValueAtTime(frequency, context.currentTime + 1)
    // oscillator.frequency.exponentialRampToValueAtTime(frequency, context.currentTime + 1)
  })

  button.addEventListener('click', () => {
    if (playing) {
      button.textContent = 'play'

      oscillator.stop()
    } else {
      button.textContent = 'stop'

      oscillator = context.createOscillator()
      oscillator.frequency.value = frequency
      oscillator.type = 'sine' // sine, square, sawtooth, triangle or use custom period wave (see below)

      // const real = new Float32Array(3);
      // const imag = new Float32Array(3);
      // real[0] = 0
      // real[1] = 0.8
      // real[2] = 1
      // imag[0] = 0
      // imag[1] = .2
      // imag[2] = -1
      // const wave = context.createPeriodicWave(real, imag, {disableNormalization: true})
      // oscillator.setPeriodicWave(wave)

      oscillator.connect(context.destination)

      oscillator.start()
    }

    playing = !playing
  })
})
