import { useState, useEffect, useRef } from "react";

/* ─── Global CSS animations ─────────────────────────────────────────────────── */
const globalStyles = `
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes pulse-ring { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(1.8);opacity:0} }
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes blob { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} }
  @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes glow-pulse { 0%,100%{box-shadow:0 0 12px rgba(59,130,246,.25)} 50%{box-shadow:0 0 28px rgba(59,130,246,.6)} }
  @keyframes dot-ping { 0%{transform:scale(1);opacity:.8} 80%,100%{transform:scale(2.2);opacity:0} }

  .float { animation: float 3s ease-in-out infinite; }
  .blob-anim { animation: blob 7s ease-in-out infinite; }
  .glow-pulse { animation: glow-pulse 2.5s ease-in-out infinite; }
  .dot-ping { animation: dot-ping 1.5s cubic-bezier(0,0,.2,1) infinite; }

  .shimmer-text {
    background: linear-gradient(90deg, #60a5fa 0%, #bae6fd 40%, #60a5fa 60%, #38bdf8 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;
  }

  .card-hover {
    transition: transform .28s cubic-bezier(.34,1.56,.64,1), box-shadow .28s ease, border-color .28s ease;
  }
  .card-hover:hover { transform: translateY(-7px) scale(1.015); }

  .btn-shine { position:relative; overflow:hidden; }
  .btn-shine::after {
    content:''; position:absolute; top:-50%; left:-75%;
    width:50%; height:200%;
    background:linear-gradient(to right,transparent,rgba(255,255,255,.22),transparent);
    transform:skewX(-20deg); transition:left .5s ease;
  }
  .btn-shine:hover::after { left:125%; }

  .nav-link { position:relative; }
  .nav-link::after {
    content:''; position:absolute; bottom:-4px; left:0;
    width:0; height:2px;
    background:linear-gradient(90deg,#3b82f6,#06b6d4);
    transition:width .3s ease; border-radius:2px;
  }
  .nav-link:hover::after { width:100%; }

  .ticker-wrap { overflow:hidden; white-space:nowrap; }
  .ticker-inner { display:inline-block; animation:ticker 28s linear infinite; }
  .ticker-inner:hover { animation-play-state:paused; }

  .icon-spin-hover:hover { animation:spin-slow .6s linear; }
`;

/* ─── Icons ─────────────────────────────────────────────────────────────────── */
const Icon = ({ d, size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);
const icons = {
  menu:"M3 12h18M3 6h18M3 18h18", x:"M18 6L6 18M6 6l12 12",
  moon:"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  sun:"M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 5a7 7 0 1 0 0 14A7 7 0 0 0 12 5z",
  code:"M16 18l6-6-6-6M8 6l-6 6 6 6",
  mobile:"M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM12 18h.01",
  globe:"M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  brain:"M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.04-4.79A2.5 2.5 0 0 1 5 9.5a2.5 2.5 0 0 1 .5-1.5A2.5 2.5 0 0 1 9.5 2zM14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.04-4.79A2.5 2.5 0 0 0 19 9.5a2.5 2.5 0 0 0-.5-1.5A2.5 2.5 0 0 0 14.5 2z",
  zap:"M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  robot:"M12 2a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2zM9 12h.01M15 12h.01M9 16s1 1 3 1 3-1 3-1",
  mail:"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  phone:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
  mapPin:"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  chevronLeft:"M15 18l-6-6 6-6", chevronRight:"M9 18l6-6-6-6",
  target:"M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  eye:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  heart:"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  star:"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  users:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  check:"M20 6L9 17l-5-5",
  arrowRight:"M5 12h14M12 5l7 7-7 7",
  building:"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  linkedin:"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  github:"M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",
  twitter:"M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z",
  send:"M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
};

/* ─── Data ───────────────────────────────────────────────────────────────────── */
const slides = [
  { id:1, label:"App de Gestión Logística", client:"LogiTrack S.A.", desc:"Sistema integral de seguimiento de envíos en tiempo real con panel de control para operadores y clientes.", tag:"Web + Mobile", color:"from-blue-600 to-cyan-500" },
  { id:2, label:"Plataforma E-Commerce Mayorista", client:"Distribuidora del Sur", desc:"Tienda online B2B con catálogo dinámico, sistema de pedidos automatizados y panel administrativo.", tag:"Web App", color:"from-indigo-600 to-blue-500" },
  { id:3, label:"App de Turnos Médicos", client:"Centro Médico Integral", desc:"Aplicación mobile para gestión de turnos, historia clínica digital e integración con laboratorios.", tag:"Mobile iOS/Android", color:"from-sky-600 to-blue-400" },
  { id:4, label:"Automatización de RRHH", client:"Empresa Constructora", desc:"Sistema de gestión de personal con liquidación automática, control de asistencia y reportes con IA.", tag:"Desktop + IA", color:"from-blue-700 to-indigo-500" },
];

const services = [
  { icon:"mobile", title:"Apps Móviles", desc:"Desarrollamos aplicaciones nativas e híbridas para iOS y Android, con UI/UX de alto impacto y rendimiento óptimo.", techs:["React Native","Flutter","Swift","Kotlin"] },
  { icon:"globe", title:"Aplicaciones Web", desc:"Plataformas web modernas, escalables y seguras. Desde landing pages hasta sistemas complejos de gestión empresarial.", techs:["React","Node.js","Next.js","PostgreSQL"] },
  { icon:"code", title:"Software de Escritorio", desc:"Soluciones de escritorio robustas para entornos corporativos, integradas con sistemas existentes de la empresa.", techs:["Electron",".NET","Python","C++"] },
  { icon:"brain", title:"IA Aplicada", desc:"Implementamos inteligencia artificial real en tus procesos: chatbots, visión artificial, análisis predictivo y más.", techs:["OpenAI","LangChain","TensorFlow","Python"] },
];

const automations = [
  { icon:"robot", title:"Chatbots Inteligentes 24/7", desc:"Asistentes virtuales que atienden consultas de clientes, califican leads y responden emails automáticamente." },
  { icon:"zap", title:"Procesamiento de Documentos", desc:"Extracción automática de datos de facturas, contratos y formularios. Clasificación y archivo inteligente." },
  { icon:"mail", title:"Flujos de Email Marketing", desc:"Segmentación automática, envíos personalizados según comportamiento y seguimiento de clientes potenciales." },
  { icon:"star", title:"Reportes Automáticos", desc:"Generación y envío de reportes de ventas, KPIs y métricas empresariales sin intervención humana." },
  { icon:"users", title:"Gestión de RRHH", desc:"Liquidaciones automáticas, control de asistencia, onboarding digital y gestión de vacaciones." },
  { icon:"check", title:"Control de Inventario", desc:"Stock inteligente con alertas predictivas, órdenes de compra automáticas y sincronización multi-depósito." },
];

const clients = [
  { name:"LogiTrack S.A.", sector:"Logística", initial:"LT" },
  { name:"Centro Médico Integral", sector:"Salud", initial:"CM" },
  { name:"Distribuidora del Sur", sector:"Comercio", initial:"DS" },
  { name:"Municipio Bahía Blanca", sector:"Gobierno", initial:"MB" },
  { name:"Agro Sistemas", sector:"Agro", initial:"AS" },
  { name:"Estudio Jurídico Vera", sector:"Legal", initial:"EJ" },
];

const values = [
  { icon:"target", title:"Misión", desc:"Transformar los desafíos tecnológicos de las empresas en soluciones concretas, eficientes y escalables. Acompañamos a cada cliente desde la idea hasta el producto final con metodologías ágiles y foco en resultados." },
  { icon:"eye", title:"Visión", desc:"Ser la empresa de tecnología de referencia en el sur argentino, reconocida por la calidad de sus productos, la cercanía con sus clientes y la capacidad de innovar continuamente en un mundo digital en constante cambio." },
  { icon:"heart", title:"Valores", desc:"Honestidad, compromiso y excelencia técnica. Creemos en el trabajo en equipo, la mejora continua y en construir relaciones de largo plazo basadas en la confianza y los resultados." },
];

const tickerItems = ["Apps Móviles","Desarrollo Web","Software a Medida","Inteligencia Artificial","Automatizaciones","UX/UI Design","APIs REST","Cloud & DevOps","React · Node · Python"];

/* ─── Utilities ──────────────────────────────────────────────────────────────── */
function useInView(ref, threshold = 0.12) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return v;
}

function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef();
  const v = useInView(ref);
  return (
    <div ref={ref} className={className} style={{
      opacity: v ? 1 : 0,
      transform: v ? "none" : "translateY(28px)",
      transition: `opacity .65s ease ${delay}ms, transform .65s cubic-bezier(.34,1.2,.64,1) ${delay}ms`,
    }}>{children}</div>
  );
}

/* cursor glow */
function CursorGlow({ dark }) {
  const [pos, setPos] = useState({ x:-300, y:-300 });
  useEffect(() => {
    const h = e => setPos({ x:e.clientX, y:e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return (
    <div style={{
      position:"fixed", pointerEvents:"none", zIndex:9999,
      left:pos.x-200, top:pos.y-200, width:400, height:400,
      borderRadius:"50%",
      background: dark
        ? "radial-gradient(circle,rgba(59,130,246,.09) 0%,transparent 70%)"
        : "radial-gradient(circle,rgba(59,130,246,.07) 0%,transparent 70%)",
      transition:"left .1s ease,top .1s ease",
    }}/>
  );
}

/* ─── Main App ───────────────────────────────────────────────────────────────── */
export default function NitexWebsite() {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const [formData, setFormData] = useState({ name:"", email:"", company:"", msg:"" });
  const [sent, setSent] = useState(false);
  const [hoveredService, setHoveredService] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s+1)%slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }); setMenuOpen(false); };

  const handleSubmit = e => {
    e.preventDefault();
    setSent(true);
    setFormData({ name:"", email:"", company:"", msg:"" });
    setTimeout(() => setSent(false), 4000);
  };

  const d = dark;
  const bg    = d ? "bg-slate-950" : "bg-slate-50";
  const text  = d ? "text-slate-100" : "text-slate-900";
  const sub   = d ? "text-slate-400" : "text-slate-500";
  const card  = d ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";
  const navBg = d ? "bg-slate-950/90 border-slate-800" : "bg-white/90 border-slate-200";

  const navItems = [
    ["Servicios","servicios"],["IA & Automatización","ia"],
    ["Clientes","clientes"],["Nosotros","nosotros"],["Contacto","contacto"],
  ];

  return (
    <div className={`${bg} ${text} min-h-screen transition-colors duration-300 overflow-x-hidden`}
      style={{ fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      <style>{globalStyles}</style>
      <CursorGlow dark={dark} />

      {/* ── NAV ── */}
      <nav className={`fixed top-0 w-full z-50 border-b backdrop-blur-md ${navBg} transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => scrollTo("home")} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-blue-500/50">
              <span className="text-white font-black text-sm">N</span>
            </div>
            <span className="font-bold text-xl tracking-tight"><span className="text-blue-500">Ni</span>tex</span>
          </button>

          <div className="hidden md:flex items-center gap-7 text-sm font-medium">
            {navItems.map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)}
                className={`nav-link ${sub} hover:text-blue-500 transition-colors pb-1`}>{label}</button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setDark(!d)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-12 ${d?"bg-slate-800 text-yellow-400 hover:bg-yellow-400/15":"bg-slate-100 text-slate-600 hover:bg-blue-100"}`}>
              <Icon d={d ? icons.sun : icons.moon} size={16}/>
            </button>
            <button onClick={() => scrollTo("contacto")}
              className="hidden md:flex btn-shine items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:scale-95">
              Hablemos
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-all ${d?"hover:bg-slate-800":"hover:bg-slate-100"}`}>
              <Icon d={menuOpen ? icons.x : icons.menu} size={20}/>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className={`md:hidden border-t ${d?"border-slate-800 bg-slate-950":"border-slate-200 bg-white"} px-4 py-3 space-y-1`}>
            {navItems.map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)}
                className={`block w-full text-left px-3 py-2.5 rounded-xl ${sub} hover:text-blue-500 hover:bg-blue-500/10 transition-all`}>
                {label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="home" className="relative min-h-screen flex flex-col pt-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute inset-0 ${d?"bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950":"bg-gradient-to-br from-blue-50 via-sky-50 to-slate-50"}`}/>
          <div className="absolute top-16 -left-48 w-96 h-96 bg-blue-600/10 blob-anim blur-3xl"/>
          <div className="absolute bottom-16 -right-48 w-96 h-96 bg-cyan-500/10 blob-anim blur-3xl" style={{animationDelay:"3.5s"}}/>
          <div className="absolute inset-0 opacity-[0.035]"
            style={{backgroundImage:`linear-gradient(${d?"#60a5fa":"#3b82f6"} 1px,transparent 1px),linear-gradient(90deg,${d?"#60a5fa":"#3b82f6"} 1px,transparent 1px)`,backgroundSize:"60px 60px"}}/>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-6 flex-1 flex flex-col justify-center">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 hover:scale-105 transition-transform cursor-default"
              style={{background:"rgba(59,130,246,.12)",color:"#60a5fa",border:"1px solid rgba(96,165,250,.3)"}}>
              <span className="relative flex h-2 w-2">
                <span className="dot-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"/>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"/>
              </span>
              Bahía Blanca, Argentina · Proyectos activos
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-none mb-6 tracking-tight">
              Tecnología que<br/>
              <span className="shimmer-text">transforma</span>{" "}
              tu empresa
            </h1>

            <p className={`text-lg md:text-xl ${sub} max-w-2xl mb-10 leading-relaxed`}>
              Desarrollamos software a medida, aplicaciones móviles y soluciones con inteligencia artificial. Cada proyecto es único, cada solución está pensada para tu negocio.
            </p>

            <div className="flex flex-wrap gap-4">
              <button onClick={() => scrollTo("contacto")}
                className="btn-shine glow-pulse flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all hover:shadow-xl hover:shadow-blue-500/35 hover:-translate-y-1 active:scale-95 text-sm">
                Comenzar proyecto
                <Icon d={icons.arrowRight} size={16}/>
              </button>
              <button onClick={() => scrollTo("servicios")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold border transition-all hover:-translate-y-1 active:scale-95 text-sm hover:border-blue-500 hover:text-blue-500 ${d?"border-slate-700 text-slate-300":"border-slate-300 text-slate-700"}`}>
                Ver servicios
              </button>
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div className={`relative w-full border-y py-3 ${d?"border-slate-800 bg-slate-900/40":"border-slate-200 bg-white/60"}`}>
          <div className="ticker-wrap">
            <div className="ticker-inner">
              {[...tickerItems,...tickerItems].map((item,i) => (
                <span key={i} className={`inline-flex items-center gap-3 mx-6 text-xs font-bold uppercase tracking-widest ${sub}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"/>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="relative max-w-6xl mx-auto px-4 py-10 w-full">
          <div className="relative overflow-hidden rounded-2xl border"
            style={{borderColor:d?"rgba(59,130,246,.2)":"rgba(59,130,246,.25)"}}>
            <div className={`bg-gradient-to-r ${slides[slide].color} p-6 md:p-8`}>
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <span className="text-xs font-bold text-white/70 uppercase tracking-widest">{slides[slide].tag}</span>
                  <h3 className="text-xl md:text-2xl font-black text-white mt-1">{slides[slide].label}</h3>
                  <p className="text-white/70 text-sm mt-1">Cliente: {slides[slide].client}</p>
                  <p className="text-white/85 mt-3 max-w-xl text-sm md:text-base">{slides[slide].desc}</p>
                </div>
                <div className="flex gap-3 items-center">
                  <button onClick={() => setSlide(s => (s-1+slides.length)%slides.length)}
                    className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-90">
                    <Icon d={icons.chevronLeft} size={16}/>
                  </button>
                  <button onClick={() => setSlide(s => (s+1)%slides.length)}
                    className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-90">
                    <Icon d={icons.chevronRight} size={16}/>
                  </button>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                {slides.map((_,i) => (
                  <button key={i} onClick={() => setSlide(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i===slide?"w-7 bg-white":"w-2 bg-white/40 hover:bg-white/70"}`}/>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NOSOTROS ── */}
      <section id="nosotros" className={`py-24 ${d?"bg-slate-900/50":"bg-white"}`}>
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-blue-500 text-sm font-bold uppercase tracking-widest">Quiénes somos</span>
              <h2 className="text-3xl md:text-4xl font-black mt-2">Construimos con propósito</h2>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <FadeIn key={v.title} delay={i*120}>
                <div className={`rounded-2xl border p-7 h-full card-hover cursor-default group ${card}`}>
                  <div className="w-12 h-12 rounded-xl mb-5 flex items-center justify-center bg-blue-500/15 text-blue-400 transition-all duration-300 group-hover:bg-blue-500 group-hover:text-white group-hover:scale-110 group-hover:rotate-6">
                    <Icon d={icons[v.icon]} size={22}/>
                  </div>
                  <h3 className="text-lg font-black mb-3 text-blue-400 group-hover:text-blue-300 transition-colors">{v.title}</h3>
                  <p className={`${sub} text-sm leading-relaxed`}>{v.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="servicios" className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-blue-500 text-sm font-bold uppercase tracking-widest">Lo que hacemos</span>
              <h2 className="text-3xl md:text-4xl font-black mt-2">Servicios de desarrollo</h2>
              <p className={`${sub} mt-3 max-w-xl mx-auto`}>Software hecho a la medida de tu negocio, con tecnologías modernas y metodología ágil.</p>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((s, i) => (
              <FadeIn key={s.title} delay={i*100}>
                <div
                  className={`rounded-2xl border p-7 h-full card-hover cursor-pointer group ${card} ${hoveredService===i?"border-blue-500":""}`}
                  onMouseEnter={() => setHoveredService(i)}
                  onMouseLeave={() => setHoveredService(null)}>
                  <div className="flex items-start gap-5">
                    <div className={`w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center transition-all duration-300 ${hoveredService===i?"bg-blue-500 text-white scale-110 rotate-6 shadow-xl shadow-blue-500/30":"bg-blue-500/15 text-blue-400"}`}>
                      <Icon d={icons[s.icon]} size={24}/>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-black mb-2 group-hover:text-blue-400 transition-colors">{s.title}</h3>
                      <p className={`${sub} text-sm leading-relaxed mb-4`}>{s.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {s.techs.map((t, ti) => (
                          <span key={t}
                            className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all duration-200 ${hoveredService===i?"bg-blue-500/20 text-blue-400 border border-blue-500/30":d?"bg-slate-800 text-slate-400":"bg-slate-100 text-slate-600"}`}
                            style={{transitionDelay:`${ti*40}ms`}}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── IA ── */}
      <section id="ia" className={`py-24 ${d?"bg-slate-900/50":"bg-blue-50/50"}`}>
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-4">
              <span className="text-cyan-500 text-sm font-bold uppercase tracking-widest">Inteligencia Artificial</span>
              <h2 className="text-3xl md:text-4xl font-black mt-2">IA Aplicada & Automatizaciones</h2>
              <p className={`${sub} mt-3 max-w-2xl mx-auto`}>Implementamos soluciones de IA que se integran con tus procesos actuales para ahorrar tiempo, reducir errores y escalar sin aumentar costos operativos.</p>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <div className="my-10 p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-center relative overflow-hidden group cursor-default hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
              <p className="relative text-2xl md:text-3xl font-black">Las empresas que automatizan con IA reducen costos hasta un <span className="text-yellow-300">78%</span> y aceleran flujos un <span className="text-yellow-300">50%</span></p>
              <p className="relative text-white/70 text-sm mt-2">Fuente: McKinsey & Jitterbit AI Benchmark 2025</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {automations.map((a, i) => (
              <FadeIn key={a.title} delay={i*80}>
                <div className={`rounded-2xl border p-6 h-full card-hover cursor-default group ${card}`}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-cyan-500/15 text-cyan-400 mb-4 transition-all duration-300 group-hover:bg-cyan-500 group-hover:text-white group-hover:scale-110 group-hover:-rotate-6">
                    <Icon d={icons[a.icon]} size={19}/>
                  </div>
                  <h3 className="font-black mb-2 text-sm md:text-base group-hover:text-cyan-400 transition-colors">{a.title}</h3>
                  <p className={`${sub} text-xs md:text-sm leading-relaxed`}>{a.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENTS ── */}
      <section id="clientes" className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-blue-500 text-sm font-bold uppercase tracking-widest">Zona de Clientes</span>
              <h2 className="text-3xl md:text-4xl font-black mt-2">Empresas que confían en Nitex</h2>
              <p className={`${sub} mt-3 max-w-xl mx-auto`}>Trabajamos con empresas de distintos sectores en Bahía Blanca y la región.</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-14">
            {clients.map((c, i) => (
              <FadeIn key={c.name} delay={i*80}>
                <div className={`rounded-2xl border p-5 flex items-center gap-4 card-hover cursor-default group ${card}`}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-blue-500/30">
                    {c.initial}
                  </div>
                  <div>
                    <p className="font-bold text-sm leading-tight group-hover:text-blue-400 transition-colors">{c.name}</p>
                    <p className={`text-xs mt-0.5 ${sub}`}>{c.sector}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className={`rounded-2xl border p-7 flex flex-col md:flex-row items-center justify-between gap-6 card-hover cursor-default ${card}`}
              style={{borderColor:d?"rgba(59,130,246,.3)":"rgba(59,130,246,.3)"}}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
                  <Icon d={icons.building} size={22}/>
                </div>
                <div>
                  <h3 className="font-black text-lg">¿Sos cliente de Nitex?</h3>
                  <p className={`${sub} text-sm`}>Accedé al portal para ver el estado de tu proyecto y comunicarte con tu equipo.</p>
                </div>
              </div>
              <button className="btn-shine flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 active:scale-95 whitespace-nowrap">
                Portal de clientes
                <Icon d={icons.arrowRight} size={16}/>
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contacto" className={`py-24 ${d?"bg-slate-900/50":"bg-slate-100/50"}`}>
        <div className="max-w-5xl mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-14">
              <span className="text-blue-500 text-sm font-bold uppercase tracking-widest">Contacto</span>
              <h2 className="text-3xl md:text-4xl font-black mt-2">Hablemos de tu proyecto</h2>
              <p className={`${sub} mt-3 max-w-xl mx-auto`}>Contanos tu idea y te respondemos en menos de 24 horas con una propuesta sin costo.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-5 gap-8">
            <FadeIn className="md:col-span-2">
              <div className="space-y-4">
                {[
                  { icon:"mail", label:"Email", value:"hola@nitex.com.ar" },
                  { icon:"phone", label:"WhatsApp", value:"+54 291 555-0000" },
                  { icon:"mapPin", label:"Ubicación", value:"Bahía Blanca, Buenos Aires" },
                ].map(info => (
                  <div key={info.label}
                    className={`flex items-center gap-4 p-4 rounded-xl border card-hover cursor-default group ${card}`}>
                    <div className="w-11 h-11 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-blue-500 group-hover:text-white group-hover:scale-110">
                      <Icon d={icons[info.icon]} size={18}/>
                    </div>
                    <div>
                      <p className={`text-xs ${sub} font-medium`}>{info.label}</p>
                      <p className="font-bold text-sm group-hover:text-blue-400 transition-colors">{info.value}</p>
                    </div>
                  </div>
                ))}

                <div className={`p-5 rounded-2xl border ${card}`}>
                  <p className={`text-xs ${sub} mb-3 font-semibold uppercase tracking-widest`}>Síguenos</p>
                  <div className="flex gap-3">
                    {["linkedin","github","twitter"].map(soc => (
                      <button key={soc}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-blue-500 hover:text-white hover:scale-110 hover:-translate-y-1 active:scale-90 ${d?"bg-slate-800 text-slate-400":"bg-slate-100 text-slate-500"}`}>
                        <Icon d={icons[soc]} size={16}/>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={150} className="md:col-span-3">
              <div className={`rounded-2xl border p-7 ${card}`}>
                {sent ? (
                  <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-4">
                      <Icon d={icons.check} size={28}/>
                    </div>
                    <h3 className="font-black text-xl mb-2">¡Mensaje enviado!</h3>
                    <p className={sub}>Te contactaremos en menos de 24 horas.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { key:"name", label:"Nombre completo", placeholder:"Juan García" },
                        { key:"email", label:"Email", placeholder:"juan@empresa.com" },
                      ].map(f => (
                        <div key={f.key} className="col-span-2 md:col-span-1">
                          <label className={`text-xs font-semibold ${sub} mb-1.5 block`}>{f.label}</label>
                          <input type={f.key==="email"?"email":"text"} required placeholder={f.placeholder}
                            value={formData[f.key]} onChange={e => setFormData(p => ({...p,[f.key]:e.target.value}))}
                            className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:scale-[1.015] ${d?"bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500":"bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"}`}/>
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className={`text-xs font-semibold ${sub} mb-1.5 block`}>Empresa (opcional)</label>
                      <input type="text" placeholder="Nombre de tu empresa"
                        value={formData.company} onChange={e => setFormData(p => ({...p,company:e.target.value}))}
                        className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:scale-[1.015] ${d?"bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500":"bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"}`}/>
                    </div>
                    <div>
                      <label className={`text-xs font-semibold ${sub} mb-1.5 block`}>Contanos tu proyecto</label>
                      <textarea required rows={4} placeholder="¿Qué necesitás desarrollar? Breve descripción..."
                        value={formData.msg} onChange={e => setFormData(p => ({...p,msg:e.target.value}))}
                        className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none ${d?"bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500":"bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"}`}/>
                    </div>
                    <button type="submit"
                      className="btn-shine w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:scale-95">
                      <Icon d={icons.send} size={15}/>
                      Enviar mensaje
                    </button>
                  </form>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={`border-t py-8 ${d?"border-slate-800 bg-slate-950":"border-slate-200 bg-white"}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <button onClick={() => scrollTo("home")} className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center transition-all group-hover:rotate-6 group-hover:scale-110">
                <span className="text-white font-black text-xs">N</span>
              </div>
              <span className="font-bold"><span className="text-blue-500">Ni</span>tex</span>
              <span className={`text-xs ${sub} ml-2`}>Bahía Blanca, Argentina</span>
            </button>
            <div className={`flex gap-5 text-xs ${sub}`}>
              {navItems.map(([label,id]) => (
                <button key={id} onClick={() => scrollTo(id)} className="nav-link hover:text-blue-500 transition-colors pb-1">{label}</button>
              ))}
            </div>
            <p className={`text-xs ${sub}`}>© 2025 Nitex. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}