const startBtn = document.getElementById("startMusic");
const player = document.getElementById("player");
const lyrics = document.querySelectorAll(".lyrics span");
const song1Btn = document.getElementById("song1Btn");
const song2Btn = document.getElementById("song2Btn");

let lastTime = 0;
let isPlaying = false;
let currentSong = null;
let fadeInterval = null;

startBtn.addEventListener("click", () => {
  if (isPlaying) {
    // pause
    lastTime = player.currentTime;
    fadeOut(player, 1000, () => {
      isPlaying = false;
      startBtn.textContent = "Resume";
    });
  } else {
    // resume
    player.currentTime = lastTime;
    player.volume = 0;
    player.play();
    fadeIn(player, 1000);
    isPlaying = true;
    startBtn.textContent = "Pause";
  }
});

// ganti lagu
function playLagu(src, btn, lyricsId) {
  currentSong = src;
  lastTime = 0;
  player.pause();
  player.src = src;
  player.currentTime = 0; // replay dari awal
  player.volume = 0;
  player.play();
  fadeIn(player, 2000);
  isPlaying = true;

  // reset label tombol
  song1Btn.textContent = "stuck with you";
  song2Btn.textContent = "best part";

  // tombol resume jadi Pause
  startBtn.textContent = "Pause";

  // tombol lagu aktif langsung jadi Replay
  btn.textContent = "Replay Song";

  document
    .querySelectorAll(".lyrics")
    .forEach((l) => (l.style.display = "none"));
  document.getElementById(lyricsId).style.display = "block";

  // update global lyrics ke lirik lagu yang dipilih
  lyrics = document.querySelectorAll(`#${lyricsId} span`);
}

function fadeIn(audio, duration = 2000) {
  clearInterval(fadeInterval);
  audio.volume = 0;
  let step = 0.01;
  let interval = duration / (1 / step);

  fadeInterval = setInterval(() => {
    if (audio.volume < 1) {
      audio.volume = Math.min(1, audio.volume + step);
    } else {
      clearInterval(fadeInterval);
    }
  }, interval);
}

function fadeOut(audio, duration = 2000, callback) {
  clearInterval(fadeInterval);
  let step = 0.01;
  let interval = duration / (1 / step);

  fadeInterval = setInterval(() => {
    if (audio.volume > 0) {
      audio.volume = Math.max(0, audio.volume - step);
    } else {
      clearInterval(fadeInterval);
      audio.pause();
      if (callback) callback();
    }
  }, interval);
}

function toggleLagu(src) {
  if (currentSong === src) {
    if (isPlaying) {
      lastTime = player.currentTime;
      fadeOut(player, 2000, () => {
        isPlaying = false;
      });
    } else {
      player.currentTime = lastTime;
      player.volume = 0;
      player.play();
      fadeIn(player);
      isPlaying = true;
    }
  } else {
    currentSong = src;
    lastTime = 0;
    player.pause();
    player.src = src;
    player.currentTime = 0;
    player.volume = 0;
    player.play();
    fadeIn(player);
    isPlaying = true;
  }
}

// karaoke highlight
setInterval(() => {
  let currentTime = player.currentTime;
  lyrics.forEach((line) => {
    let time = parseInt(line.getAttribute("data-time"));
    if (currentTime >= time && currentTime < time + 5) {
      line.classList.add("active");
    } else if (currentTime >= time + 5 && currentTime < time + 6) {
      // setelah 2 detik → masuk fase fade out
      line.classList.remove("active");
      line.classList.add("fadeout");
    } else {
      // reset kalau udah lewat
      line.classList.remove("active", "fadeout");
    }
  });
}, 200);

song1Btn.addEventListener("click", () =>
  playLagu("aset/lagu1.mp3", song1Btn, "lyrics1")
);
song2Btn.addEventListener("click", () =>
  playLagu("aset/lagu2.mp3", song2Btn, "lyrics2")
);
