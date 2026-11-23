(() => {
  const dialog = document.createElement("dialog");
  if (typeof dialog.showModal !== "function") return;

  dialog.className = "process-lightbox";
  dialog.setAttribute("aria-labelledby", "process-preview-title");
  dialog.innerHTML = `
    <div class="process-lightbox-bar">
      <h2 id="process-preview-title"></h2>
      <form method="dialog">
        <button type="submit" aria-label="关闭大图" autofocus>×</button>
      </form>
    </div>
    <img class="process-lightbox-image" alt="">
  `;
  document.body.append(dialog);

  const title = dialog.querySelector("h2");
  const enlarged = dialog.querySelector("img");
  let trigger = null;

  document.querySelectorAll(".process-preview").forEach(link => {
    link.setAttribute("aria-haspopup", "dialog");
    link.addEventListener("click", event => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      trigger = link;
      title.textContent = link.querySelector("img").alt;
      enlarged.src = link.href;
      dialog.showModal();
    });
  });

  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    trigger?.focus({ preventScroll: true });
    trigger = null;
  });
})();
