(() => {
  const video = document.getElementById("case-video");
  const playButton = document.getElementById("case-video-play");
  const status = document.getElementById("case-video-status");

  function showPlayButton() {
    const restoreFocus = document.activeElement === video;
    video.controls = false;
    video.tabIndex = -1;
    playButton.hidden = false;
    if (restoreFocus) playButton.focus({ preventScroll: true });
  }

  function showPlaybackError() {
    status.textContent = "视频链接暂时不可用，请稍后重试。";
    showPlayButton();
  }

  video.addEventListener("error", showPlaybackError);
  playButton.addEventListener("click", async () => {
    status.textContent = "";
    playButton.hidden = true;
    video.controls = true;
    video.tabIndex = 0;
    if (video.error) video.load();
    video.focus({ preventScroll: true });

    try {
      await video.play();
    } catch (error) {
      if (error.name !== "AbortError") showPlaybackError();
    }
  });

  showPlayButton();
})();
