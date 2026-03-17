const PROGRESS_KEY = "pv-flashcard-progress";
const ORDER_KEY = "pv-flashcard-order";
const STAGE_KEY = "pv-flashcard-stage";

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * 60 * 1000;

const ANKI_DEFAULTS = {
  learningSteps: [1 * MINUTE, 10 * MINUTE],
  relearningSteps: [10 * MINUTE],
  graduatingInterval: 1,
  easyInterval: 4,
  minimumInterval: 1,
  startingEase: 2.5,
  easyBonus: 1.3,
  intervalModifier: 1,
  newInterval: 0,
  lapseEaseDelta: 0.2,
  easyEaseDelta: 0.15,
  minimumEase: 1.3,
};

const els = {
  deckName: document.getElementById("deck-name"),
  progress: document.getElementById("progress-text"),
  stageSelect: document.getElementById("stage-select"),
  orderMode: document.getElementById("order-mode"),
  studyModeBtn: document.getElementById("study-mode-btn"),
  listModeBtn: document.getElementById("list-mode-btn"),
  studyView: document.getElementById("study-view"),
  listView: document.getElementById("list-view"),
  listGrid: document.getElementById("list-grid"),
  card: document.getElementById("card"),
  image: document.getElementById("card-image"),
  backImage: document.getElementById("back-card-image"),
  frontText: document.getElementById("front-text"),
  backText: document.getElementById("back-text"),
  translationBtn: document.getElementById("translation-btn"),
  explanationBtn: document.getElementById("explanation-btn"),
  translationPanel: document.getElementById("translation-panel"),
  explanationPanel: document.getElementById("explanation-panel"),
  translationText: document.getElementById("translation-text"),
  explanationText: document.getElementById("explanation-text"),
  audioBtn: document.getElementById("audio-btn"),
  audioPlayer: document.getElementById("audio-player"),
  againBtn: document.getElementById("again-btn"),
  goodBtn: document.getElementById("good-btn"),
  easyBtn: document.getElementById("easy-btn"),
  againTime: document.getElementById("again-time"),
  goodTime: document.getElementById("good-time"),
  easyTime: document.getElementById("easy-time"),
  resetProgressBtn: document.getElementById("reset-progress-btn"),
  listSearch: document.getElementById("list-search"),
};

const library = window.APP_DATA || {
  name: "Essential Verbs",
  stages: [],
};

const state = {
  progress: loadProgress(),
  orderMode: localStorage.getItem(ORDER_KEY) || "review",
  stageId: localStorage.getItem(STAGE_KEY) || (library.stages[0] && library.stages[0].id),
  queue: [],
  currentIndex: 0,
  currentCard: null,
  isBack: false,
  viewMode: "study",
  listSearch: "",
};

function loadProgress() {
  const saved = localStorage.getItem(PROGRESS_KEY);
  if (!saved) return { cards: {} };

  try {
    return JSON.parse(saved);
  } catch {
    return { cards: {} };
  }
}

function saveProgress() {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(state.progress));
}

function getStage() {
  return library.stages.find((stage) => stage.id === state.stageId) || library.stages[0];
}

function getFilteredCards() {
  const stage = getStage();
  const query = state.listSearch.trim().toLowerCase();
  if (!query) return stage.cards;

  return stage.cards.filter((card) =>
    [
      card.answer,
      card.frontText,
      card.backText,
      card.translation,
      card.explanation,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query)
  );
}

function getCardKey(card) {
  return `${getStage().id}:${card.id}`;
}

function getCardProgress(card) {
  const key = getCardKey(card);
  if (!state.progress.cards[key]) {
    state.progress.cards[key] = {
      status: "new",
      step: 0,
      interval: 0,
      ease: ANKI_DEFAULTS.startingEase,
      dueAt: 0,
      seen: 0,
      lastGrade: "",
      lastStudiedAt: 0,
      originalInterval: 0,
    };
  }

  const meta = state.progress.cards[key];
  meta.status ||= "new";
  meta.step = Number.isFinite(meta.step) ? meta.step : 0;
  meta.interval = Number.isFinite(meta.interval) ? meta.interval : 0;
  meta.ease = Number.isFinite(meta.ease) ? meta.ease : ANKI_DEFAULTS.startingEase;
  meta.dueAt = Number.isFinite(meta.dueAt) ? meta.dueAt : 0;
  meta.seen = Number.isFinite(meta.seen) ? meta.seen : 0;
  meta.lastGrade ||= "";
  meta.lastStudiedAt = Number.isFinite(meta.lastStudiedAt) ? meta.lastStudiedAt : 0;
  meta.originalInterval = Number.isFinite(meta.originalInterval) ? meta.originalInterval : 0;
  return meta;
}

function buildQueue() {
  const stage = getStage();
  const now = Date.now();
  const cards = [...stage.cards];

  if (state.orderMode === "random") {
    for (let i = cards.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }

  const due = [];
  const future = [];

  for (const card of cards) {
    const meta = getCardProgress(card);
    const entry = { card, dueAt: meta.dueAt || 0, seen: meta.seen || 0 };
    if (meta.status === "new" || entry.dueAt <= now) {
      due.push(entry);
    } else {
      future.push(entry);
    }
  }

  due.sort((a, b) => a.dueAt - b.dueAt || a.seen - b.seen);
  future.sort((a, b) => a.dueAt - b.dueAt);
  return [...due, ...future].map((entry) => entry.card);
}

function ensureCurrentCard() {
  if (state.queue.length === 0) state.queue = buildQueue();
  if (state.currentIndex >= state.queue.length) state.currentIndex = 0;
  state.currentCard = state.queue[state.currentIndex];
}

function buildFrontText(frontText, answer) {
  const blankWidth = Math.max(answer.replace(/\s+/g, "").length, 6);
  return frontText.replace(/(?:____\s*)+/g, `<span class="blank single-blank" style="--blank-ch:${blankWidth};"></span>`);
}

function buildSolvedText(frontText, answer, solvedText = "") {
  if (solvedText) return solvedText;
  return frontText.replace(/(?:____\s*)+/g, `<span class="filled">${answer}</span>`);
}

function formatRelative(ms, repeat = false) {
  if (ms <= 0) return repeat ? "0分後に再表示" : "0分後に表示";
  const minutes = Math.round(ms / MINUTE);
  if (minutes < 60) return repeat ? `${minutes}分後に再表示` : `${minutes}分後に表示`;
  const hours = Math.round(ms / (60 * MINUTE));
  if (hours < 24) return repeat ? `${hours}時間後に再表示` : `${hours}時間後に表示`;
  const days = Math.round(ms / DAY);
  return repeat ? `${days}日後に再表示` : `${days}日後に表示`;
}

function clampEase(value) {
  return Math.max(ANKI_DEFAULTS.minimumEase, Number(value.toFixed(2)));
}

function getFirstStep(steps) {
  return steps.length > 0 ? steps[0] : 0;
}

function getGoodReviewDays(intervalDays, ease) {
  const scaled = Math.round(intervalDays * ease * ANKI_DEFAULTS.intervalModifier);
  return Math.max(ANKI_DEFAULTS.minimumInterval, intervalDays + 1, scaled);
}

function getEasyReviewDays(intervalDays, ease) {
  const goodDays = getGoodReviewDays(intervalDays, ease);
  const scaled = Math.round(intervalDays * ease * ANKI_DEFAULTS.easyBonus * ANKI_DEFAULTS.intervalModifier);
  return Math.max(ANKI_DEFAULTS.easyInterval, goodDays + 1, scaled);
}

function getLapseGraduatingDays(meta) {
  const baseInterval = Math.max(meta.originalInterval || meta.interval || 1, 1);
  const scaled = Math.round(baseInterval * ANKI_DEFAULTS.newInterval);
  return Math.max(ANKI_DEFAULTS.minimumInterval, scaled);
}

function predictSchedule(meta, grade) {
  const learningSteps = ANKI_DEFAULTS.learningSteps;
  const relearningSteps = ANKI_DEFAULTS.relearningSteps;
  const reviewInterval = Math.max(meta.interval || 1, 1);

  if (meta.status === "review") {
    if (grade === "again") {
      return {
        status: relearningSteps.length > 0 ? "relearning" : "review",
        step: 0,
        interval: reviewInterval,
        originalInterval: reviewInterval,
        ease: clampEase(meta.ease - ANKI_DEFAULTS.lapseEaseDelta),
        dueMs: 0,
      };
    }

    if (grade === "good") {
      const nextDays = getGoodReviewDays(reviewInterval, meta.ease);
      return {
        status: "review",
        step: 0,
        interval: nextDays,
        originalInterval: 0,
        ease: meta.ease,
        dueMs: nextDays * DAY,
      };
    }

    const nextEase = clampEase(meta.ease + ANKI_DEFAULTS.easyEaseDelta);
    const nextDays = getEasyReviewDays(reviewInterval, nextEase);
    return {
      status: "review",
      step: 0,
      interval: nextDays,
      originalInterval: 0,
      ease: nextEase,
      dueMs: nextDays * DAY,
    };
  }

  if (meta.status === "relearning") {
    if (grade === "again") {
      return {
        status: "relearning",
        step: 0,
        interval: meta.interval,
        originalInterval: meta.originalInterval,
        ease: meta.ease,
        dueMs: 0,
      };
    }

    if (grade === "good") {
      const nextStep = meta.step + 1;
      if (nextStep < relearningSteps.length) {
        return {
          status: "relearning",
          step: nextStep,
          interval: meta.interval,
          originalInterval: meta.originalInterval,
          ease: meta.ease,
          dueMs: relearningSteps[nextStep],
        };
      }

      const nextDays = getLapseGraduatingDays(meta);
      return {
        status: "review",
        step: 0,
        interval: nextDays,
        originalInterval: 0,
        ease: meta.ease,
        dueMs: nextDays * DAY,
      };
    }

    const nextDays = getEasyReviewDays(Math.max(meta.originalInterval || meta.interval || 1, 1), meta.ease);
    return {
      status: "review",
      step: 0,
      interval: nextDays,
      originalInterval: 0,
      ease: clampEase(meta.ease + ANKI_DEFAULTS.easyEaseDelta),
      dueMs: nextDays * DAY,
    };
  }

  if (meta.status === "learning") {
    if (grade === "again") {
      return {
        status: "learning",
        step: 0,
        interval: 0,
        originalInterval: 0,
        ease: meta.ease,
        dueMs: 0,
      };
    }

    if (grade === "good") {
      const nextStep = meta.step + 1;
      if (nextStep < learningSteps.length) {
        return {
          status: "learning",
          step: nextStep,
          interval: 0,
          originalInterval: 0,
          ease: meta.ease,
          dueMs: learningSteps[nextStep],
        };
      }

      return {
        status: "review",
        step: 0,
        interval: ANKI_DEFAULTS.graduatingInterval,
        originalInterval: 0,
        ease: meta.ease,
        dueMs: ANKI_DEFAULTS.graduatingInterval * DAY,
      };
    }

    return {
      status: "review",
      step: 0,
      interval: ANKI_DEFAULTS.easyInterval,
      originalInterval: 0,
      ease: meta.ease,
      dueMs: ANKI_DEFAULTS.easyInterval * DAY,
    };
  }

  if (grade === "again") {
    return {
      status: "learning",
      step: 0,
      interval: 0,
      originalInterval: 0,
      ease: meta.ease,
      dueMs: 0,
    };
  }

  if (grade === "good") {
    if (learningSteps.length > 1) {
      return {
        status: "learning",
        step: 1,
        interval: 0,
        originalInterval: 0,
        ease: meta.ease,
        dueMs: learningSteps[1],
      };
    }

    return {
      status: "review",
      step: 0,
      interval: ANKI_DEFAULTS.graduatingInterval,
      originalInterval: 0,
      ease: meta.ease,
      dueMs: ANKI_DEFAULTS.graduatingInterval * DAY,
    };
  }

  return {
    status: "review",
    step: 0,
    interval: ANKI_DEFAULTS.easyInterval,
    originalInterval: 0,
    ease: meta.ease,
    dueMs: ANKI_DEFAULTS.easyInterval * DAY,
  };
}

function populateStageSelect() {
  els.stageSelect.innerHTML = "";
  for (const stage of library.stages) {
    const option = document.createElement("option");
    option.value = stage.id;
    option.textContent = stage.name;
    els.stageSelect.appendChild(option);
  }
}

function renderList() {
  const cards = getFilteredCards();
  els.listGrid.innerHTML = "";

  if (cards.length === 0) {
    els.listGrid.innerHTML = '<article class="list-empty">No matches found.</article>';
    return;
  }

  for (const card of cards) {
    const item = document.createElement("article");
    item.className = "list-card";
    item.id = `list-card-${card.id}`;
    item.innerHTML = `
      <div class="list-image-frame">
        <img src="${card.image}" alt="${card.answer}">
      </div>
      <div class="list-copy">
        <div class="list-head">
          <p class="list-answer">${card.backText}</p>
          <button class="list-audio ghost icon-btn" type="button" aria-label="Play Audio">🎧</button>
        </div>
        <p class="list-sentence">${buildSolvedText(card.frontText, card.answer, card.solvedText)}</p>
        <div class="list-controls">
          <button class="list-toggle-btn ghost" type="button">日本語</button>
          <button class="list-toggle-btn ghost" type="button">解説</button>
        </div>
        <div class="list-detail-panels">
          <div class="list-detail is-hidden">
            <span>日本語</span>
            <p>${card.translation || "未設定"}</p>
          </div>
          <div class="list-detail is-hidden">
            <span>解説</span>
            <p>${card.explanation || "未設定"}</p>
          </div>
        </div>
      </div>
    `;

    item.querySelector(".list-audio").addEventListener("click", () => {
      els.audioPlayer.src = card.audio;
      playAudio();
    });

    const [translationToggle, explanationToggle] = item.querySelectorAll(".list-toggle-btn");
    const [translationPanel, explanationPanel] = item.querySelectorAll(".list-detail");
    translationToggle.addEventListener("click", () => {
      translationPanel.classList.toggle("is-hidden");
    });
    explanationToggle.addEventListener("click", () => {
      explanationPanel.classList.toggle("is-hidden");
    });

    els.listGrid.appendChild(item);
  }
}

function setViewMode(mode) {
  state.viewMode = mode;
  const study = mode === "study";
  els.studyModeBtn.classList.toggle("is-active", study);
  els.listModeBtn.classList.toggle("is-active", !study);
  els.studyView.classList.toggle("is-hidden", !study);
  els.listView.classList.toggle("is-hidden", study);
}

function renderScheduleHints() {
  const meta = getCardProgress(state.currentCard);
  els.againTime.textContent = formatRelative(predictSchedule(meta, "again").dueMs, true);
  els.goodTime.textContent = formatRelative(predictSchedule(meta, "good").dueMs);
  els.easyTime.textContent = formatRelative(predictSchedule(meta, "easy").dueMs);
}

function render() {
  ensureCurrentCard();
  const stage = getStage();
  const card = state.currentCard;
  const stageIndex = stage.cards.findIndex((item) => item.id === card.id);
  const displayIndex = stageIndex === -1 ? state.currentIndex + 1 : stageIndex + 1;

  els.deckName.textContent = `${library.name} / ${stage.name}`;
  els.progress.textContent = `${displayIndex} / ${stage.cards.length}`;
  els.orderMode.value = state.orderMode;
  els.stageSelect.value = stage.id;
  els.listSearch.value = state.listSearch;
  els.image.src = card.image;
  els.image.alt = card.answer;
  els.backImage.src = card.image;
  els.backImage.alt = card.answer;
  els.frontText.innerHTML = buildFrontText(card.frontText, card.answer);
  els.backText.innerHTML = buildSolvedText(card.frontText, card.answer, card.solvedText);
  els.translationText.textContent = card.translation || "日本語訳は未設定です。";
  els.explanationText.textContent = card.explanation || "解説は未設定です。";
  setAudioSource(card.audio);
  els.card.classList.toggle("is-back", state.isBack);
  els.card.classList.toggle("is-front", !state.isBack);
  renderScheduleHints();
  renderList();
  setViewMode(state.viewMode);
}

function clearInstantFlip() {
  requestAnimationFrame(() => {
    els.card.classList.remove("is-instant");
  });
}

function setFront(options = {}) {
  if (options.instant) {
    els.card.classList.add("is-instant");
  }
  state.isBack = false;
  els.translationPanel.classList.add("is-hidden");
  els.explanationPanel.classList.add("is-hidden");
  render();
  if (options.instant) {
    clearInstantFlip();
  }
}

function setBack() {
  state.isBack = true;
  render();
  setAudioSource(state.currentCard.audio);
  playAudio();
}

function setAudioSource(src) {
  const resolvedSrc = new URL(src, window.location.href).href;
  if (els.audioPlayer.src === resolvedSrc) return;
  els.audioPlayer.src = resolvedSrc;
}

function playAudio() {
  els.audioPlayer.currentTime = 0;
  const playback = els.audioPlayer.play();
  if (playback && typeof playback.catch === "function") {
    playback.catch(() => {
      const retry = () => {
        els.audioPlayer.play().catch(() => {});
      };
      els.audioPlayer.addEventListener("canplay", retry, { once: true });
    });
  }
}

function scheduleCurrent(grade) {
  const card = state.currentCard;
  const meta = getCardProgress(card);
  const now = Date.now();
  const next = predictSchedule(meta, grade);

  meta.seen += 1;
  meta.lastGrade = grade;
  meta.lastStudiedAt = now;
  meta.status = next.status;
  meta.step = next.step;
  meta.interval = next.interval;
  meta.ease = next.ease;
  meta.dueAt = now + next.dueMs;
  meta.originalInterval = next.originalInterval;

  saveProgress();

  state.queue = buildQueue();
  if (grade === "again") {
    const currentId = card.id;
    const sameIndex = state.queue.findIndex((item) => item.id === currentId);
    state.currentIndex = sameIndex === -1 ? 0 : sameIndex;
  } else if (state.orderMode === "random") {
    state.currentIndex = 0;
  } else {
    const currentId = card.id;
    const nextIndex = state.queue.findIndex((item) => item.id !== currentId);
    state.currentIndex = nextIndex === -1 ? 0 : nextIndex;
  }

  setFront({ instant: true });
}

function reloadStage() {
  state.queue = buildQueue();
  state.currentIndex = 0;
  setFront();
}

els.card.addEventListener("click", () => {
  if (!state.isBack) {
    setBack();
  }
});

els.audioBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  playAudio();
});

els.translationBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  els.translationPanel.classList.toggle("is-hidden");
});

els.explanationBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  els.explanationPanel.classList.toggle("is-hidden");
});

els.againBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  scheduleCurrent("again");
});

els.goodBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  scheduleCurrent("good");
});

els.easyBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  scheduleCurrent("easy");
});

els.orderMode.addEventListener("change", () => {
  state.orderMode = els.orderMode.value;
  localStorage.setItem(ORDER_KEY, state.orderMode);
  reloadStage();
});

els.stageSelect.addEventListener("change", () => {
  state.stageId = els.stageSelect.value;
  localStorage.setItem(STAGE_KEY, state.stageId);
  reloadStage();
});

els.studyModeBtn.addEventListener("click", () => setViewMode("study"));
els.listModeBtn.addEventListener("click", () => {
  state.listSearch = "";
  els.listSearch.value = "";
  renderList();
  setViewMode("list");
});
els.listSearch.addEventListener("input", () => {
  state.listSearch = els.listSearch.value;
  renderList();
});

els.resetProgressBtn.addEventListener("click", () => {
  state.progress = { cards: {} };
  saveProgress();
  reloadStage();
});

document.addEventListener("keydown", (event) => {
  if (event.key === " " || event.key === "Enter") {
    event.preventDefault();
    if (!state.isBack) setBack();
    return;
  }

  if (!state.isBack) return;
  if (event.key === "1") scheduleCurrent("again");
  if (event.key === "2") scheduleCurrent("good");
  if (event.key === "3") scheduleCurrent("easy");
});

populateStageSelect();
state.queue = buildQueue();
ensureCurrentCard();
setFront();
