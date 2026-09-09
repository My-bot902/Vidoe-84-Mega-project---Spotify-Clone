let currentSong = new Audio();

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    // console.log(as)
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".MP3") || element.href.endsWith(".weba")) {

            songs.push(element.href.split("%5C").pop())

        }
    }
    return songs
}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs" + track)
    currentSong.src = "/songs/" + track
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }
    let cleanTrackName = decodeURIComponent(track).replace(/\.(weba|mp4)/gi, "");
    document.querySelector(".songinfo").innerHTML = cleanTrackName;

    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

}


async function main() {
    // Get the list of all the songs
    let songs = await getSongs()
    playMusic(songs[0], true)
    // console.log(songs)

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];

    for (const song of songs) {
        // 1. Pehle naam ko decode karenge taake %20 khatam ho kar space ban jaye
        let cleanName = decodeURIComponent(song);

        // 2. Phir saari extensions (.Mp3 aur .weba dono) ko aik hi baar mein hata denge
        cleanName = cleanName.replace(/\.(mp3|weba|mp4)/gi, "");


        songUL.innerHTML = songUL.innerHTML + `
                        <li data-song="${song}">

                            <img class="invert" src="img/music.svg" alt="music icon">
                            <div class="info">
                                <div>${cleanName}</div>
                                <div>Artist Name</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="play icon">
                            </div>
                        </li>`;
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.getAttribute("data-song"));
        })
    })


    // Attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

// Attach the listener to the parent container (.left) instead of the button itself
document.querySelector(".left").addEventListener("click", (event) => {
    // If the clicked element (or its parent) is the close button
    if (event.target.closest(".close")) {
        document.querySelector(".left").style.left = "-120%";
    }
});


    //=========== Click on the song also closes the hamburger
    // 2. Select all <li> elements inside songUL
    const songListItems = songUL.querySelectorAll("li");

    // 3. Loop through each <li> and attach the click event listener
    songListItems.forEach(li => {
        li.addEventListener("click", () => {
            document.querySelector(".left").style.left = "-120%";
        });
    });
}

main()