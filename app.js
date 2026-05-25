const skills = window.slideSkillCatalog;

const state = {
  activeFilter: "all",
  search: "",
  selectedId: skills[0]?.id,
  activeSlide: 0
};

const els = {
  skillCount: document.querySelector("#skillCount"),
  visualCount: document.querySelector("#visualCount"),
  searchInput: document.querySelector("#searchInput"),
  filterGroup: document.querySelector("#filterGroup"),
  skillList: document.querySelector("#skillList"),
  resultCount: document.querySelector("#resultCount"),
  detailSkill: document.querySelector("#detailSkill"),
  detailTitle: document.querySelector("#detailTitle"),
  detailTone: document.querySelector("#detailTone"),
  detailUseCase: document.querySelector("#detailUseCase"),
  detailFeatures: document.querySelector("#detailFeatures"),
  detailTags: document.querySelector("#detailTags"),
  detailPalette: document.querySelector("#detailPalette"),
  mainImage: document.querySelector("#mainImage"),
  mainImageButton: document.querySelector("#mainImageButton"),
  thumbRow: document.querySelector("#thumbRow"),
  compareGrid: document.querySelector("#compareGrid"),
  compareNote: document.querySelector("#compareNote"),
  lightbox: document.querySelector("#lightbox"),
  lightboxImage: document.querySelector("#lightboxImage"),
  lightboxCaption: document.querySelector("#lightboxCaption"),
  closeLightbox: document.querySelector("#closeLightbox")
};

function uniqueTags() {
  return [...new Set(skills.flatMap((skill) => skill.tags))].sort((a, b) => a.localeCompare(b, "ja"));
}

function matchesSkill(skill) {
  const filterOk = state.activeFilter === "all" || skill.tags.includes(state.activeFilter);
  const haystack = [
    skill.label,
    skill.skill,
    skill.tone,
    skill.useCase,
    skill.features,
    skill.referenceLabel,
    skill.generatedLabel,
    ...skill.tags
  ].join(" ").toLowerCase();
  const searchOk = haystack.includes(state.search.trim().toLowerCase());
  return filterOk && searchOk;
}

function filteredSkills() {
  return skills.filter(matchesSkill);
}

function renderFilters() {
  const tags = uniqueTags();
  const buttons = [
    `<button class="filter-chip is-active" type="button" data-filter="all">すべて</button>`,
    ...tags.map((tag) => `<button class="filter-chip" type="button" data-filter="${tag}">${tag}</button>`)
  ];
  els.filterGroup.innerHTML = buttons.join("");
}

function renderList() {
  const items = filteredSkills();
  els.resultCount.textContent = `${items.length}件`;
  els.skillCount.textContent = String(skills.length);
  els.visualCount.textContent = String(skills.reduce((total, skill) => total + skill.slides.length, 0));

  if (!items.some((skill) => skill.id === state.selectedId) && items[0]) {
    state.selectedId = items[0].id;
    state.activeSlide = 0;
  }

  els.skillList.innerHTML = items.map((skill) => {
    const colors = skill.colors.map((color) => `<span style="background:${color}"></span>`).join("");
    const selected = skill.id === state.selectedId ? " is-selected" : "";
    return `
      <button class="skill-card${selected}" type="button" data-skill-id="${skill.id}">
        <img src="${skill.slides[0]}" alt="${skill.label}の表紙プレビュー">
        <span>
          <h3>${skill.label}</h3>
          <p>${skill.useCase}</p>
          <span class="mini-palette" aria-hidden="true">${colors}</span>
        </span>
      </button>
    `;
  }).join("");
}

function renderDetail() {
  const skill = skills.find((item) => item.id === state.selectedId) || skills[0];
  if (!skill) return;

  const activeImage = skill.slides[state.activeSlide] || skill.slides[0];
  els.detailSkill.textContent = skill.skill;
  els.detailTitle.textContent = skill.label;
  els.detailTone.textContent = skill.tone;
  els.detailUseCase.textContent = skill.useCase;
  els.detailFeatures.textContent = skill.features;
  els.detailTags.innerHTML = skill.tags.map((tag) => `<span class="tag">${tag}</span>`).join("");
  els.detailPalette.innerHTML = skill.colors.map((color) => `<span style="background:${color}" title="${color}"></span>`).join("");
  els.mainImage.src = activeImage;
  els.mainImage.alt = `${skill.label} 生成スライド ${state.activeSlide + 1}`;
  els.mainImageButton.dataset.openImage = activeImage;
  els.mainImageButton.dataset.openTitle = `${skill.label} / slide ${state.activeSlide + 1}`;

  els.thumbRow.innerHTML = skill.slides.map((src, index) => {
    const active = index === state.activeSlide ? " is-active" : "";
    return `
      <button class="${active}" type="button" data-slide-index="${index}" aria-label="${skill.label} ${index + 1}枚目">
        <img src="${src}" alt="">
      </button>
    `;
  }).join("");

  const referenceLabel = skill.referenceLabel || "参照トーン";
  const generatedLabel = skill.generatedLabel || "生成結果";
  els.compareNote.textContent = skill.compareNote || `左が${referenceLabel}、右が${generatedLabel}`;
  els.compareGrid.innerHTML = `
    <article class="compare-card">
      <h4>${referenceLabel}</h4>
      <button type="button" data-open-image="${skill.reference}" data-open-title="${skill.label} / ${referenceLabel}">
        <img src="${skill.reference}" alt="${skill.label}の${referenceLabel}一覧">
      </button>
    </article>
    <article class="compare-card">
      <h4>${generatedLabel}</h4>
      <button type="button" data-open-image="${skill.generated}" data-open-title="${skill.label} / ${generatedLabel}">
        <img src="${skill.generated}" alt="${skill.label}の${generatedLabel}一覧">
      </button>
    </article>
  `;
}

function render() {
  renderList();
  renderDetail();
  els.filterGroup.querySelectorAll(".filter-chip").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === state.activeFilter);
  });
}

function openLightbox(src, title) {
  els.lightboxImage.src = src;
  els.lightboxImage.alt = title;
  els.lightboxCaption.textContent = title;
  els.lightbox.showModal();
}

renderFilters();
render();

els.searchInput.addEventListener("input", (event) => {
  state.search = event.currentTarget.value;
  render();
});

els.filterGroup.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  state.activeFilter = button.dataset.filter;
  render();
});

els.skillList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-skill-id]");
  if (!button) return;
  state.selectedId = button.dataset.skillId;
  state.activeSlide = 0;
  render();
});

els.thumbRow.addEventListener("click", (event) => {
  const button = event.target.closest("[data-slide-index]");
  if (!button) return;
  state.activeSlide = Number(button.dataset.slideIndex);
  renderDetail();
});

document.body.addEventListener("click", (event) => {
  const button = event.target.closest("[data-open-image]");
  if (!button) return;
  openLightbox(button.dataset.openImage, button.dataset.openTitle);
});

els.closeLightbox.addEventListener("click", () => {
  els.lightbox.close();
});

els.lightbox.addEventListener("click", (event) => {
  if (event.target === els.lightbox) {
    els.lightbox.close();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && els.lightbox.open) {
    els.lightbox.close();
  }
});
