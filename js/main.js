(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  initHeader();
  renderServices();
  renderStack();
  renderProjects();
  initFilters();
  initHeroCode();
  initTerminal();
  initReveal();
  initCursor();
  initMagnetic();
  initParticles();
  initForm();
  initSmoothNav();

  function initHeader() {
    const toggle = $(".nav-toggle");
    const menu = $("#mobile-nav");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      menu.hidden = open;
    });
    $$("#mobile-nav a").forEach((a) => {
      a.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        menu.hidden = true;
      });
    });
  }

  function icons() {
    return {
      web: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 8h18M8 18v2m8-2v2"/></svg>',
      system: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 17.5h7M17.5 14v7"/></svg>',
      app: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M8 13h5"/></svg>',
      mobile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>',
      ux: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 19V5h10l6 6v8H4z"/><path d="M14 5v6h6"/></svg>',
      care: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.6-7 10-7 10z"/></svg>'
    };
  }

  function renderServices() {
    const root = $("#services-grid");
    if (!root) return;
    const ic = icons();
    root.innerHTML = SCT.services.map((s) => `
      <article class="service reveal">
        ${ic[s.icon] || ic.web}
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
        <span class="tech-label">${s.label}</span>
      </article>
    `).join("");
  }

  function projectArt(id) {
    const palettes = {
      auracodex: ["#0d1a18", "#7ee0c8", "#c9b27c"],
      "grow-games": ["#10141c", "#9bb7ff", "#7ee0c8"],
      "saude-nampula": ["#101816", "#6fba9a", "#e8ecf5"],
      pescalink: ["#0e141c", "#7ea8c9", "#c9b27c"],
      restaurant: ["#16120e", "#c9b27c", "#7ee0c8"],
      "aura-imovision": ["#10141a", "#8b93a7", "#7ee0c8"]
    };
    const [bg, a, b] = palettes[id] || palettes.auracodex;
    return `<svg viewBox="0 0 640 280" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${id} visual">
      <rect width="640" height="280" fill="${bg}"/>
      <circle cx="520" cy="60" r="90" fill="${a}" opacity=".12"/>
      <circle cx="80" cy="220" r="70" fill="${b}" opacity=".14"/>
      <rect x="48" y="48" width="220" height="12" rx="6" fill="${a}" opacity=".55"/>
      <rect x="48" y="76" width="160" height="8" rx="4" fill="#fff" opacity=".18"/>
      <rect x="48" y="120" width="280" height="96" rx="10" fill="#fff" opacity=".05" stroke="${a}" stroke-opacity=".35"/>
      <rect x="360" y="88" width="220" height="140" rx="12" fill="#fff" opacity=".04" stroke="${b}" stroke-opacity=".3"/>
      <path d="M80 168h200M80 188h140" stroke="${a}" stroke-width="2" opacity=".5"/>
    </svg>`;
  }

  function renderProjects() {
    const root = $("#projects");
    if (!root) return;
    root.innerHTML = SCT.projects.map((p) => `
      <article class="project reveal" data-category="${p.category}">
        <div class="project-visual">${projectArt(p.id)}</div>
        <div class="project-body">
          <p class="project-cat">${p.categoryLabel}</p>
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <div class="tags">${p.tech.map((t) => `<span>${t}</span>`).join("")}</div>
          <div class="project-actions">
            <a href="${p.url}">View Project</a>
            ${p.github ? `<a href="${p.github}" target="_blank" rel="noopener noreferrer">GitHub</a>` : ""}
          </div>
        </div>
      </article>
    `).join("");
  }

  function initFilters() {
    const buttons = $$(".filter-btn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => {
          b.classList.toggle("is-active", b === btn);
          b.setAttribute("aria-selected", String(b === btn));
        });
        const f = btn.dataset.filter;
        $$(".project").forEach((card) => {
          const show = f === "all" || card.dataset.category === f;
          card.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  function renderStack() {
    const stage = $("#stack-stage");
    const nodesRoot = $("#stack-nodes");
    const svg = $("#stack-lines");
    const detail = $("#stack-detail");
    if (!stage || !nodesRoot || !svg) return;

    nodesRoot.innerHTML = SCT.stack.map((n, i) =>
      `<button type="button" class="stack-node" data-i="${i}" data-group="${n.group}" style="left:${n.x}%;top:${n.y}%">${n.name}</button>`
    ).join("");

    function draw() {
      const w = stage.clientWidth;
      const h = Math.max(stage.clientHeight, 460);
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      svg.innerHTML = SCT.links.map(([a, b]) => {
        const na = SCT.stack[a];
        const nb = SCT.stack[b];
        return `<line x1="${na.x / 100 * w}" y1="${na.y / 100 * h}" x2="${nb.x / 100 * w}" y2="${nb.y / 100 * h}"/>`;
      }).join("");
    }
    draw();
    window.addEventListener("resize", draw);

    nodesRoot.addEventListener("mouseover", onNode);
    nodesRoot.addEventListener("focusin", onNode);
    nodesRoot.addEventListener("click", onNode);

    function onNode(e) {
      const btn = e.target.closest(".stack-node");
      if (!btn) return;
      $$(".stack-node").forEach((n) => n.classList.toggle("is-active", n === btn));
      const n = SCT.stack[Number(btn.dataset.i)];
      if (!detail || !n) return;
      detail.innerHTML = `<p class="stack-detail-kicker">${n.group}</p><h3>${n.name}</h3><p>${n.about}</p>`;
    }
  }

  function initHeroCode() {
    const el = $("#hero-code code");
    if (!el) return;
    const html = [
      '<span class="cm">// problem → system</span>',
      '<span class="kw">const</span> brief = {',
      '  origin: <span class="str">"Mozambique"</span>,',
      '  intent: <span class="str">"digital solutions"</span>',
      "};",
      "",
      '<span class="kw">async function</span> <span class="fn">build</span>(idea) {',
      '  <span class="kw">const</span> problem = <span class="kw">await</span> discover(idea);',
      '  <span class="kw">const</span> product = design(problem);',
      '  <span class="kw">return</span> ship(product);',
      "}"
    ].join("\n");
    if (reduce) {
      el.innerHTML = html;
      return;
    }
    const plain = [
      "// problem → system",
      "const brief = {",
      '  origin: "Mozambique",',
      '  intent: "digital solutions"',
      "};",
      "",
      "async function build(idea) {",
      "  const problem = await discover(idea);",
      "  const product = design(problem);",
      "  return ship(product);",
      "}"
    ].join("\n");
    let i = 0;
    const tick = () => {
      i += 1;
      el.textContent = plain.slice(0, i);
      if (i < plain.length) setTimeout(tick, 16);
      else el.innerHTML = html;
    };
    tick();
  }

  function initTerminal() {
    const root = $("#terminal");
    if (!root) return;
    const script = [
      { type: "cmd", text: "whoami" },
      { type: "out", text: "silviocustodiotech" },
      { type: "cmd", text: "location" },
      { type: "out", text: "Mozambique" },
      { type: "cmd", text: "focus" },
      { type: "out", text: "digital solutions" },
      { type: "cmd", text: "status" },
      { type: "out", text: "building..." }
    ];

    if (reduce) {
      root.innerHTML = script.map((s) =>
        s.type === "cmd"
          ? `<div><span class="prompt">$</span> <span class="cmd">${s.text}</span></div>`
          : `<div class="out">${s.text}</div>`
      ).join("") + '<div><span class="prompt">$</span> <span class="caret"></span></div>';
      return;
    }

    let step = 0;
    function next() {
      if (step >= script.length) {
        const line = document.createElement("div");
        line.innerHTML = '<span class="prompt">$</span> <span class="caret"></span>';
        root.appendChild(line);
        return;
      }
      const item = script[step];
      if (item.type === "cmd") {
        const line = document.createElement("div");
        line.innerHTML = '<span class="prompt">$</span> <span class="cmd"></span>';
        root.appendChild(line);
        typeInto($(".cmd", line), item.text, () => {
          step += 1;
          setTimeout(next, 180);
        });
      } else {
        const line = document.createElement("div");
        line.className = "out";
        line.textContent = item.text;
        root.appendChild(line);
        step += 1;
        setTimeout(next, 220);
      }
    }

    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        io.disconnect();
        next();
      }
    }, { threshold: 0.4 });
    io.observe(root);
  }

  function typeInto(el, text, done) {
    let i = 0;
    const run = () => {
      i += 1;
      el.textContent = text.slice(0, i);
      if (i < text.length) setTimeout(run, 38);
      else done();
    };
    run();
  }

  function initReveal() {
    const nodes = $$(".reveal");
    if (reduce) {
      nodes.forEach((n) => n.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    nodes.forEach((n) => io.observe(n));
  }

  function initCursor() {
    const c = $(".cursor");
    const d = $(".cursor-dot");
    if (!c || !d || window.matchMedia("(pointer: coarse)").matches) return;
    let x = 0, y = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", (e) => {
      x = e.clientX; y = e.clientY;
      d.style.left = x + "px";
      d.style.top = y + "px";
    });
    const loop = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      c.style.left = cx + "px";
      c.style.top = cy + "px";
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    document.addEventListener("mouseover", (e) => {
      const t = e.target.closest("a, button, input, textarea, select");
      c.classList.toggle("is-hover", Boolean(t));
    });
  }

  function initMagnetic() {
    if (reduce || window.matchMedia("(pointer: coarse)").matches) return;
    $$("[data-magnetic]").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${dx * 0.18}px, ${dy * 0.22}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  function initParticles() {
    const root = $("#particles");
    if (!root || reduce) return;
    for (let i = 0; i < 18; i++) {
      const p = document.createElement("span");
      p.className = "particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.top = Math.random() * 100 + "%";
      p.style.animationDelay = Math.random() * 8 + "s";
      p.style.animationDuration = 6 + Math.random() * 6 + "s";
      root.appendChild(p);
    }
  }

  function initForm() {
    const form = $("#contact-form");
    const status = $("#form-status");
    if (!form) return;

    const rules = {
      name: (v) => v.trim().length >= 2 || "Please enter your name.",
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email.",
      type: (v) => v.length > 0 || "Select a project type.",
      message: (v) => v.trim().length >= 12 || "Tell me a bit more about the project."
    };

    function setError(name, msg) {
      const field = form.querySelector(`[name="${name}"]`);
      const wrap = field && field.closest(".field");
      const err = form.querySelector(`[data-error-for="${name}"]`);
      if (!wrap || !err) return;
      wrap.classList.toggle("is-invalid", Boolean(msg));
      err.hidden = !msg;
      err.textContent = msg || "";
    }

    form.addEventListener("input", (e) => {
      const name = e.target.name;
      if (rules[name]) {
        const res = rules[name](e.target.value);
        setError(name, res === true ? "" : res);
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      Object.keys(rules).forEach((name) => {
        const field = form.elements[name];
        const res = rules[name](field.value);
        if (res !== true) {
          setError(name, res);
          ok = false;
        } else setError(name, "");
      });
      status.hidden = false;
      if (!ok) {
        status.className = "form-status is-err";
        status.textContent = "Please fix the highlighted fields.";
        return;
      }
      status.className = "form-status is-ok";
      status.textContent = "Message ready. Opening your email client…";
      const data = new FormData(form);
      const body = [
        `Name: ${data.get("name")}`,
        `Email: ${data.get("email")}`,
        `Company: ${data.get("company") || "—"}`,
        `Type: ${data.get("type")}`,
        `Budget: ${data.get("budget") || "—"}`,
        "",
        data.get("message")
      ].join("\n");
      const href = `mailto:silviocustodiotech@gmail.com?subject=${encodeURIComponent("Project inquiry from " + data.get("name"))}&body=${encodeURIComponent(body)}`;
      window.location.href = href;
      form.reset();
    });
  }

  function initSmoothNav() {
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      });
    });
  }
})();
