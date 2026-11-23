const typeParam = new URLSearchParams(window.location.search).get("type");
const selectedType = typeParam === "video" || typeParam === "design" ? typeParam : "";
const workCards = document.querySelectorAll("[data-work-type]");
let visibleCount = 0;

for (const card of workCards) {
  card.hidden = selectedType !== "" && card.dataset.workType !== selectedType;
  if (!card.hidden) visibleCount++;
}

for (const link of document.querySelectorAll("[data-filter]")) {
  const selected = link.dataset.filter === selectedType;
  link.classList.toggle("selected", selected);
  if (selected) link.setAttribute("aria-current", "page");
  else link.removeAttribute("aria-current");
}

document.getElementById("work-count").textContent = visibleCount + " 件作品";
