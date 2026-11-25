
/* =================================
   1. PERSONAL QUESTIONS
================================= */

const correctAnswers = {
    1: "chickadune",
    2: "gadha"
};

let unlocked = false;

function checkAnswers() {
    const answer1 = document.getElementById("answer1").value.trim().toLowerCase();
    const answer2 = document.getElementById("answer2").value.trim().toLowerCase();
    const message = document.getElementById("loginMessage");

    if (answer1 === correctAnswers[1] && answer2 === correctAnswers[2]) {
        unlocked = true;
        message.textContent = "Surprise unlocked! 💗";

        setTimeout(() => {
            goToPage(2);
        }, 800);

    } else {
        message.textContent = "Oops! One or both answers are incorrect. Try again! 💕";
    }
}


/* =================================
   2. PAGE NAVIGATION
================================= */

function goToPage(pageNumber) {
    if (pageNumber !== 1 && !unlocked) {
        return;
    }

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const targetPage = document.getElementById("page" + pageNumber);

    if (!targetPage) {
        console.error("Page not found:", pageNumber);
        return;
    }

    targetPage.classList.add("active");

    // Stop memory songs when changing pages
    stopMemorySongs();

    // Play birthday music only on Page 2
    if (pageNumber === 2) {
        playCakeMusic();
    } else {
        stopCakeMusic();
    }

    // Reset bow and arrow animation whenever Page 2 opens
    if (pageNumber === 2) {
        const intro = document.getElementById("cakeIntro");

        if (intro) {
            intro.classList.remove("shooting", "opening", "finished");
        }

        const arrowButton = document.getElementById("releaseArrowBtn");

        if (arrowButton) {
            arrowButton.disabled = false;
        }

        const cake = document.querySelector(".cake-scene");

        if (cake) {
            cake.classList.remove("blown", "cut");
        }

        const cakeMessage = document.getElementById("cakeMessage");

        if (cakeMessage) {
            cakeMessage.textContent = "Make a beautiful wish! 💖";
            cakeMessage.classList.remove("celebrate");
        }
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =================================
   3. BOW AND ARROW ANIMATION
================================= */

function releaseArrow() {
    const intro = document.getElementById("cakeIntro");
    const button = document.getElementById("releaseArrowBtn");

    if (!intro || intro.classList.contains("shooting")) {
        return;
    }

    button.disabled = true;

    // Arrow shoots
    intro.classList.add("shooting");

    // Two pastel layers slide apart
    setTimeout(() => {
        intro.classList.add("opening");
    }, 850);

    // Reveal birthday heading and cake
    setTimeout(() => {
        intro.classList.add("finished");
    }, 2100);
}


/* =================================
   4. BIRTHDAY MUSIC
================================= */

const bgMusic = document.getElementById("bgMusic");

function startMusic() {
    stopMemorySongs();

    if (!bgMusic) {
        console.error("Birthday music element not found.");
        return;
    }

    if (bgMusic.paused) {
        bgMusic.play().catch(error => {
            console.error("Birthday music error:", error);
            alert("Please tap the music button again to play the song.");
        });
    } else {
        bgMusic.pause();
    }
}

function playCakeMusic() {
    if (!bgMusic) {
        console.error("Birthday music element not found.");
        return;
    }

    bgMusic.currentTime = 0;

    bgMusic.play().catch(error => {
        console.log("Browser blocked autoplay:", error);
    });
}

function stopCakeMusic() {
    if (!bgMusic) return;

    bgMusic.pause();
    bgMusic.currentTime = 0;
}


/* =================================
   5. MEMORY SONGS
================================= */

function stopMemorySongs() {
    document.querySelectorAll(".memory-song").forEach(song => {
        song.pause();
        song.currentTime = 0;
    });

    document.querySelectorAll(".memory-card button").forEach(button => {
        button.textContent = "Play Memory Song 🎵";
    });
}


function playMemorySong(button) {

    // Find the audio element inside the memory card
    const memoryCard = button.closest(".memory-card");

    if (!memoryCard) {
        alert("Memory card not found.");
        return;
    }

    const currentSong = memoryCard.querySelector(".memory-song");

    // Check whether the audio element exists
    if (!currentSong) {
        alert("Audio element not found in this memory card.");
        console.error("No .memory-song element found.");
        return;
    }

    // Stop birthday background music
    if (bgMusic) {
        bgMusic.pause();
    }

    // Stop other memory songs
    document.querySelectorAll(".memory-song").forEach(song => {
        if (song !== currentSong) {
            song.pause();
            song.currentTime = 0;
        }
    });

    // Reset other buttons
    document.querySelectorAll(".memory-card button").forEach(btn => {
        if (btn !== button) {
            btn.textContent = "Play Memory Song 🎵";
        }
    });

    if (currentSong.paused) {

        console.log("Playing memory song:", currentSong.currentSrc || currentSong.src);

        currentSong.play().then(() => {

            button.textContent = "Pause Memory Song ⏸";

        }).catch(error => {

            button.textContent = "Play Memory Song 🎵";

            console.error("Memory song playback failed:", error);
            console.error("Audio source:", currentSong.currentSrc || currentSong.src);
            console.error("Audio error:", currentSong.error);

            alert(
                "Audio Error: " +
                error.name +
                " - " +
                error.message +
                "\n\nFile: " +
                (currentSong.currentSrc || currentSong.src)
            );
        });

    } else {

        currentSong.pause();
        button.textContent = "Play Memory Song 🎵";
    }

    currentSong.onended = () => {
        button.textContent = "Play Memory Song 🎵";
    };

    currentSong.onpause = () => {
        button.textContent = "Play Memory Song 🎵";
    };
}


/* =================================
   6. BLOW CANDLES
================================= */

function blowCandles() {
    const cake = document.querySelector(".cake-scene");
    const message = document.getElementById("cakeMessage");

    if (!cake || !message) return;

    cake.classList.add("blown");

    message.textContent = "Your wish is on its way! ✨💗";
    message.classList.add("celebrate");

    launchConfetti();
}


/* =================================
   7. CUT THE CAKE
================================= */

function cutCake() {
    const cake = document.querySelector(".cake-scene");
    const message = document.getElementById("cakeMessage");

    if (!cake || !message) return;

    if (!cake.classList.contains("blown")) {
        message.textContent = "First blow out the candles! 🌬️";
        return;
    }

    if (cake.classList.contains("cut")) {
        message.textContent = "The cake is already cut! Enjoy! 🍰";
        return;
    }

    cake.classList.add("cut");

    message.textContent = "Happy Birthday! Let's celebrate! 🎂💖";
    message.classList.add("celebrate");

    launchConfetti();
}


/* =================================
   8. CONFETTI EFFECT
================================= */

function launchConfetti() {
    const emojis = ["💗", "💙", "✨", "🎉", "🌸", "💕", "🎊"];

    for (let i = 0; i < 35; i++) {
        const particle = document.createElement("div");

        particle.className = "confetti";
        particle.textContent =
            emojis[Math.floor(Math.random() * emojis.length)];

        particle.style.left = Math.random() * 100 + "vw";
        particle.style.animationDelay = Math.random() * 1.5 + "s";

        document.body.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 4500);
    }
}


/* =================================
   9. MOOD INTERACTION GAME
================================= */

function chooseMood(mood) {
    const result = document.getElementById("moodResult");
    const emoji = document.getElementById("moodEmoji");

    if (!result || !emoji) return;

    if (mood === "angry") {
        emoji.textContent = "🥊";
        result.textContent = "Feeling angry? You can beat me up! 😂";
    }

    else if (mood === "love") {
        emoji.textContent = "😘";
        result.textContent = "Sending you lots of kisses! 💋";
    }

    else if (mood === "peace") {
        emoji.textContent = "🤗";
        result.textContent = "Here's the biggest virtual hug! 💗";
    }
}


/* =================================
   10. CATCHING HEARTS GAME
================================= */

let score = 0;
let gameRunning = false;
let gameInterval = null;
let gameTimer = null;
let fallingItems = [];

const gameArea = document.getElementById("gameArea");
const bucket = document.getElementById("bucket");


function moveBucket(position) {
    if (!gameRunning || !gameArea || !bucket) return;

    const areaRect = gameArea.getBoundingClientRect();
    const bucketWidth = bucket.offsetWidth;

    let newPosition = position - areaRect.left - bucketWidth / 2;

    newPosition = Math.max(
        0,
        Math.min(newPosition, gameArea.clientWidth - bucketWidth)
    );

    bucket.style.left = newPosition + "px";
}


// Mouse and touch movement
if (gameArea) {
    gameArea.addEventListener("pointermove", event => {
        moveBucket(event.clientX);
    });
}


// Keyboard controls
document.addEventListener("keydown", event => {
    if (!gameRunning || !gameArea || !bucket) return;

    const current = parseFloat(bucket.style.left) ||
        (gameArea.clientWidth - bucket.offsetWidth) / 2;

    if (event.key === "ArrowLeft") {
        bucket.style.left = Math.max(0, current - 25) + "px";
    }

    if (event.key === "ArrowRight") {
        bucket.style.left = Math.min(
            gameArea.clientWidth - bucket.offsetWidth,
            current + 25
        ) + "px";
    }
});


function startCatchGame() {

    if (!gameArea || !bucket) {
        console.error("Game area or bucket not found.");
        return;
    }

    stopCatchGame();

    score = 0;
    gameRunning = true;

    document.getElementById("score").textContent = score;

    document.getElementById("gameMessage").textContent =
        "Catch as many as you can! 💗";

    bucket.style.left =
        (gameArea.clientWidth - bucket.offsetWidth) / 2 + "px";

    gameInterval = setInterval(createFallingItem, 700);

    gameTimer = setTimeout(() => {

        stopCatchGame();

        document.getElementById("gameMessage").textContent =
            "Game over! Your final score is " + score + "! 🎉";

    }, 30000);
}


function createFallingItem() {
    if (!gameRunning || !gameArea || !bucket) return;

    const item = document.createElement("div");

    const emojis = ["💗", "💙", "🍫", "🍬", "💕"];

    item.className = "falling-item";

    item.textContent =
        emojis[Math.floor(Math.random() * emojis.length)];

    item.style.left =
        Math.random() * Math.max(0, gameArea.clientWidth - 35) + "px";

    gameArea.appendChild(item);

    fallingItems.push(item);

    let position = -35;

    const fallSpeed = 2 + Math.random() * 2;

    const fallInterval = setInterval(() => {

        if (!gameRunning) {
            clearInterval(fallInterval);
            item.remove();
            return;
        }

        position += fallSpeed;

        item.style.top = position + "px";

        const itemRect = item.getBoundingClientRect();
        const bucketRect = bucket.getBoundingClientRect();

        const collision =
            itemRect.bottom >= bucketRect.top &&
            itemRect.left < bucketRect.right &&
            itemRect.right > bucketRect.left &&
            itemRect.top < bucketRect.bottom;

        if (collision) {

            score++;

            document.getElementById("score").textContent = score;

            item.remove();

            clearInterval(fallInterval);

            fallingItems = fallingItems.filter(el => el !== item);
        }

        else if (position > gameArea.clientHeight) {

            item.remove();

            clearInterval(fallInterval);

            fallingItems = fallingItems.filter(el => el !== item);
        }

    }, 20);
}


function stopCatchGame() {

    gameRunning = false;

    clearInterval(gameInterval);
    clearTimeout(gameTimer);

    gameInterval = null;
    gameTimer = null;

    fallingItems.forEach(item => item.remove());

    fallingItems = [];
}
