const video = document.querySelector("#cover-video");
const pauseButton = document.querySelector(".motion-toggle");
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

function showPoster() {
  video.classList.remove("has-frame");
  pauseButton.hidden = true;
}

function updatePauseButton() {
  pauseButton.classList.toggle("is-paused", video.paused);
  pauseButton.setAttribute("aria-label", video.paused ? "播放背景动效" : "暂停背景动效");
}

async function playBackground() {
  try {
    await video.play();
  } catch {
    showPoster();
  }
}

function applyMotionPreference() {
  if (motionPreference.matches) {
    video.pause();
    showPoster();
    if (video.hasAttribute("src")) {
      video.removeAttribute("src");
      video.load();
    }
    return;
  }

  video.muted = true;
  if (!video.hasAttribute("src")) video.src = video.dataset.src;
  playBackground();
}

video.addEventListener("playing", () => {
  if (motionPreference.matches) return;
  video.classList.add("has-frame");
  pauseButton.hidden = false;
  updatePauseButton();
});
video.addEventListener("pause", updatePauseButton);
video.addEventListener("error", showPoster);
pauseButton.addEventListener("click", () => {
  if (video.paused) playBackground();
  else video.pause();
});
motionPreference.addEventListener("change", applyMotionPreference);
applyMotionPreference();

const menu = document.querySelector(".mobile-menu");
const menuToggle = menu.querySelector("summary");

menu.addEventListener("keydown", event => {
  if (menu.open && event.key === "Escape") {
    menu.open = false;
    menuToggle.focus();
  }
});

document.addEventListener("click", event => {
  if (menu.open && (!menu.contains(event.target) || event.target.closest(".mobile-links a"))) {
    menu.open = false;
  }
});
