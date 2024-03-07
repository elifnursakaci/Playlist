/* Elementlere ulaşma */
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const repeatButton = document.getElementById("repeat");
const shuffleButton = document.getElementById("shuffle");
const audio = document.getElementById("audio");
const songImage = document.getElementById("song-image");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");
const pauseButton = document.getElementById("pause");
const playButton = document.getElementById("play");
const playListButton = document.getElementById("playlist");

const maxDuration = document.getElementById("max-duration");
const currentTimeRef = document.getElementById("current-time");

const progressBar = document.getElementById("progress-bar");
const playListContainer = document.getElementById("playlist-container");
const closeButton = document.getElementById("close-button");
const playListSongs = document.getElementById("playlist-songs");

const currentProgress = document.getElementById("current-progress");

// Şu an çalan şarkının sırasını temsil eden indeks
let index = 4; // Örnek bir başlangıç indeksi

// Şarkıların tekrarını kontrol etmek için bir bayrak
let loop = true;

// JSON verisi: Şarkı listesi
const songsList = [
  {
    name: "Shinunoga E-Wa",
    link: "fujii-kaze-shinunoga-e-wa-visual.mp3",
    artist: "FujiiKaze",
    image: "assets/ab67616d0000b27322805a1b17e41ae357bd98bc.jpg",
  },
  {
    name: "Çiçekler Açsın",
    link: "assets/Ferdi-Tayfur-Cicekler-Acsin.mp3",
    artist: "Ferdi Tayfur",
    image: "https://i.ytimg.com/vi/qxIi8rIUGa0/hqdefault.jpg",
  },
  {
    name: "Back To Me",
    link: "assets/the-rose-back-to-me.mp3",
    artist: "The Rose",
    image: "assets/18c98d105ce1a0d24e84a4b23edc8d2b.1000x1000x1.jpg",
  },
  {
    name: "Merak Etme Sen",
    link: "assets/Ferdi-Tayfur-Merak-Etme-Sen-69.mp3",
    artist: "Ferdi Tayfur",
    image: "assets/9743438a76fa77e122296bb3432160e7.jpg",
  },
  {
    name: "Huzurum Kalmadı",
    link: "assets/Ferdi-Tayfur-Huzurum-Kalmadi.mp3",
    artist: "Ferdi Tayfur",
    image: "assets/Ferdi-Tayfur-Huzurum-Kalmadi-1977.jpg",
  },
  {
    name: "Flowers",
    link: "assets/miley-cyrus-flowers.mp3",
    artist: "Miley Cyrus",
    image: "assets/maxresdefault.jpg",
  },
];

// Şarkıyı çalma fonksiyonu
const playAudio = () => {
  audio.play();
  pauseButton.classList.remove("hide"); // Durma butonunu göster
  playButton.classList.add("hide"); // Çalma butonunu gizle
};

// Şarkıyı durdurma fonksiyonu
const pauseAudio = () => {
  audio.pause();
  pauseButton.classList.add("hide");
  playButton.classList.remove("hide");
};

// Şarkıyı belirli bir dizinde ayarlama fonksiyonu
const setSong = (arrayIndex) => {
  let { name, link, artist, image } = songsList[arrayIndex];

  audio.src = link;
  songName.innerHTML = name;
  songArtist.innerHTML = artist;
  songImage.src = image;

  audio.onloadedmetadata = () => {
    // Şarkının metadata'sı yüklendiğinde çalışacak
    maxDuration.innerText = timeFormatter(audio.duration);
  };

  playListContainer.classList.add("hide"); // Çalma listesini gizle
  playAudio(); // Şarkıyı çal
};

setInterval(() => {
  currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
  // İlerleme çubuğunu güncelleme (yüzde cinsinden)
  currentProgress.style.width =
    (audio.currentTime / audio.duration) * 100 + "%";
}, 1000);

// İlerleme çubuğuna tıklanma olayı
progressBar.addEventListener("click", (event) => {
  // İlerleme çubuğunun başlangıç koordinatı
  const coordStart = progressBar.getBoundingClientRect().left;

  // Tıklama noktasının x koordinatı
  const coordEnd = event.clientX;

  // İlerleme çubuğunun genişliği
  const progressBarWidth = progressBar.offsetWidth;

  // Yüzdelik olarak ilerlemeyi hesapla
  const progress = (coordEnd - coordStart) / progressBarWidth;

  // İlerleme çubuğunu güncelle
  currentProgress.style.width = progress * 100 + "%";

  // Sesin anlık süresini güncelle
  audio.currentTime = progress * audio.duration;

  // Şarkıyı çal
  playAudio();
});

// Zamanı biçimlendirme fonksiyonu
const timeFormatter = (timeInput) => {
  let minute = Math.floor(timeInput / 60);
  minute = minute < 10 ? "0" + minute : minute;
  let second = Math.floor(timeInput % 60);
  second = second < 10 ? "0" + second : second;
  return `${minute}:${second}`;
};

// Önceki şarkıyı çalma fonksiyonu
const previousSong = () => {
  if (index > 0) {
    pauseAudio();
    index = index - 1;
  } else {
    index = songsList.length - 1;
  }
  setSong(index);
};

// Sonraki şarkıyı çalma fonksiyonu
const nextSong = () => {
  if (loop) {
    if (index == songsList.length - 1) {
      index = 0;
    } else {
      index = index + 1;
    }
    setSong(index);
  } else {
    let randIndex = Math.floor(Math.random() * songsList.length);
    setSong(randIndex);
  }
};

// Tekrar butonuna tıklanma olayı
repeatButton.addEventListener("click", () => {
  if (repeatButton.classList.contains("active")) {
    repeatButton.classList.remove("active");
    audio.loop = false;
  } else {
    repeatButton.classList.add("active");
    audio.loop = true;
  }
});

// Karıştırma butonuna tıklanma olayı
shuffleButton.addEventListener("click", () => {
  if (shuffleButton.classList.contains("active")) {
    shuffleButton.classList.remove("active");
    audio.loop = true;
  } else {
    shuffleButton.classList.add("active");
    audio.loop = false;
  }
});

// Şarkı sona erdiğinde sonraki şarkıyı çal
audio.onended = () => {
  nextSong();
};

// Çalma listesi butonuna tıklanma olayı
playListButton.addEventListener("click", () => {
  playListContainer.classList.remove("hide");
});

// Kapatma butonuna tıklanma olayı
closeButton.addEventListener("click", () => {
  playListContainer.classList.add("hide");
});

// Çal butonuna tıklanma olayı
playButton.addEventListener("click", playAudio);

// Dur butonuna tıklanma olayı
pauseButton.addEventListener("click", pauseAudio);

// Önceki butonuna tıklanma olayı
prevButton.addEventListener("click", previousSong);

// Sonraki butonuna tıklanma olayı
nextButton.addEventListener("click", nextSong);

// Çalma listesini başlatma fonksiyonu
const initializePlaylist = () => {
  for (let i in songsList) {
    playListSongs.innerHTML += `<li class="playlistSong"
        onclick="setSong(${i})">
        <div class="playlist-image-container">
          <img src="${songsList[i].image}" alt="${songsList[i].name}"/>
        </div>
        <div class="playlist-song-details">
          <span id="playlist-song-name">
            ${songsList[i].name}
          </span>
          <span id="playlist-song-artist-album">
            ${songsList[i].artist}
          </span>
        </div>
      </li>`;
  }
};

// Sayfa yüklendiğinde çalışacak fonksiyon
window.onload = () => {
  index = 0; // Başlangıçta ilk şarkıyı çal
  setSong(index);
  pauseAudio(); // Sayfa yüklendiğinde şarkıyı duraklat
  initializePlaylist(); // Çalma listesini başlat
};
