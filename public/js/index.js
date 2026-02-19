const filterBtn = document.querySelector(".fs-icon.filter");
const filterPanel = document.querySelector(".filter-panel");
const filterClose = document.querySelector(".filter-close");

filterBtn.addEventListener("click", () => {
    filterPanel.classList.add("filter-panel-show");
    filterPanel.classList.remove("filter-panel-hide");
});

filterClose.addEventListener("click", closeFilter);

function closeFilter() {
    filterPanel.classList.add("filter-panel-hide");
    setTimeout(() => {
        filterPanel.classList.remove("filter-panel-show", "filter-panel-hide");
    }, 400);
}


const sortBtn = document.querySelector(".fs-icon.sort");
const sortSheet = document.querySelector(".sort-sheet");
const sortClose = document.querySelector(".sort-close");

sortBtn.addEventListener("click", () => {
    sortSheet.classList.add("sort-sheet-show");
    sortSheet.classList.remove("sort-sheet-hide");
});

sortClose.addEventListener("click", closeSort);

function closeSort() {
    sortSheet.classList.add("sort-sheet-hide");
    setTimeout(() => {
        sortSheet.classList.remove("sort-sheet-show", "sort-sheet-hide");
    }, 300);
}
