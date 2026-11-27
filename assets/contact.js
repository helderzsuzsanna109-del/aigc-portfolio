(() => {
  const dialog = document.createElement("dialog");
  if (typeof dialog.showModal !== "function") return;

  dialog.className = "contact-dialog";
  dialog.setAttribute("aria-labelledby", "contact-dialog-title");
  dialog.innerHTML = `
    <div class="contact-dialog-panel">
      <div class="contact-dialog-header">
        <h2 id="contact-dialog-title">联系我</h2>
        <form method="dialog">
          <button class="contact-dialog-close" type="submit" aria-label="关闭联系方式" autofocus>×</button>
        </form>
      </div>
      <dl class="contact-details">
        <div>
          <dt>邮箱</dt>
          <dd><a href="mailto:1179843652@qq.com">1179843652@qq.com</a></dd>
        </div>
        <div>
          <dt>电话</dt>
          <dd><a href="tel:17701163069">17701163069</a></dd>
        </div>
      </dl>
      <figure class="contact-qr">
        <img src="assets/contact-wechat-qr.png" alt="微信联系方式二维码" width="348" height="348" loading="lazy">
        <figcaption>微信扫码联系</figcaption>
      </figure>
    </div>
  `;
  document.body.append(dialog);

  let returnFocus = null;
  function showContact(trigger) {
    if (dialog.open) return;
    returnFocus = trigger.closest("details")?.querySelector("summary") ?? trigger;
    dialog.showModal();
  }

  document.addEventListener("click", event => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const trigger = event.target.closest('a[href="about.html#contact"], a#contact');
    if (!trigger) return;
    event.preventDefault();
    showContact(trigger);
  });

  dialog.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    returnFocus?.focus({ preventScroll: true });
    returnFocus = null;
  });

  const contactAnchor = document.querySelector("a#contact");
  if (contactAnchor && window.location.hash === "#contact") showContact(contactAnchor);
})();
