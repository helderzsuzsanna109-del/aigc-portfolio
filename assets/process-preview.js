(() => {
  const assets = [...document.querySelectorAll(".case-process .process-preview")];
  if (!assets.length) return;

  const dialog = document.createElement("dialog");
  if (typeof dialog.showModal !== "function") return;

  dialog.className = "process-lightbox";
  dialog.setAttribute("aria-labelledby", "process-preview-title");
  dialog.innerHTML = `
    <button type="button" class="process-lightbox-arrow" aria-label="上一张图片">
      <span aria-hidden="true">‹</span>
    </button>
    <div class="process-lightbox-panel">
      <div class="process-lightbox-bar">
        <h2 id="process-preview-title" aria-live="polite"></h2>
        <form method="dialog">
          <button type="submit" aria-label="关闭大图" autofocus>×</button>
        </form>
      </div>
      <img class="process-lightbox-image" alt="">
    </div>
    <button type="button" class="process-lightbox-arrow" aria-label="下一张图片">
      <span aria-hidden="true">›</span>
    </button>
  `;
  document.body.append(dialog);

  const title = dialog.querySelector("h2");
  const enlarged = dialog.querySelector("img");
  const [previous, next] = dialog.querySelectorAll(".process-lightbox-arrow");
  let current = 0;
  let trigger = null;
  let backdropClick = null;

  function showImage(index) {
    current = index;
    const asset = assets[current];
    const name = asset.querySelector("img").alt;
    title.textContent = name;
    enlarged.alt = name;
    enlarged.src = asset.href;
  }

  function move(offset) {
    if (assets.length < 2) return;
    showImage((current + offset + assets.length) % assets.length);
  }

  previous.hidden = next.hidden = assets.length < 2;
  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));

  assets.forEach((link, index) => {
    link.setAttribute("aria-haspopup", "dialog");
    link.addEventListener("click", event => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      trigger = link;
      backdropClick = null;
      showImage(index);
      dialog.showModal();
    });
  });

  dialog.addEventListener("click", event => {
    if (event.target !== dialog) {
      backdropClick = null;
      return;
    }

    const { clientX, clientY, timeStamp } = event;
    if (backdropClick && timeStamp - backdropClick.timeStamp <= 500 &&
        Math.hypot(clientX - backdropClick.clientX, clientY - backdropClick.clientY) <= 32) {
      dialog.close();
      return;
    }
    backdropClick = { clientX, clientY, timeStamp };
  });

  dialog.addEventListener("keydown", event => {
    backdropClick = null;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    move(event.key === "ArrowLeft" ? -1 : 1);
  });
  dialog.addEventListener("close", () => {
    if (dialog.open) return;
    trigger?.focus({ preventScroll: true });
    trigger = null;
  });
})();
