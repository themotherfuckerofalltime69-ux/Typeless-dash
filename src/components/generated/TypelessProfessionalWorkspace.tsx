import "./TypelessProfessionalWorkspace.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Activity, ArrowDownToLine, ArrowLeft, ArrowRight, AudioLines, Bell, Box, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, CircleHelp, Command, Cpu, Download, Eye, FileCode2, FileImage, FileText, FolderOpen, Gauge, GitBranch, Grid2X2, ImagePlus, Layers3, Maximize2, Menu, Mic, MoreHorizontal, PanelLeftClose, PanelLeftOpen, Plus, Rotate3D, Search, Settings2, ShieldCheck, Sparkles, Terminal, Upload, WandSparkles, X, Zap } from "lucide-react";
type Section = "Prompt Studio" | "Component Blocks" | "Image / CAD" | "/Skilled Generator" | "Settings";
const nav: {
  name: Section;
  icon: React.ElementType;
  hint: string;
}[] = [{
  name: "Prompt Studio",
  icon: Command,
  hint: "Compose & refine"
}, {
  name: "Component Blocks",
  icon: Grid2X2,
  hint: "Reusable building blocks"
}, {
  name: "Image / CAD",
  icon: Box,
  hint: "Inspect reference assets"
}, {
  name: "/Skilled Generator",
  icon: WandSparkles,
  hint: "Build a capability"
}, {
  name: "Settings",
  icon: Settings2,
  hint: "Workspace preferences"
}];
const initialPrompt = "Design a modular, high-performance product enclosure with optimized topology, clearly separated components, precise mechanical interfaces, and a manufacturable engineering-polymer structure.";
const samples = ["Responsive dashboard UI", "Modular enclosure CAD", "Design system tokens", "Procedural 3D scene"];
const slug = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "untitled-module";
export const TypelessProfessionalWorkspace = () => {
  const [section, setSection] = useState<Section>("Prompt Studio");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [prompt, setPrompt] = useState(initialPrompt);
  const [completion, setCompletion] = useState(true);
  const [reference, setReference] = useState<File | null>(null);
  const [referenceUrl, setReferenceUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [history, setHistory] = useState<{
    prompt: string;
    time: string;
  }[]>([]);
  const [query, setQuery] = useState("");
  const [cadMode, setCadMode] = useState("ROT");
  const [wireframe, setWireframe] = useState(false);
  const [rotating, setRotating] = useState(true);
  const [step, setStep] = useState(1);
  const [target, setTarget] = useState("/skills");
  const [moduleName, setModuleName] = useState("spatial-mesh-optimizer");
  const [directive, setDirective] = useState("Generate a reusable capability with validated inputs, deterministic fallbacks, useful telemetry, and clear documentation.");
  const [tuning, setTuning] = useState("Creative exploratory");
  const [deployed, setDeployed] = useState(false);
  const [alias, setAlias] = useState("OPERATOR-01");
  const [glow, setGlow] = useState(true);
  const [telemetry, setTelemetry] = useState(true);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  useEffect(() => {
    try {
      const x = localStorage.getItem("typeless-settings");
      if (x) {
        const v = JSON.parse(x);
        setAlias(v.alias || "OPERATOR-01");
        setGlow(v.glow ?? true);
        setTelemetry(v.telemetry ?? true);
        setCompletion(v.completion ?? true);
      }
    } catch {}
  }, []);
  useEffect(() => {
    if (reference) {
      const u = URL.createObjectURL(reference);
      setReferenceUrl(u);
      return () => URL.revokeObjectURL(u);
    } else setReferenceUrl("");
  }, [reference]);
  useEffect(() => {
    if (notice) {
      const t = window.setTimeout(() => setNotice(""), 3200);
      return () => clearTimeout(t);
    }
  }, [notice]);
  const filteredHistory = useMemo(() => history.filter(h => h.prompt.toLowerCase().includes(query.toLowerCase())), [history, query]);
  const switchSection = (s: Section) => {
    setSection(s);
    setMobileMenu(false);
    setNotice("");
  };
  const enhancePrompt = () => {
    const additions = ["Goal:", "Constraints:", "Deliverables:", "Validation:"];
    if (prompt.includes("Constraints:")) {
      setNotice("Prompt already has a structured brief.");
      return;
    }
    setPrompt(prompt.trim() + "\n\nGoal: Deliver a production-ready result.\n" + additions.slice(1).map((x, i) => x + " " + ["Preserve the original concept; prioritize responsive behavior, accessibility, and clear component boundaries.", "Provide editable source, explicit assumptions, and sensible error states.", "Verify interactions at mobile, tablet, and desktop widths; never claim a remote action succeeded without a connected service."][i]).join("\n"));
    setNotice("Prompt expanded into a structured production brief.");
  };
  const executePrompt = () => {
    if (!prompt.trim()) {
      setNotice("Add a prompt before running.");
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      setHistory(h => [{
        prompt: prompt.trim(),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      }, ...h].slice(0, 12));
      setBusy(false);
      setNotice("Prompt saved to local run history. Connect a generation backend to execute AI jobs.");
    }, 450);
  };
  const chooseImage = (f?: File) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setNotice("Choose an image file such as PNG, JPG, or WEBP.");
      return;
    }
    setReference(f);
    setNotice("Reference image attached.");
  };
  const startVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setNotice("Voice input is not available in this browser. You can type your prompt instead.");
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onresult = (e: any) => {
      setPrompt(p => (p ? p + " " : "") + e.results[0][0].transcript);
      setNotice("Voice input added.");
    };
    rec.onerror = () => setNotice("Voice input ended. Check microphone permission and try again.");
    rec.start();
    setNotice("Listening… speak your prompt.");
  };
  const download = (name: string, content: string, type = "text/plain") => {
    const b = new Blob([content], {
      type
    });
    const u = URL.createObjectURL(b);
    const a = document.createElement("a");
    a.href = u;
    a.download = name;
    a.click();
    URL.revokeObjectURL(u);
  };
  const saveSettings = () => {
    localStorage.setItem("typeless-settings", JSON.stringify({
      alias,
      glow,
      telemetry,
      completion
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
    setNotice("Preferences saved on this device.");
  };
  const generatePayload = () => ({
    schemaVersion: "1.0.0",
    kind: target === "/brand" ? "design-system" : "capability-skill",
    name: slug(moduleName),
    endpoint: target,
    tuning,
    directive: directive.trim(),
    generatedAt: new Date().toISOString(),
    status: "draft",
    notes: ["Generated locally from the entered brief.", "Connect a backend to validate, publish, or deploy this payload."]
  });
  const goStep = (n: number) => {
    if (n === 2 && !moduleName.trim()) {
      setNotice("Enter a module name first.");
      return;
    }
    if (n === 3 && !directive.trim()) {
      setNotice("Add generation instructions first.");
      return;
    }
    setStep(n);
    setDeployed(false);
  };
  const sectionSub = nav.find(n => n.name === section)?.hint || "Workspace";
  const IconButton = ({
    label,
    children,
    onClick,
    active = false
  }: {
    label: string;
    children: React.ReactNode;
    onClick: () => void;
    active?: boolean;
  }) => <button type="button" aria-label={label} title={label} onClick={onClick} className={"icon-button " + (active ? "is-active" : "")}>{children}</button>;
  return <div className={"app-shell " + (glow ? "glow-on" : "")}>
    <aside className={"sidebar " + (sidebarOpen ? "" : "sidebar-collapsed") + (mobileMenu ? " mobile-open" : "")}>
      <div className="brand-row"><div className="brand-mark"><AudioLines size={21} /></div>{sidebarOpen && <div className="brand-word">TYPELESS<span>STUDIO / 01</span></div>}<button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">{sidebarOpen ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}</button></div>
      <div className="workspace-switch"><div className="workspace-avatar">T</div>{sidebarOpen && <div className="workspace-meta"><b>Personal workspace</b><span>Local environment</span></div>}{sidebarOpen && <ChevronDown size={15} className="muted-icon" />}</div>
      <div className="nav-label">{sidebarOpen ? "WORKSPACE" : "NAV"}</div>
      <nav className="primary-nav" aria-label="Main navigation">{nav.map(({
          name,
          icon: Icon,
          hint
        }) => <button key={name} onClick={() => switchSection(name)} className={"nav-item " + (section === name ? "selected" : "")} title={!sidebarOpen ? name : undefined}><Icon size={18} />{sidebarOpen && <><span>{name}</span>{name === "/Skilled Generator" && <span className="nav-badge">NEW</span>}</>}</button>)}</nav>
      {sidebarOpen && <><div className="nav-label recent-label">RECENT RUNS <button onClick={() => setHistory([])} aria-label="Clear recent runs"><MoreHorizontal size={16} /></button></div><div className="recent-list">{history.slice(0, 4).map((h, i) => <button key={i} className="recent-item" onClick={() => {
            setPrompt(h.prompt);
            switchSection("Prompt Studio");
          }}><span className="recent-dot" /><span>{h.prompt.slice(0, 28)}{h.prompt.length > 28 ? "…" : ""}</span></button>)}{history.length === 0 && <p className="empty-mini">Your recent prompt runs will appear here.</p>}</div></>}
      <div className="sidebar-bottom"><div className="connection-card"><span className="status-led" />{sidebarOpen && <span>LOCAL MODE <small>Backend not connected</small></span>}</div><button className="profile-row" onClick={() => switchSection("Settings")}><div className="profile-avatar">{(alias.trim()[0] || "O").toUpperCase()}</div>{sidebarOpen && <div className="profile-meta"><b>{alias || "Operator"}</b><span>Workspace owner</span></div>}{sidebarOpen && <MoreHorizontal size={17} />}</button></div>
    </aside>
    {mobileMenu && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileMenu(false)} />}
    <main className="main-shell">
      <header className="topbar"><div className="topbar-left"><button className="mobile-menu-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Open navigation"><Menu size={20} /></button><div className="breadcrumbs"><span>Typeless</span><ChevronRight size={14} /><b>{section}</b></div><span className="env-chip"><span className="status-led" /> LOCAL</span></div><div className="topbar-actions"><div className="system-status"><span className="status-led" /><span>All systems nominal</span></div><IconButton label="Help" onClick={() => setShowHelp(!showHelp)}><CircleHelp size={18} /></IconButton><IconButton label="Notifications" onClick={() => setNotice("No new notifications.")}><Bell size={18} /></IconButton><div className="top-avatar">{(alias.trim()[0] || "O").toUpperCase()}</div></div></header>
      <div className="page-scroll"><div className="page-content">
        <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" />{sectionSub.toUpperCase()}</div><h1>{section === "Prompt Studio" ? "Prompt Studio" : section === "Component Blocks" ? "Component Blocks" : section === "Image / CAD" ? "Image & CAD" : section === "/Skilled Generator" ? "Skilled Generator" : "Workspace settings"}</h1><p>{section === "Prompt Studio" ? "Turn clear intent into structured, production-ready instructions." : section === "Component Blocks" ? "Organize reusable assets and keep your project inputs close at hand." : section === "Image / CAD" ? "Inspect references and interact with a lightweight viewport preview." : section === "/Skilled Generator" ? "Configure a reusable capability and export a reviewable payload." : "Tune your workspace behavior and local preferences."}</p></div><div className="heading-actions"><span className="version-chip"><GitBranch size={14} /> v1.0.0</span><button className="button button-secondary" onClick={() => setShowHelp(!showHelp)}><CircleHelp size={16} /> Guide</button></div></div>
        {showHelp && <div className="help-banner"><div className="help-icon"><CircleHelp size={18} /></div><div><b>Workspace guide</b><p>Use Prompt Studio to refine and save briefs, Image / CAD to attach references, and Skilled Generator to export a draft JSON payload. This front end stores preferences locally; AI execution, cloud storage, repository sync, and deployment require a connected backend.</p></div><button onClick={() => setShowHelp(false)} aria-label="Dismiss guide"><X size={17} /></button></div>}

        {section === "Prompt Studio" && <div className="studio-layout">
          <section className="editor-column">
            <div className="panel prompt-panel"><div className="panel-top"><div className="panel-title"><div className="title-icon"><Terminal size={17} /></div><div><h2>Instruction editor</h2><span>Natural language → structured intent</span></div></div><span className="draft-status"><span className="status-led" />{busy ? "PROCESSING" : "DRAFT"}</span></div>
              <div className="editor-meta"><span><span className="tiny-led" /> PROMPT.md</span><span>{prompt.length.toLocaleString()} characters</span></div>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="prompt-editor" spellCheck placeholder="Describe what you want to build, how it should behave, and what a successful result looks like…" aria-label="Prompt instructions" />
              {completion && <div className="completion-hint"><Sparkles size={14} /><span>Tip: specify purpose, constraints, deliverables, and how the result should be validated.</span></div>}
              <div className="editor-toolbar"><div className="toolbar-group"><button className={"tool-button " + (completion ? "tool-active" : "")} onClick={() => setCompletion(!completion)}><Sparkles size={15} /> Smart hints</button><button className="tool-button" onClick={enhancePrompt}><WandSparkles size={15} /> Enhance brief</button><button className={"tool-button " + (reference ? "tool-active" : "")} onClick={() => imageRef.current?.click()}><ImagePlus size={15} /> Reference</button><input ref={imageRef} type="file" accept="image/*" hidden onChange={e => chooseImage(e.target.files?.[0])} /></div><div className="toolbar-group"><button className="tool-button icon-tool" onClick={startVoice} aria-label="Voice input" title="Voice input"><Mic size={16} /></button><button className="tool-button icon-tool" onClick={() => download("typeless-prompt.txt", prompt)} aria-label="Export prompt" title="Export prompt"><Download size={16} /></button></div></div>
              {reference && <div className="reference-attachment"><img src={referenceUrl} alt="Attached reference" /><div><b>{reference.name}</b><span>{(reference.size / 1024).toFixed(0)} KB · Image reference</span></div><button onClick={() => setReference(null)} aria-label="Remove reference"><X size={16} /></button></div>}
              <div className="prompt-footer"><span><ShieldCheck size={15} /> Saved locally in this session</span><button className="button button-primary" onClick={executePrompt} disabled={busy}>{busy ? <><span className="spinner" /> Saving…</> : <>Run prompt <ArrowRight size={16} /></>}</button></div>
            </div>
            <div className="section-inline-heading"><div><h2>Start with a template</h2><p>Choose a direction, then make it your own.</p></div><button className="text-button" onClick={() => setPrompt("")}>Clear editor <X size={14} /></button></div>
            <div className="template-grid">{samples.map((s, i) => {
                  const icons = [Grid2X2, Box, Layers3, Rotate3D];
                  const I = icons[i];
                  return <button key={s} className="template-card" onClick={() => {
                    setPrompt(["Create a responsive dashboard with clear information hierarchy, keyboard-accessible interactions, realistic empty/loading/error states, and polished mobile layouts.", "Create a modular CAD concept with separately named components, dimension assumptions, assembly interfaces, and an editable source workflow.", "Define a cohesive design system with semantic color tokens, type scale, spacing, component states, and accessible contrast.", "Generate a procedural 3D scene with modular geometry, adjustable parameters, named parts, export notes, and a clear distinction between estimates and verified measurements."][i]);
                    setNotice("Template loaded into the editor.");
                  }}><span className="template-icon"><I size={18} /></span><span className="template-copy"><b>{s}</b><small>{["Interface design", "Engineering concept", "UI foundations", "3D workflow"][i]}</small></span><ArrowRight size={15} className="template-arrow" /></button>;
                })}</div>
          </section>
          <aside className="right-rail"><div className="panel status-panel"><div className="rail-heading"><h3><Activity size={16} /> Workspace status</h3><span className="live-pill">LIVE UI</span></div><div className="status-row"><span>Frontend</span><b><span className="status-led" /> Ready</b></div><div className="status-row"><span>Prompt engine</span><b className="status-pending">Local only</b></div><div className="status-row"><span>Cloud / API</span><b className="status-muted">Not connected</b></div><div className="status-row"><span>Saved runs</span><b>{history.length}</b></div><div className="rail-note"><ShieldCheck size={16} /><span>Honest status reporting is enabled. This interface will not claim an AI job ran without a backend.</span></div></div>
            <div className="panel history-panel"><div className="rail-heading"><h3><Activity size={16} /> Recent runs</h3><button className="mini-link" onClick={() => setHistory([])}>Clear</button></div><div className="search-box"><Search size={15} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search prompts…" aria-label="Search prompt history" /></div><div className="history-list">{filteredHistory.length ? filteredHistory.map((h, i) => <button className="history-entry" key={i} onClick={() => setPrompt(h.prompt)}><span className="history-entry-icon"><FileText size={15} /></span><span><b>{h.prompt.slice(0, 42)}{h.prompt.length > 42 ? "…" : ""}</b><small>{h.time} · Local draft</small></span><ChevronRight size={15} /></button>) : <div className="empty-state"><div className="empty-icon"><FileText size={19} /></div><b>No saved runs yet</b><span>Run a prompt to add it to your local history.</span></div>}</div></div>
            <div className="tip-card"><div className="tip-top"><Sparkles size={16} /><span>PRO TIP</span></div><p>Better output starts with clear acceptance criteria. Ask for expected behavior, edge cases, and what should happen when something fails.</p><button onClick={() => setPrompt(p => p.trim() + "\n\nAcceptance criteria:\n- Responsive from 360px to desktop\n- Keyboard accessible with visible focus\n- Loading, empty, and error states included\n- No false claims about unavailable integrations")}>Add acceptance criteria <ArrowRight size={14} /></button></div>
          </aside>
        </div>}

        {section === "Component Blocks" && <div className="single-column"><div className="panel assets-panel"><div className="panel-top"><div className="panel-title"><div className="title-icon"><Layers3 size={17} /></div><div><h2>Asset library</h2><span>Files available in this browser session</span></div></div><button className="button button-primary" onClick={() => fileRef.current?.click()}><Upload size={16} /> Add files</button><input ref={fileRef} type="file" multiple accept=".html,.htm,.obj,.gltf,.glb,.json,.svg,.png,.jpg,.jpeg,.webp,.txt,.md" hidden onChange={e => {
                  const fs = Array.from(e.target.files || []);
                  setUploadedFiles(a => [...a, ...fs]);
                  if (fs.length) setNotice(fs.length + " file(s) added to this session.");
                  e.target.value = "";
                }} /></div><div className="upload-zone" onDragOver={e => e.preventDefault()} onDrop={e => {
                e.preventDefault();
                const fs = Array.from(e.dataTransfer.files);
                setUploadedFiles(a => [...a, ...fs]);
                if (fs.length) setNotice(fs.length + " file(s) added to this session.");
              }}><div className="upload-symbol"><FolderOpen size={24} /></div><b>Drop project files here</b><p>HTML, OBJ, GLTF, GLB, JSON, SVG, images, Markdown</p><button className="button button-secondary" onClick={() => fileRef.current?.click()}>Browse files</button><small>Files remain in this browser session; no cloud upload is performed.</small></div>{uploadedFiles.length > 0 && <div className="file-list">{uploadedFiles.map((f, i) => {
                  const isImg = f.type.startsWith("image/");
                  return <div className="file-row" key={i}><div className="file-icon">{isImg ? <FileImage size={17} /> : f.name.toLowerCase().endsWith(".obj") || f.name.toLowerCase().endsWith(".glb") || f.name.toLowerCase().endsWith(".gltf") ? <Box size={17} /> : <FileCode2 size={17} />}</div><div className="file-info"><b>{f.name}</b><span>{(f.size / 1024).toFixed(1)} KB · {f.type || "File"}</span></div><button className="icon-button" onClick={() => download(f.name, f.type.startsWith("text/") ? "" : "")} title="Export file metadata"><MoreHorizontal size={16} /></button><button className="icon-button" onClick={() => setUploadedFiles(a => a.filter((_, j) => j !== i))} aria-label={"Remove " + f.name}><X size={16} /></button></div>;
                })}</div>}<div className="library-foot"><ShieldCheck size={16} /> <span>Uploads are kept in memory only. Connect persistent storage to share assets across devices.</span></div></div><div className="two-stat-grid"><div className="mini-stat"><span>SESSION FILES</span><b>{uploadedFiles.length.toString().padStart(2, "0")}</b><small>Added in this session</small></div><div className="mini-stat"><span>WORKSPACE MODE</span><b>Local</b><small>No external sync connected</small></div></div></div>}

        {section === "Image / CAD" && <div className="cad-workspace"><div className="panel viewport-panel"><div className="viewport-head"><div><div className="panel-title"><div className="title-icon"><Box size={17} /></div><div><h2>Preview viewport</h2><span>Interactive placeholder geometry</span></div></div></div><div className="viewport-controls">{["ROT", "PAN", "ZOOM", "WIRE"].map(m => <button key={m} className={cadMode === m ? "control-active" : ""} onClick={() => {
                    setCadMode(m);
                    if (m === "WIRE") setWireframe(!wireframe);
                    if (m === "ROT") setRotating(!rotating);
                  }}>{m}</button>)}</div></div><div className="viewport-stage"><div className="viewport-grid-bg" /><div className="axis axis-x">X</div><div className="axis axis-y">Y</div><div className={"model-cube " + (rotating ? "model-rotating" : "") + (wireframe ? " model-wire" : "")}><div className="cube-side cube-front">FRONT</div><div className="cube-side cube-back">BACK</div><div className="cube-side cube-right">RIGHT</div><div className="cube-side cube-left">LEFT</div><div className="cube-side cube-top">TOP</div><div className="cube-side cube-bottom">BOTTOM</div></div><div className="viewport-hud"><span><span className="status-led" /> VIEWPORT READY</span><span>GRID 10 mm</span><span>UNITS: MM*</span></div><div className="viewport-label">DEMO GEOMETRY · NOT A CAD MODEL</div></div><div className="viewport-foot"><span><InfoIcon /> This is a visual demo, not a parsed 3D asset or engineering-validated model.</span><button className="button button-secondary" onClick={() => imageRef.current?.click()}><ImagePlus size={15} /> Add reference</button></div></div><aside className="panel component-panel"><div className="rail-heading"><h3><Layers3 size={16} /> Component tree</h3><button className="icon-button" onClick={() => setNotice("Demo assembly tree refreshed.")}><Rotate3D size={15} /></button></div><div className="assembly-root"><ChevronDown size={15} /><Box size={16} /><b>Root_Assembly</b></div>{["Chassis_Core", "Mounting_Interface", "Thermal_Module", "Fastener_Set"].map((n, i) => <button className="tree-row" key={n} onClick={e => {
                document.querySelectorAll(".tree-row").forEach(x => x.classList.remove("tree-selected"));
                (e.currentTarget as HTMLButtonElement).classList.add("tree-selected");
              }}><span className="tree-indent">└</span><Box size={15} /><span>{n}</span><span className="tree-index">0{i + 1}</span></button>)}<div className="component-details"><div className="rail-heading"><h3>Viewport controls</h3></div><div className="status-row"><span>Rotation</span><b>{rotating ? "Auto" : "Paused"}</b></div><div className="status-row"><span>Display</span><b>{wireframe ? "Wireframe" : "Shaded"}</b></div><div className="status-row"><span>Mode</span><b>{cadMode}</b></div><button className="button button-secondary full-button" onClick={() => {
                  setRotating(false);
                  setWireframe(false);
                  setCadMode("ROT");
                  setNotice("Viewport reset.");
                }}>Reset viewport</button><button className="button button-primary full-button" onClick={() => imageRef.current?.click()}><Upload size={15} /> Load reference image</button><input ref={imageRef} type="file" accept="image/*" hidden onChange={e => chooseImage(e.target.files?.[0])} />{reference && <div className="loaded-reference"><img src={referenceUrl} alt="Reference" /><span>{reference.name}</span><button onClick={() => setReference(null)} aria-label="Remove reference"><X size={14} /></button></div>}</div></aside></div>}

        {section === "/Skilled Generator" && <div className="wizard-layout"><div className="panel wizard-panel"><div className="panel-top"><div className="panel-title"><div className="title-icon"><WandSparkles size={17} /></div><div><h2>Capability builder</h2><span>Create a draft payload in three steps</span></div></div><span className="step-counter">STEP {step} OF 3</span></div><div className="step-track">{[1, 2, 3].map(n => <button key={n} onClick={() => goStep(n)} className={"step-track-item " + (step >= n ? "step-done" : "")}><span>{step > n ? <Check size={14} /> : n}</span><b>{["Definition", "Instructions", "Review"][n - 1]}</b></button>)}</div>{step === 1 && <div className="wizard-body"><div className="form-heading"><h3>Define your module</h3><p>Choose the payload type and give your capability a stable identifier.</p></div><label className="field-label">Target type<select value={target} onChange={e => setTarget(e.target.value)} className="field-input"><option value="/skills">/skills — Capability skill</option><option value="/brand">/brand — Design system & tokens</option></select></label><label className="field-label">Module designator<input value={moduleName} onChange={e => setModuleName(e.target.value)} className="field-input" placeholder="e.g. spatial-mesh-optimizer" /></label><div className="field-hint"><ShieldCheck size={15} /> Identifier will be normalized for the exported payload.</div></div>}{step === 2 && <div className="wizard-body"><div className="form-heading"><h3>Generation instructions</h3><p>Describe expected behavior, constraints, and success criteria.</p></div><label className="field-label">Directive<textarea value={directive} onChange={e => setDirective(e.target.value)} className="field-input field-textarea" rows={6} /></label><label className="field-label">Tuning profile<select value={tuning} onChange={e => setTuning(e.target.value)} className="field-input"><option>Strict deterministic</option><option>Creative exploratory</option><option>Maximum throughput</option></select></label><div className="field-hint"><Zap size={15} /> Tuning is descriptive metadata until a generation backend is connected.</div></div>}{step === 3 && <div className="wizard-body"><div className="form-heading"><h3>Review payload</h3><p>Inspect and export the draft. Nothing is deployed to a remote service.</p></div><pre className="payload-preview">{JSON.stringify(generatePayload(), null, 2)}</pre><div className="review-note"><ShieldCheck size={17} /><span><b>Draft ready</b> — review the contents before using it in another system.</span></div></div>}<div className="wizard-footer"><button className="button button-secondary" onClick={() => step === 1 ? switchSection("Prompt Studio") : goStep(step - 1)}><ArrowLeft size={15} />{step === 1 ? "Back to studio" : "Previous"}</button><div className="wizard-footer-right">{step === 3 && <button className="button button-secondary" onClick={() => download(slug(moduleName) + ".json", JSON.stringify(generatePayload(), null, 2), "application/json")}><Download size={15} /> Export JSON</button>}{step < 3 ? <button className="button button-primary" onClick={() => goStep(step + 1)}>Continue <ArrowRight size={15} /></button> : <button className="button button-primary" onClick={() => {
                    setDeployed(true);
                    setNotice("Draft marked reviewed. Export the JSON to use it elsewhere.");
                  }}><Check size={15} /> Mark reviewed</button>}</div></div>{deployed && <div className="review-note reviewed"><Check size={17} /><span>Marked reviewed locally. This did not deploy to a remote endpoint.</span></div>}</div><aside className="panel wizard-aside"><div className="rail-heading"><h3><ShieldCheck size={16} /> Build checklist</h3></div>{["Unique module name", "Clear capability directive", "Reviewable JSON output", "Explicit deployment boundary"].map((x, i) => <div className="checklist-row" key={x}><span className="checklist-check"><Check size={13} /></span><span>{x}</span></div>)}<div className="rail-note"><ShieldCheck size={16} /><span>Payloads are drafts. Validation, authentication, and deployment require a server-side implementation.</span></div><div className="mini-stat"><span>OUTPUT FORMAT</span><b>JSON</b><small>UTF-8 · Downloadable</small></div></aside></div>}

        {section === "Settings" && <div className="settings-layout"><div className="settings-main"><div className="panel settings-panel"><div className="panel-top"><div className="panel-title"><div className="title-icon"><Settings2 size={17} /></div><div><h2>Workspace preferences</h2><span>Preferences are stored on this device</span></div></div><button className="button button-primary" onClick={saveSettings}>{saved ? <><Check size={15} /> Saved</> : <>Save changes <ArrowRight size={15} /></>}</button></div><div className="settings-section"><h3>Environment</h3><p>Control local UI behavior and status presentation.</p><SettingRow title="Cinematic glow" description="Enable subtle cyan ambient accents." checked={glow} onChange={setGlow} /><SettingRow title="Live telemetry panel" description="Show frontend status and local run counts." checked={telemetry} onChange={setTelemetry} /><SettingRow title="Prompt writing hints" description="Show suggestions below the prompt editor." checked={completion} onChange={setCompletion} /></div><div className="settings-section"><h3>Operator profile</h3><p>Customize the label displayed in the workspace.</p><label className="field-label">Interface alias<input className="field-input" value={alias} onChange={e => setAlias(e.target.value)} maxLength={40} /></label></div><div className="settings-section"><h3>Integrations</h3><p>Connect services through a secure backend when available.</p><div className="integration-row"><div className="integration-icon"><Cpu size={18} /></div><div className="integration-copy"><b>AI generation provider</b><span>Not connected · API credentials should remain server-side</span></div><span className="integration-state">NOT CONNECTED</span></div><div className="integration-row"><div className="integration-icon"><GitBranch size={18} /></div><div className="integration-copy"><b>Git repository</b><span>Not connected · Versioning unavailable</span></div><span className="integration-state">NOT CONNECTED</span></div></div></div></div><aside className="panel settings-aside"><div className="rail-heading"><h3><ShieldCheck size={16} /> Privacy & status</h3></div><div className="privacy-icon"><ShieldCheck size={25} /></div><h3 className="privacy-title">Local-first workspace</h3><p className="privacy-copy">Preferences persist in this browser. Prompt history and uploaded files are session-only. No credentials or files are sent to a server by this interface.</p><div className="status-row"><span>UI build</span><b>v1.0.0</b></div><div className="status-row"><span>Data storage</span><b>Local / session</b></div><div className="status-row"><span>Remote actions</span><b className="status-muted">Disabled</b></div><button className="button button-secondary full-button" onClick={() => {
                localStorage.removeItem("typeless-settings");
                setAlias("OPERATOR-01");
                setGlow(true);
                setTelemetry(true);
                setCompletion(true);
                setNotice("Settings reset to defaults.");
              }}>Reset preferences</button></aside></div>}
        <footer className="page-footer"><span>© 2026 TYPELESS STUDIO</span><span><span className="status-led" /> UI READY</span><span>BUILT FOR CLARITY <Sparkles size={13} /></span></footer>
      </div></div>
    </main>
    {notice && <div className="toast" role="status"><Check size={17} /><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Dismiss"><X size={15} /></button></div>}
  </div>;
};
const InfoIcon = () => <span className="info-symbol">i</span>;
const SettingRow = ({
  title,
  description,
  checked,
  onChange
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => <div className="setting-row"><div><b>{title}</b><span>{description}</span></div><button role="switch" aria-checked={checked} className={"toggle-switch " + (checked ? "toggle-on" : "")} onClick={() => onChange(!checked)}><span /></button></div>;