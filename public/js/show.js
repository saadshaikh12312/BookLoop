const descHead = document.querySelector(".desc-head");

descHead.addEventListener("click", () => {
  descHead.closest(".description").classList.toggle("open");
});
