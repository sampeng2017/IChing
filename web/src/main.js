import { ChineseCalendarDate, supportedDateRangeText } from "./core/chinese-calendar.js";
import { getAllHexagrams, Hexagram } from "./core/bagua.js";
import { divine, divineNow } from "./core/divination.js";
import { getImageUrl, getTabContent } from "./core/descriptions.js";
import { labels } from "./core/labels.js";
import { registerSW } from "virtual:pwa-register";
import "./styles/app.css";

const tabs = [
  ["main", labels.hexagramMain],
  ["symbols", labels.hexagramSymbol],
  ["poems", labels.hexagramPoem],
  ["judge", labels.hexagramJudgement],
  ["classified", labels.hexagramJudgementClassified],
  ["structure", "卦象結構"],
  ["meihua", labels.hexagramMeihua],
];

const allHexagrams = getAllHexagrams(1);
const historyStorageKey = "iching.savedReadings.v1";
const maxSavedReadings = 30;
const methodText = [
  "梅花易數起卦以年月日時取數，配合農曆年月日與時辰定上下卦，再以總數取動爻。本應用保留舊版起卦邏輯，並以瀏覽器隨機數提供隨機起卦。",
  "本卦表示當下格局，動爻指出變化焦點，之卦表示趨勢。梅花易數頁面列出體卦、用卦、五行生剋與變卦關係，供對照研讀。",
  "六十四卦瀏覽可不經起卦直接查看每一卦的卦辭、爻辭、象意、分類判斷、卦象結構與梅花易數資料，適合查閱與學習。",
].join("\n\n");
const disclaimerText =
  "本工具內容屬傳統文化、易學研讀與娛樂參考，不構成法律、醫療、財務、心理、投資或其他專業建議。重大決策請諮詢合格專業人士。";

const state = {
  currentDate: new ChineseCalendarDate(new Date()),
  currentHexagram: null,
  activeTab: "main",
  error: "",
  notice: "",
  browseOpen: false,
  savedReadings: loadSavedReadings(),
};

const app = document.querySelector("#app");

registerSW({ immediate: true });

function loadSavedReadings() {
  try {
    const raw = localStorage.getItem(historyStorageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistSavedReadings() {
  try {
    localStorage.setItem(historyStorageKey, JSON.stringify(state.savedReadings));
  } catch {
    state.notice = "保存失敗：瀏覽器儲存空間可能已滿或被停用。";
  }
}

function formatSavedAt(value) {
  return new Intl.DateTimeFormat("zh-Hant", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function createHexagram(storeSequence, changingIndex = 1) {
  const selected = allHexagrams[storeSequence - 1] ?? allHexagrams[0];
  return new Hexagram(selected.upper, selected.lower, changingIndex);
}

function getReadingTitle(hexagram = state.currentHexagram) {
  return hexagram ? hexagram.toString() : labels.title;
}

function getReadingText(hexagram = state.currentHexagram) {
  if (!hexagram) return "";
  const sections = tabs.map(([id, label]) => `${label}\n${getTabContent(hexagram, id)}`);
  return [
    getReadingTitle(hexagram),
    `上卦/下卦: ${hexagram.upper.name} / ${hexagram.lower.name}`,
    `動爻: ${hexagram.changingIndex}`,
    "",
    sections.join("\n\n"),
    "",
    disclaimerText,
  ].join("\n");
}

function getAboutSections() {
  const authorMarker = "\n\n作者";
  const authorIndex = labels.mainHelp.indexOf(authorMarker);
  if (authorIndex === -1) {
    return { intro: labels.mainHelp, author: "" };
  }
  return {
    intro: labels.mainHelp.slice(0, authorIndex),
    author: labels.mainHelp.slice(authorIndex + 2),
  };
}

function saveCurrentReading() {
  if (!state.currentHexagram) return;
  const record = {
    id: `${Date.now()}-${state.currentHexagram.storeSequence}-${state.currentHexagram.changingIndex}`,
    savedAt: new Date().toISOString(),
    storeSequence: state.currentHexagram.storeSequence,
    changingIndex: state.currentHexagram.changingIndex,
    title: getReadingTitle(),
  };
  state.savedReadings = [record, ...state.savedReadings].slice(0, maxSavedReadings);
  state.notice = "已保存卦例。";
  persistSavedReadings();
  render();
}

function loadSavedReading(record) {
  state.currentHexagram = createHexagram(record.storeSequence, record.changingIndex);
  state.activeTab = "main";
  state.browseOpen = false;
  state.error = "";
  state.notice = "已載入保存卦例。";
  render();
}

function deleteSavedReading(id) {
  state.savedReadings = state.savedReadings.filter((record) => record.id !== id);
  state.notice = "已刪除保存卦例。";
  persistSavedReadings();
  render();
}

async function shareCurrentReading() {
  if (!state.currentHexagram) return;
  const title = getReadingTitle();
  const text = getReadingText();
  try {
    if (navigator.share) {
      await navigator.share({ title, text });
      state.notice = "已打開分享面板。";
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      state.notice = "此瀏覽器不支援原生分享，已複製到剪貼簿。";
    } else {
      state.notice = "此瀏覽器不支援分享或剪貼簿。可使用匯出文字保存結果。";
    }
  } catch {
    state.notice = "分享已取消或未完成。";
  }
  render();
}

function exportCurrentReading() {
  if (!state.currentHexagram) return;
  const filename = `iching-${state.currentHexagram.storeSequence}-${state.currentHexagram.changingIndex}.txt`;
  const blob = new Blob([getReadingText()], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
  state.notice = "已匯出文字檔。";
  render();
}

function button(label, className = "") {
  const el = document.createElement("button");
  el.type = "button";
  el.className = className;
  el.textContent = label;
  return el;
}

function renderHeader() {
  const header = document.createElement("header");
  header.className = "app-header";

  const titleBlock = document.createElement("div");
  const title = document.createElement("h1");
  title.textContent = labels.title;
  const date = document.createElement("p");
  date.className = "date-line";
  date.textContent = state.currentDate.toString();
  titleBlock.append(title, date);

  const actions = document.createElement("div");
  actions.className = "actions";

  const now = button(labels.divineNow, "primary");
  now.addEventListener("click", () => {
    cast(() => divineNow());
  });

  const random = button(labels.divineRandom);
  random.addEventListener("click", () => {
    cast(() => divine());
  });

  const about = button(labels.about);
  about.addEventListener("click", () => {
    state.currentHexagram = null;
    state.error = "";
    state.notice = "";
    state.browseOpen = false;
    render();
  });

  const browse = button("瀏覽六十四卦");
  browse.className = state.browseOpen ? "active-action" : "";
  browse.setAttribute("aria-expanded", String(state.browseOpen));
  browse.addEventListener("click", () => {
    state.browseOpen = true;
    if (!state.currentHexagram) {
      selectBrowseHexagram(1, 1);
      return;
    }
    state.error = "";
    state.notice = "";
    render();
  });

  actions.append(now, random, browse, about);
  header.append(titleBlock, actions);
  return header;
}

function renderTabs() {
  const tabList = document.createElement("div");
  tabList.className = "tabs";

  for (const [id, label] of tabs) {
    const tab = button(label);
    tab.className = id === state.activeTab ? "tab active" : "tab";
    tab.disabled = !state.currentHexagram;
    tab.addEventListener("click", () => {
      state.activeTab = id;
      render();
    });
    tabList.append(tab);
  }

  return tabList;
}

function renderHelp() {
  const section = document.createElement("section");
  section.className = "content-panel help-panel";

  const media = document.createElement("div");
  media.className = "hexagram-media";
  const icon = document.createElement("img");
  icon.src = "/ApplicationIcon.png";
  icon.alt = labels.title;
  media.append(icon);

  const content = document.createElement("article");
  const aboutSections = getAboutSections();
  const title = document.createElement("h2");
  title.textContent = `${labels.about}《${labels.title}》`;
  const body = document.createElement("p");
  body.className = "reading-text";
  body.textContent = aboutSections.intro;
  const methodTitle = document.createElement("h2");
  methodTitle.textContent = "About / Method";
  const method = document.createElement("p");
  method.className = "reading-text method-text";
  method.textContent = methodText;
  const disclaimer = document.createElement("p");
  disclaimer.className = "disclaimer";
  disclaimer.textContent = disclaimerText;
  content.append(title, body, methodTitle, method, disclaimer);
  if (aboutSections.author) {
    const author = document.createElement("p");
    author.className = "author-block";
    author.textContent = aboutSections.author;
    content.append(author);
  }

  section.append(media, content);
  return section;
}

function cast(getHexagram) {
  try {
    state.currentHexagram = getHexagram();
    state.activeTab = "main";
    state.error = "";
    state.notice = "";
    state.browseOpen = false;
  } catch (error) {
    state.currentHexagram = null;
    state.notice = "";
    state.error =
      error instanceof RangeError
        ? `目前農曆演算只支援西曆 ${supportedDateRangeText()}。`
        : "起卦時發生錯誤，請稍後再試。";
  }
  render();
}

function renderError() {
  if (!state.error) return null;
  const error = document.createElement("p");
  error.className = "error-message";
  error.textContent = state.error;
  return error;
}

function renderNotice() {
  if (!state.notice) return null;
  const notice = document.createElement("p");
  notice.className = "notice-message";
  notice.textContent = state.notice;
  return notice;
}

function renderHexagram() {
  const section = document.createElement("section");
  section.className = "content-panel";

  const media = document.createElement("div");
  media.className = "hexagram-media";
  const image = document.createElement("img");
  image.src = getImageUrl(state.currentHexagram);
  image.alt = state.currentHexagram.name;
  const meta = document.createElement("p");
  meta.textContent = `${state.currentHexagram.upper} / ${state.currentHexagram.lower}`;
  media.append(image, meta);

  const content = document.createElement("article");
  const title = document.createElement("h2");
  title.textContent = state.currentHexagram.toString();
  const lineControls = renderMovingLineControls();
  const readingActions = renderReadingActions();
  const body = document.createElement("p");
  body.className = "reading-text";
  body.textContent = getTabContent(state.currentHexagram, state.activeTab);
  const disclaimer = document.createElement("p");
  disclaimer.className = "disclaimer";
  disclaimer.textContent = disclaimerText;
  content.append(title, lineControls, readingActions, body, disclaimer);

  section.append(media, content);
  return section;
}

function renderReadingActions() {
  const actions = document.createElement("div");
  actions.className = "reading-actions";
  const save = button("保存");
  save.addEventListener("click", saveCurrentReading);
  const share = button("分享 / 複製");
  share.addEventListener("click", shareCurrentReading);
  const exportText = button("匯出文字");
  exportText.addEventListener("click", exportCurrentReading);
  actions.append(save, share, exportText);
  return actions;
}

function renderMovingLineControls() {
  const controls = document.createElement("div");
  controls.className = "line-controls";
  const label = document.createElement("span");
  label.textContent = "動爻";
  controls.append(label);

  for (let line = 1; line <= 6; line += 1) {
    const option = button(String(line));
    option.className =
      line === state.currentHexagram.changingIndex
        ? "line-control active"
        : "line-control";
    option.addEventListener("click", () => {
      state.currentHexagram = new Hexagram(
        state.currentHexagram.upper,
        state.currentHexagram.lower,
        line,
      );
      render();
    });
    controls.append(option);
  }

  return controls;
}

function selectBrowseHexagram(storeSequence, changingIndex = 1) {
  state.currentHexagram = createHexagram(storeSequence, changingIndex);
  state.browseOpen = true;
  state.activeTab = "main";
  state.error = "";
  state.notice = "";
  render();
}

function moveBrowseSelection(delta) {
  const currentSequence = state.currentHexagram?.storeSequence ?? 1;
  const nextSequence = ((currentSequence - 1 + delta + 64) % 64) + 1;
  selectBrowseHexagram(nextSequence, state.currentHexagram?.changingIndex ?? 1);
}

function renderHexagramBrowser() {
  const section = document.createElement("section");
  section.className = "browser-panel";

  const header = document.createElement("div");
  header.className = "browser-header";
  const title = document.createElement("h2");
  title.textContent = state.browseOpen ? "六十四卦瀏覽" : "六十四卦";
  const toggle = button(state.browseOpen ? "回到占卜" : "打開");
  toggle.addEventListener("click", () => {
    state.browseOpen = !state.browseOpen;
    if (state.browseOpen && !state.currentHexagram) {
      selectBrowseHexagram(1, 1);
      return;
    }
    render();
  });
  header.append(title, toggle);
  section.append(header);

  if (!state.browseOpen) {
    const prompt = document.createElement("p");
    prompt.className = "browser-legend";
    prompt.textContent = "逐卦查看卦辭、爻辭、卦象結構與梅花易術。";
    section.append(prompt);
    return section;
  }

  const nav = document.createElement("div");
  nav.className = "browser-nav";
  const previous = button("上一卦");
  previous.addEventListener("click", () => moveBrowseSelection(-1));

  const selectWrap = document.createElement("label");
  selectWrap.className = "hexagram-select";
  const selectLabel = document.createElement("span");
  selectLabel.textContent = "選擇卦";
  const select = document.createElement("select");
  select.value = String(state.currentHexagram.storeSequence);
  for (const hexagram of allHexagrams) {
    const option = document.createElement("option");
    option.value = String(hexagram.storeSequence);
    option.textContent = `${hexagram.storeSequence}. ${hexagram.name} (${hexagram.upper.name}上${hexagram.lower.name}下)`;
    select.append(option);
  }
  select.addEventListener("change", () => {
    selectBrowseHexagram(Number(select.value), state.currentHexagram.changingIndex);
  });
  selectWrap.append(selectLabel, select);

  const next = button("下一卦");
  next.addEventListener("click", () => moveBrowseSelection(1));
  nav.append(previous, selectWrap, next);

  const summary = document.createElement("div");
  summary.className = "browser-summary";
  const sequence = document.createElement("span");
  sequence.textContent = `第 ${state.currentHexagram.storeSequence} 卦`;
  const name = document.createElement("strong");
  name.textContent = state.currentHexagram.name;
  const meta = document.createElement("span");
  meta.textContent = `${state.currentHexagram.upper.name}上 ${state.currentHexagram.lower.name}下`;
  summary.append(sequence, name, meta);

  section.append(nav, summary);
  return section;
}

function renderHistory() {
  const section = document.createElement("section");
  section.className = "history-panel";
  const title = document.createElement("h2");
  title.textContent = "保存歷史";
  section.append(title);

  if (state.savedReadings.length === 0) {
    const empty = document.createElement("p");
    empty.className = "browser-legend";
    empty.textContent = "尚未保存卦例。起卦或瀏覽後可點選「保存」。";
    section.append(empty);
    return section;
  }

  const list = document.createElement("div");
  list.className = "history-list";
  for (const record of state.savedReadings) {
    const item = document.createElement("article");
    item.className = "history-item";

    const load = button(record.title, "history-load");
    load.addEventListener("click", () => loadSavedReading(record));
    const meta = document.createElement("span");
    meta.textContent = formatSavedAt(record.savedAt);
    const remove = button("刪除");
    remove.className = "danger";
    remove.addEventListener("click", () => deleteSavedReading(record.id));
    item.append(load, meta, remove);
    list.append(item);
  }

  section.append(list);
  return section;
}

function render() {
  app.replaceChildren();

  const shell = document.createElement("div");
  shell.className = "shell";
  shell.append(renderHeader(), renderTabs());
  const error = renderError();
  if (error) shell.append(error);
  const notice = renderNotice();
  if (notice) shell.append(notice);
  shell.append(renderHexagramBrowser());
  if (state.browseOpen && state.currentHexagram) {
    shell.append(renderHexagram());
  } else {
    shell.append(state.currentHexagram ? renderHexagram() : renderHelp());
  }
  shell.append(renderHistory());
  app.append(shell);
}

setInterval(() => {
  try {
    const nextDate = new ChineseCalendarDate(new Date());
    if (nextDate.chineseTwoHourPeriod !== state.currentDate.chineseTwoHourPeriod) {
      state.currentDate = nextDate;
      render();
    }
  } catch {
    state.error = `目前農曆演算只支援西曆 ${supportedDateRangeText()}。`;
    render();
  }
}, 10000);

render();
