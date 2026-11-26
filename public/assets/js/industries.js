/**
 * Industries page: renders the seven industry cards (a row of four, then a row of three) with one
 * expandable discipline panel open at a time. A second click on the open card closes its panel.
 */
import { industries } from "./industry-data.js";

const grid = document.querySelector("#industries");
const rows = [industries.slice(0, 4), industries.slice(4)];
let open = null;

function make(tag, className, value) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value) node.textContent = value;
  return node;
}

function setExpanded(item, expanded) {
  item.panel.hidden = !expanded;
  item.button.setAttribute("aria-expanded", String(expanded));
  const action = expanded ? "Hide disciplines" : "View disciplines";
  item.button.firstChild.textContent = action;
  item.button.lastChild.textContent = expanded ? " ↑" : " ↓";
  item.button.setAttribute("aria-label", action + " for " + item.title);
}

function makeIndustry(industry) {
  const { id, title, summary, groups } = industry;
  const card = make("article", "ssa-industry-card");
  const picture = make("img");
  picture.src = "assets/images/industries/" + id + ".jpg";
  picture.alt = "";
  picture.width = 900;
  picture.height = 600;
  picture.loading = "lazy";
  const copy = make("div", "ssa-industry-card-copy");
  copy.append(make("h2", "", title), make("p", "", summary));

  const button = make("button");
  button.type = "button";
  const arrow = make("span");
  arrow.setAttribute("aria-hidden", "true");
  button.append(document.createTextNode(""), arrow);
  card.append(picture, copy, button);

  const panel = make("section", "ssa-industry-panel");
  panel.id = id + "-disciplines";
  const heading = make("h2", "", title + " disciplines");
  heading.id = id + "-disciplines-title";
  panel.setAttribute("aria-labelledby", heading.id);
  button.setAttribute("aria-controls", panel.id);

  const list = make("dl");
  for (const [label, disciplines] of groups) {
    const group = make("div");
    group.append(make("dt", "", label), make("dd", "", disciplines));
    list.append(group);
  }
  panel.append(heading, list);

  const item = { panel, button, title };
  setExpanded(item, false);
  button.addEventListener("click", () => {
    const reopening = open !== item;
    if (open) setExpanded(open, false);
    open = reopening ? item : null;
    if (open) {
      setExpanded(open, true);
      // Keep keyboard focus on the toggle and bring the panel into view.
      panel.scrollIntoView({ block: "nearest" });
    }
  });
  return { card, panel };
}

for (const entries of rows) {
  const row = make("div", "ssa-industry-row");
  const items = entries.map(makeIndustry);
  row.append(...items.map((item) => item.card));
  row.append(...items.map((item) => item.panel));
  grid.append(row);
}
