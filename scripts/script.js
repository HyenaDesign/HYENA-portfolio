const htmlFiles = [
    "untox.html",
    "ascii.html",
    "katana.html",
    "uselessweb.html",
    "fire.html",
    "theprestige.html"
];

const loadingDiv = document.getElementById("loading");

document.getElementById("spinBtn").addEventListener("click", function() {
    let count = 0;
    const countdownInterval = setInterval(function() {
        if (count === 0) {
            clearInterval(countdownInterval);
            const randomIndex = Math.floor(Math.random() * htmlFiles.length);
            const randomPage = htmlFiles[randomIndex];
            loadingDiv.style.display = "block";
            setTimeout(function() {
                window.location.href = randomPage;
            }, 2000);
        } else {
            console.log(count);
            count--;
        }
    }, 1000);
});