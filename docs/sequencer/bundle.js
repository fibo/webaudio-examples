window.addEventListener('load', function () {
  const table = document.querySelector('table')
  const tbody = table.tbody
  const context = new AudioContext()

  let numSamplesLoaded = 0

  const play = {}

  let time = 0

  function onload (request, sound) {
    return function () {

      numSamplesLoaded++
      play[sound] = {}

      context.decodeAudioData(request.response, buffer => {

        function start () {
          const source = context.createBufferSource()

          source.buffer = buffer

          source.connect(context.destination)

          source.start()
        }

        play[sound].start = start

        if (numSamplesLoaded === 3) {
          setInterval(function loop () {
            time = time % 48
            time++

            // console.log(time)
            if (play.hihat && (time % 3 !== 1)) {
               play.hihat.start()
            }

            if (play.snare && (time % 5 === 2 || time % 7 === 6)) {
               play.snare.start()
            }

            if (play.kick && (time % 8 === 4 || time % 12 === 5)) {
               play.kick.start()
            }
          }, 250)
        }
      })
    }
  }

  function loadSample (sound, onload) {
    const url = sound + '.wav'
    const request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.responseType = 'arraybuffer'

    request.onload = onload(request, sound)

    request.send()
  }

  loadSample('kick', onload)
  loadSample('hihat', onload)
  loadSample('snare', onload)
})
