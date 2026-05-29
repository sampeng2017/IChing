import { ChineseCalendarDate, supportedDateRangeText } from "./core/chinese-calendar.js";
import { getAllHexagrams, Hexagram } from "./core/bagua.js";
import { divine, divineNow } from "./core/divination.js";
import { getImageUrl, getTabContent } from "./core/descriptions.js";
import { labels } from "./core/labels.js";
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

const state = {
  currentDate: new ChineseCalendarDate(new Date()),
  currentHexagram: null,
  activeTab: "main",
  error: "",
  browseOpen: false,
};

const app = document.querySelector("#app");

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
  const title = document.createElement("h2");
  title.textContent = `${labels.about}《${labels.title}》`;
  const body = document.createElement("p");
  body.className = "reading-text";
  body.textContent = labels.mainHelp;
  content.append(title, body);

  section.append(media, content);
  return section;
}

function cast(getHexagram) {
  try {
    state.currentHexagram = getHexagram();
    state.activeTab = "main";
    state.error = "";
  } catch (error) {
    state.currentHexagram = null;
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
  const body = document.createElement("p");
  body.className = "reading-text";
  body.textContent = getTabContent(state.currentHexagram, state.activeTab);
  content.append(title, lineControls, body);

  section.append(media, content);
  return section;
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
  const selected = allHexagrams[storeSequence - 1];
  state.currentHexagram = new Hexagram(selected.upper, selected.lower, changingIndex);
  state.browseOpen = true;
  state.activeTab = "main";
  state.error = "";
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

function render() {
  app.replaceChildren();

  const shell = document.createElement("div");
  shell.className = "shell";
  shell.append(renderHeader(), renderTabs());
  const error = renderError();
  if (error) shell.append(error);
  shell.append(renderHexagramBrowser());
  if (state.browseOpen && state.currentHexagram) {
    shell.append(renderHexagram());
  } else {
    shell.append(state.currentHexagram ? renderHexagram() : renderHelp());
  }
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
