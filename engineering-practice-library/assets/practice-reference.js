(() => {
  const filterPanel = document.querySelector(".filter-panel");
  const details = [...document.querySelectorAll("main > section > details")];
  const buttons = [...document.querySelectorAll(".filter-chip")];
  const search = document.querySelector("#guardrail-filter");
  const status = document.querySelector("#filter-status");
  const empty = document.querySelector("#filter-empty");

  const iconSets = {
    core: ["◎", "⌕", "↗", "✓", "↻", "⇢", "▦", "↯"],
    "anti-pattern": ["!", "⊘", "◌", "≈", "…", "∿", "∅"],
    strength: ["✦", "◇", "◈", "◆", "☑", "◉", "⌂", "↗", "⚖", "∞"],
    rule: ["§", "⌕", "⊙", "≡", "✓", "↻", "⌘", "✎", "⌁", "⚑"],
  };

  const sectionGroup = (section) => {
    const heading = section?.querySelector("h2")?.textContent.toLowerCase() || "";
    return heading.includes("core gates") ? "core"
      : heading.includes("anti-pattern") ? "anti-pattern"
        : heading.includes("strengths") ? "strength"
          : heading.includes("rules") ? "rule" : "all";
  };

  const addLabel = (target, text, className) => {
    const label = document.createElement("span");
    label.className = `example-label ${className}`;
    label.textContent = text;
    target.parentNode.insertBefore(label, target);
  };

  details.forEach((item) => {
    const summary = item.querySelector(":scope > summary");
    if (!summary || summary.dataset.decorated) return;
    summary.dataset.decorated = "true";

    const group = sectionGroup(item.closest("section"));
    const siblings = details.filter((candidate) => sectionGroup(candidate.closest("section")) === group);
    const icon = (iconSets[group] || ["•"])[siblings.indexOf(item) % (iconSets[group]?.length || 1)];
    const title = summary.querySelector(":scope > span");
    if (title) {
      title.classList.add("summary-title");
      const iconElement = document.createElement("span");
      iconElement.className = "topic-icon";
      iconElement.setAttribute("aria-hidden", "true");
      iconElement.textContent = icon;
      title.prepend(iconElement);
    }

    item.querySelectorAll(":scope > .accordion-body p, :scope > .rule-body p").forEach((paragraph) => {
      const strong = paragraph.querySelector("strong");
      const label = strong?.textContent.trim().replace(/:$/, "");
      const code = paragraph.querySelector("code");

      if (["Bad", "Weak move"].includes(label)) {
        const block = document.createElement("div");
        block.className = "example-block bad-example";
        const blockLabel = document.createElement("span");
        blockLabel.className = "example-label bad-example-label";
        blockLabel.textContent = "BAD EXAMPLE";
        const pre = document.createElement("pre");
        const codeBlock = document.createElement("code");
        codeBlock.textContent = code?.textContent || paragraph.textContent.replace(strong.textContent, "").trim();
        pre.append(codeBlock);
        block.append(blockLabel, pre);
        paragraph.replaceWith(block);
        return;
      }

      if (["Good", "Practical prompt", "Practical correction"].includes(label)) {
        const next = paragraph.nextElementSibling;
        paragraph.remove();
        if (next?.tagName === "PRE") {
          next.classList.add("good-prompt");
          addLabel(next, "GOOD PROMPT", "good-prompt-label");
        }
      }
    });
  });

  if (filterPanel && details.length && buttons.length && search && status && empty) {
    const groups = new Map();
    [...document.querySelectorAll("main > section")].forEach((section) => {
      const group = sectionGroup(section);
      section.querySelectorAll("details").forEach((item) => groups.set(item, group));
    });

    const render = () => {
      const selected = buttons.find((button) => button.getAttribute("aria-pressed") === "true")?.dataset.filter || "all";
      const term = search.value.trim().toLowerCase();
      let visible = 0;
      details.forEach((item) => {
        const matchesGroup = selected === "all" || groups.get(item) === selected;
        const matchesSearch = !term || item.textContent.toLowerCase().includes(term);
        const show = matchesGroup && matchesSearch;
        item.hidden = !show;
        if (show) visible += 1;
      });
      status.textContent = `Showing ${visible} of ${details.length} topics.`;
      empty.hidden = visible !== 0;
    };

    buttons.forEach((button) => button.addEventListener("click", () => {
      buttons.forEach((candidate) => candidate.setAttribute("aria-pressed", String(candidate === button)));
      render();
    }));
    search.addEventListener("input", render);
    render();
  }

  document.querySelectorAll("pre").forEach((pre) => {
    if (pre.querySelector(".copy-example")) return;
    const button = document.createElement("button");
    button.className = "copy-example";
    button.type = "button";
    button.textContent = "Copy";
    button.addEventListener("click", async () => {
      const text = pre.querySelector("code")?.textContent || pre.textContent;
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = "Copied";
        window.setTimeout(() => { button.textContent = "Copy"; }, 1400);
      } catch {
        button.textContent = "Select text";
      }
    });
    pre.prepend(button);
  });

  document.querySelectorAll("[data-answer]").forEach((button) => {
    button.addEventListener("click", () => {
      const feedback = button.closest(".quiz")?.querySelector(".feedback");
      if (!feedback) return;
      const correct = button.dataset.answer === "correct";
      feedback.textContent = correct ? "Correct. Rewrite the contract after two misses." : "Not yet. Choose the smallest falsifiable repair.";
      feedback.className = `feedback ${correct ? "correct" : "incorrect"}`;
    });
  });
})();
