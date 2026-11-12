const skills = window.slideSkillCatalog;

const state = {
  activeFilter: "all",
  search: "",
  selectedId: skills[0]?.id,
  activeSlide: 0,
  viewMode: "slides"
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
  viewerTabs: document.querySelector("#viewerTabs"),
  galleryTitle: document.querySelector("#galleryTitle"),
  galleryHint: document.querySelector("#galleryHint"),
  imageCounter: document.querySelector("#imageCounter"),
  prevImage: document.querySelector("#prevImage"),
  nextImage: document.querySelector("#nextImage"),
  openCurrentImage: document.querySelector("#openCurrentImage"),
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

  const referenceLabel = skill.referenceLabel || "参照トーン";
  const generatedLabel = skill.generatedLabel || "生成結果";
  const gallery = galleryItems(skill);
  const activeItem = gallery.items[gallery.index] || gallery.items[0];
  els.detailSkill.textContent = skill.skill;
  els.detailTitle.textContent = skill.label;
  els.detailTone.textContent = skill.tone;
  els.detailUseCase.textContent = skill.useCase;
  els.detailFeatures.textContent = skill.features;
  els.detailTags.innerHTML = skill.tags.map((tag) => `<span class="tag">${tag}</span>`).join("");
  els.detailPalette.innerHTML = skill.colors.map((color) => `<span style="background:${color}" title="${color}"></span>`).join("");
  els.mainImage.src = activeItem.src;
  els.mainImage.alt = activeItem.title;
  els.mainImageButton.dataset.openImage = activeItem.src;
  els.mainImageButton.dataset.openTitle = activeItem.title;
  els.openCurrentImage.dataset.openImage = activeItem.src;
  els.openCurrentImage.dataset.openTitle = activeItem.title;
  els.galleryTitle.textContent = activeItem.title;
  els.galleryHint.textContent = gallery.hint;
  els.imageCounter.textContent = `${gallery.index + 1} / ${gallery.items.length}`;
  els.prevImage.disabled = gallery.items.length < 2;
  els.nextImage.disabled = gallery.items.length < 2;
  els.viewerTabs.querySelectorAll("[data-view-mode]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.viewMode === state.viewMode);
  });

  els.thumbRow.innerHTML = gallery.items.map((item, index) => {
    const active = index === gallery.index ? " is-active" : "";
    return `
      <button class="${active}" type="button" data-image-index="${index}" aria-label="${item.title}">
        <img src="${item.src}" alt="">
      </button>
    `;
  }).join("");

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

function galleryItems(skill) {
  const referenceLabel = skill.referenceLabel || "参照トーン";
  const generatedLabel = skill.generatedLabel || "生成結果";

  if (state.viewMode === "reference") {
    return {
      index: 0,
      hint: "参照トーンを大きく表示",
      items: [
        {
          src: skill.reference,
          title: `${skill.label} / ${referenceLabel}`
        }
      ]
    };
  }

  if (state.viewMode === "generated") {
    return {
      index: 0,
      hint: "生成結果の一覧を大きく表示",
      items: [
        {
          src: skill.generated,
          title: `${skill.label} / ${generatedLabel}`
        }
      ]
    };
  }

  const items = skill.slides.map((src, index) => ({
    src,
    title: `${skill.label} / 生成スライド ${index + 1}`
  }));
  const index = Math.min(state.activeSlide, Math.max(items.length - 1, 0));
  return {
    index,
    hint: "1枚ずつプレビュー",
    items
  };
}

function setGalleryIndex(nextIndex) {
  const skill = skills.find((item) => item.id === state.selectedId) || skills[0];
  if (!skill) return;

  const gallery = galleryItems(skill);
  if (!gallery.items.length) return;
  const lastIndex = gallery.items.length - 1;
  const normalized = ((nextIndex % gallery.items.length) + gallery.items.length) % gallery.items.length;

  if (state.viewMode === "slides") {
    state.activeSlide = Math.min(normalized, lastIndex);
  }

  renderDetail();
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
  const button = event.target.closest("[data-image-index]");
  if (!button) return;
  if (state.viewMode === "slides") {
    state.activeSlide = Number(button.dataset.imageIndex);
  }
  renderDetail();
});

els.viewerTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-view-mode]");
  if (!button) return;
  state.viewMode = button.dataset.viewMode;
  renderDetail();
});

els.prevImage.addEventListener("click", () => {
  setGalleryIndex(state.activeSlide - 1);
});

els.nextImage.addEventListener("click", () => {
  setGalleryIndex(state.activeSlide + 1);
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
