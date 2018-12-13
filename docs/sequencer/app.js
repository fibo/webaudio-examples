window.addEventListener('load', function () {
  const BPM = 120
  const positionIndicator = document.querySelector('thead tr')
  const playButton = document.querySelector('button#play')

  const context = new AudioContext()
  let sequencerIsRunning = false

  let numSamplesLoaded = 0

  const sounds = ['kick', 'hihat', 'snare']
  const play = {}
  sounds.forEach(sound => play[sound] = Function.prototype)

  let cueTimeoutId
  const positionIndicatorTimeoutIds = []

  function runNextCue (startTime) {
    const cueDuration = BPM / 60
    const octaveDuration = cueDuration / 8

    // Handle position indicator.
    for (let i = 0; i < 8; i++) {
      positionIndicatorTimeoutIds[i] = setTimeout(() => {
        if (!sequencerIsRunning) return

        for (let j = 0; j < 8; j++) {
          if (i === j) {
            positionIndicator.children[j].classList.add('active')
          } else {
            positionIndicator.children[j].classList.remove('active')
          }
        }
      }, octaveDuration * i * 1000)
    }

    // Read sequencer patterns.
    sounds.forEach(sound => {
      const patternRow = document.querySelector(`tbody tr.${sound}`)

      for (let i = 0; i < 8; i++) {
        const octave = patternRow.children[i]
        const isActive = octave.classList.contains('active')

        if (isActive) {
          play[sound](startTime + i * octaveDuration)
        }
      }
    })

    // Set next cue.
    cueTimeoutId = setTimeout(() => {
      positionIndicatorTimeoutIds.forEach(id => clearTimeout(id))

      if (sequencerIsRunning) {
        runNextCue(context.currentTime)
      }
    }, cueDuration * 1000)
  }

  function startSequencer () {
    // play.kick(context.currentTime)
    // play.snare(context.currentTime + 2)


    sequencerIsRunning = true

    runNextCue(context.currentTime)
  }

  function stopSequencer () {
    if (cueTimeoutId) clearTimeout(cueTimeoutId)

    positionIndicatorTimeoutIds.forEach(id => clearTimeout(id))

    sequencerIsRunning = false
  }

  function onload (request, sound) {
    return function () {
      numSamplesLoaded++
      context.decodeAudioData(request.response, buffer => {

        function start (time) {
          const source = context.createBufferSource()

          source.buffer = buffer

          source.connect(context.destination)

          source.start(time)
        }

        play[sound] = start

        if (numSamplesLoaded === sounds.length) {
          playButton.disabled = false
        }
      })
    }
  }

  playButton.addEventListener('click', () => {
    if (sequencerIsRunning) {
      stopSequencer()

      playButton.innerHTML = 'play'

      for (let i = 0; i < 8; i++) {
        positionIndicator.children[i].classList.remove('active')
      }
    } else {
      startSequencer()

      playButton.innerHTML = 'stop'
    }
  })

  function loadSample (sound, onload) {
    const url = sound + '.wav'
    const request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.responseType = 'arraybuffer'

    request.onload = onload(request, sound)

    request.send()
  }

  sounds.forEach(sound => {
    loadSample(sound, onload)
  })

  document.querySelectorAll('tbody td').forEach(element => {
    element.addEventListener('click', () => {
      element.classList.toggle('active')
    })
  })
})
