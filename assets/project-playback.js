(() => {
  const player = document.querySelector(".project-player");
  const start = player.querySelector(".project-start");
  const status = document.querySelector(".case-video-status");
  const { source, title } = player.dataset;
  const library = new URL("vendor/hls.light-1.7.4.min.js", document.currentScript.src);
  let hls;

  function showMedia(media) {
    start.hidden = true;
    player.append(media);
    media.focus({ preventScroll: true });
  }

  function reset(media, message) {
    if (!media.isConnected) return;
    const focused = document.activeElement === media;
    media.remove();
    hls?.destroy();
    hls = undefined;
    start.hidden = false;
    status.textContent = message;
    if (focused) start.focus({ preventScroll: true });
  }

  function loadHls() {
    if (window.Hls) return Promise.resolve(window.Hls);
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = library.href;
      script.onload = () => window.Hls ? resolve(window.Hls) : reject();
      script.onerror = () => {
        script.remove();
        reject();
      };
      document.head.append(script);
    });
  }

  start.addEventListener("click", async event => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (start.hidden) return;
    status.textContent = "";

    const video = document.createElement("video");
    video.controls = true;
    video.playsInline = true;
    video.poster = start.querySelector("img").src;
    video.setAttribute("aria-label", title);
    const failed = () => reset(video, "视频暂时无法加载，请点击封面重试。");
    video.addEventListener("error", failed, { once: true });
    video.addEventListener("loadedmetadata", () => video.play().catch(() => {
      // The native controls remain available if autoplay is restricted.
    }), { once: true });
    showMedia(video);

    try {
      const Hls = window.MediaSource || window.ManagedMediaSource ? await loadHls() : null;
      if (Hls?.isSupported()) {
        hls = new Hls({ enableWorker: false });
        hls.on(Hls.Events.ERROR, (_, detail) => {
          if (detail.fatal) failed();
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else {
        reset(video, "当前浏览器无法播放这段视频，请换用其他浏览器打开。");
      }
    } catch {
      failed();
    }
  });
})();
