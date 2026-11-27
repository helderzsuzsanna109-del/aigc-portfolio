(() => {
  const dialog = document.querySelector(".design-preview");
  if (typeof dialog.showModal !== "function") return;

  const title = dialog.querySelector("h2");
  const images = dialog.querySelector(".design-preview-images");
  let opener = null;

  document.querySelectorAll("[data-design-project]").forEach(card => {
    card.addEventListener("click", event => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const project = document.getElementById("design-" + card.dataset.designProject);
      opener = card;
      title.textContent = card.querySelector("h2").textContent;
      images.replaceChildren(project.content.cloneNode(true));
      dialog.showModal();
      dialog.scrollTop = 0;
    });
  });

  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("close", () => {
    if (dialog.open) return;
    images.replaceChildren();
    opener?.focus({ preventScroll: true });
    opener = null;
  });
})();
