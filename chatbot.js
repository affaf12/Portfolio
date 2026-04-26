// ============================================================
//  NextGen Analytics — VIP AI Chatbot  (chatbot.js)
//  Features: Smart intent matching · Quick-reply chips
//            Multi-turn context · Lead capture · Rich cards
//            Typing delay · Session memory · WhatsApp CTA
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  // ── DOM refs ────────────────────────────────────────────────
  const toggleBtn    = document.getElementById("chatbot-toggle");
  const chatWindow   = document.getElementById("chatbot-window");
  const closeBtn     = document.getElementById("chatbot-close");
  const sendBtn      = document.getElementById("chatbot-send");
  const input        = document.getElementById("chatbot-input");
  const body         = document.getElementById("chatbot-body");
  const botSound     = document.getElementById("bot-sound");
  const soundChk     = document.getElementById("sound-checkbox");

  if (!toggleBtn || !chatWindow || !sendBtn || !input || !body) return;

  // ── Session state ────────────────────────────────────────────
  let userName        = "";
  let awaitingName    = false;
  let awaitingEmail   = false;
  let leadEmail       = "";
  let messageCount    = 0;
  let lastIntent      = "";
  let conversationLog = [];   // {role, text}
  let opened          = false;

  // ── Helpers ──────────────────────────────────────────────────
  const playSound = () => { if (soundChk?.checked) botSound?.play().catch(()=>{}); };

  const scrollBottom = () =>
    body.scrollTo({ top: body.scrollHeight, behavior: "smooth" });

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  // ── Typing indicator ─────────────────────────────────────────
  const showTyping = (delay = 900) =>
    new Promise(resolve => {
      const dot = document.createElement("div");
      dot.className = "bot-msg typing-indicator";
      dot.innerHTML = `<span></span><span></span><span></span>`;
      body.appendChild(dot);
      scrollBottom();
      setTimeout(() => { dot.remove(); resolve(); }, delay);
    });

  // ── Append message ───────────────────────────────────────────
  const appendMsg = (html, role = "bot") => {
    const el = document.createElement("div");
    el.className = role === "bot" ? "bot-msg" : "user-msg";
    el.innerHTML = html;
    body.appendChild(el);
    scrollBottom();
    if (role === "bot") playSound();
    conversationLog.push({ role, text: html });
    return el;
  };

  // ── Quick-reply chips ────────────────────────────────────────
  const showChips = (chips) => {
    const wrap = document.createElement("div");
    wrap.className = "chip-row";
    chips.forEach(({ label, value }) => {
      const btn = document.createElement("button");
      btn.className = "chip-btn";
      btn.textContent = label;
      btn.onclick = () => {
        wrap.remove();
        handleUserMessage(value || label);
      };
      wrap.appendChild(btn);
    });
    body.appendChild(wrap);
    scrollBottom();
  };

  // ── Rich card helper ─────────────────────────────────────────
  const demoCard = (title, url) => `
    <div class="demo-card">
      <span class="demo-card-title">${title}</span>
      <a class="demo-card-link" href="${url}" target="_blank" rel="noopener">
        📊 View Live Demo →
      </a>
    </div>`;

  const pricingCard = () => `
    <div class="pricing-row">
      <div class="p-card"><strong>Basic</strong><br>$20<br><small>Simple dashboard<br>1 source · 2-3 days</small></div>
      <div class="p-card featured"><strong>⭐ Standard</strong><br>$50<br><small>Interactive dash<br>Multi-source · 4-6 days</small></div>
      <div class="p-card"><strong>Premium</strong><br>$100<br><small>Advanced + ETL<br>Unlimited revisions</small></div>
    </div>`;

  const CALENDLY = "https://calendly.com/muhammadaffaf746/new-meeting";

  const contactCard = () => `
    <div class="contact-card">
      <a href="mailto:muhammadaffaf746@gmail.com">✉️ muhammadaffaf746@gmail.com</a><br>
      <a href="https://wa.me/923042365964" target="_blank">💬 WhatsApp: +92 304 2365964</a><br>
      <a href="https://www.linkedin.com/in/muhammadaffaf/" target="_blank">🔗 LinkedIn Profile</a><br>
      <a href="${CALENDLY}" target="_blank" rel="noopener">📅 Book a Free Meeting</a>
    </div>`;

  const calendlyCard = () => `
    <div class="calendly-card">
      <div class="calendly-card-icon">📅</div>
      <div class="calendly-card-body">
        <strong>Book a Free Meeting</strong>
        <span>Pick a time that works for you — 15 or 30 min slot</span>
      </div>
      <a class="calendly-card-btn" href="${CALENDLY}" target="_blank" rel="noopener">
        Book Now →
      </a>
    </div>`;

  // ── Intent database ──────────────────────────────────────────
  // Each intent: { keys[], answer (string|fn), chips?, delay? }
  const intents = [
    // ── GREETING ──
    {
      id: "greeting",
      keys: ["hi","hello","hey","good morning","good afternoon","good evening","salam","assalam","hola","sup","yo"],
      answer: () => {
        const name = userName ? `, ${userName}` : "";
        return `${greet()}${name}! 👋 Welcome to <strong>NextGen Analytics</strong> — your go-to for Power BI & data analytics solutions.<br><br>How can I help you today?`;
      },
      chips: [
        { label: "📊 See Services" },
        { label: "💰 Pricing Plans" },
        { label: "📁 View Projects" },
        { label: "📅 Book a Meeting" },
        { label: "📞 Contact Affaf" },
      ]
    },

    // ── ABOUT / WHO ──
    {
      id: "about",
      keys: ["who are you","who is affaf","about","tell me about","nextgen analytics","what is nextgen"],
      answer: `<strong>NextGen Analytics</strong> is founded by <strong>Muhammad Affaf</strong>, a results-driven Power BI Developer & Data Analytics Expert with 3+ years of experience.<br><br>
      ✅ Certified in Microsoft Power BI & Google Data Analytics<br>
      ✅ Worked with PwC Switzerland & Accenture (remote)<br>
      ✅ Clients across Pakistan 🇵🇰, UAE 🇦🇪, UK 🇬🇧 & USA 🇺🇸`,
      chips: [
        { label: "🏅 Certifications" },
        { label: "💼 Experience" },
        { label: "💰 Pricing Plans" },
      ]
    },

    // ── SERVICES ──
    {
      id: "services",
      keys: ["service","what do you do","what do you offer","offer","help me with","can you build","do you make","capabilities"],
      answer: `Here's what <strong>NextGen Analytics</strong> delivers:<br><br>
      📊 <strong>Power BI Dashboards</strong> — KPIs, trends & insights<br>
      🗃️ <strong>SQL Analytics & Reporting</strong> — deep data queries<br>
      ⚙️ <strong>ETL & Automation</strong> — Python & Power Automate<br>
      ☁️ <strong>Cloud Data Solutions</strong> — Azure & beyond<br>
      📈 <strong>Excel Analytics</strong> — advanced models & reports`,
      chips: [
        { label: "📊 Power BI Demo" },
        { label: "💰 See Pricing" },
        { label: "🛒 Order Now" },
      ]
    },

    // ── PRICING ──
    {
      id: "pricing",
      keys: ["price","pricing","cost","how much","rate","budget","plan","package","affordable","cheap","fee"],
      answer: () => `Here are our <strong>transparent pricing plans</strong>:${pricingCard()}<br>Need something custom? Just tell me your requirements!`,
      chips: [
        { label: "🛒 Order Now" },
        { label: "📅 Book a Meeting" },
        { label: "🤝 Custom Quote" },
        { label: "📞 Talk to Affaf" },
      ]
    },

    // ── POWER BI ──
    {
      id: "powerbi",
      keys: ["power bi","powerbi","bi dashboard","business intelligence","dax","power query"],
      answer: `Absolutely! Power BI is our specialty 💪<br><br>
      We build:<br>
      ✔ Interactive dashboards with drill-through<br>
      ✔ Custom DAX measures & KPI cards<br>
      ✔ Real-time data refresh<br>
      ✔ Multi-source data models (SQL, Excel, APIs)<br><br>
      Want to see a live demo?`,
      chips: [
        { label: "📊 Sales Demo" },
        { label: "👥 HR Demo" },
        { label: "💰 Finance Demo" },
        { label: "🛒 Order a Dashboard" },
      ]
    },

    // ── SQL ──
    {
      id: "sql",
      keys: ["sql","database","query","data warehouse","etl","mysql","postgresql","data model"],
      answer: `Yes! Strong SQL skills here 🗃️<br><br>
      We handle:<br>
      ✔ Complex queries & stored procedures<br>
      ✔ ETL pipeline design<br>
      ✔ Data warehouse modeling (Star & Snowflake schemas)<br>
      ✔ Database optimization & performance tuning`,
      chips: [
        { label: "💰 Pricing Plans" },
        { label: "📁 See Projects" },
        { label: "📞 Contact Us" },
      ]
    },

    // ── PYTHON ──
    {
      id: "python",
      keys: ["python","pandas","numpy","automation","streamlit","script"],
      answer: `Python is part of our toolkit 🐍<br><br>
      We use Python for:<br>
      ✔ Data cleaning & transformation (Pandas)<br>
      ✔ Workflow automation<br>
      ✔ Streamlit data apps<br>
      ✔ Statistical analysis & modeling<br><br>
      Check out our Delivery Chatbot built with Streamlit!`,
      chips: [
        { label: "🤖 Streamlit Demo" },
        { label: "💰 Pricing" },
        { label: "📞 Contact" },
      ]
    },

    // ── EXCEL ──
    {
      id: "excel",
      keys: ["excel","spreadsheet","vlookup","pivot","pivot table","excel dashboard"],
      answer: `Excel is a core tool we master 📗<br><br>
      ✔ Advanced formulas (XLOOKUP, INDEX/MATCH, SUMIFS)<br>
      ✔ Pivot tables & pivot charts<br>
      ✔ Excel dashboards & KPI trackers<br>
      ✔ Power Query in Excel for data transformation`,
      chips: [
        { label: "💰 Pricing" },
        { label: "📞 Contact" },
      ]
    },

    // ── DEMOS by category ──
    {
      id: "demo_sales",
      keys: ["sales report","sales dashboard","revenue report","sales demo","sales"],
      answer: () => `Here is our <strong>Sales Analytics Demo</strong> 📈 ${demoCard("Sales Report Demo","https://docs.google.com/spreadsheets/d/1ujKebcqgvmkDIesR5SPr-6MyskX0x8zfmZ_j36r2uIA/edit?usp=sharing")}`,
      chips: [{ label: "👥 HR Demo" },{ label: "💰 Finance Demo" },{ label: "🛒 Order Now" }]
    },
    {
      id: "demo_hr",
      keys: ["hr report","hr dashboard","employee report","human resources","hr demo","hr"],
      answer: () => `Here is our <strong>HR Analytics Demo</strong> 👥 ${demoCard("HR Report Demo","https://docs.google.com/spreadsheets/d/1rD8TMk15laPGiJnlZ1adgiJ0EgNZrB6x9yJDw8eOLcc/edit?usp=sharing")}`,
      chips: [{ label: "📊 Sales Demo" },{ label: "💰 Finance Demo" },{ label: "🛒 Order Now" }]
    },
    {
      id: "demo_finance",
      keys: ["financial report","finance dashboard","financial analysis","finance demo","finance"],
      answer: () => `Here is our <strong>Financial Analytics Demo</strong> 💰 ${demoCard("Finance Report Demo","https://docs.google.com/spreadsheets/d/1fk0qtcJL0y7kwCffg15sxfU8r54TVQRjTMCBUmxfKAs/edit?usp=sharing")}`,
      chips: [{ label: "📊 Sales Demo" },{ label: "👥 HR Demo" },{ label: "🛒 Order Now" }]
    },
    {
      id: "demo_healthcare",
      keys: ["healthcare","medical dashboard","hospital report","health report","healthcare demo"],
      answer: () => `Here is our <strong>Healthcare Analytics Demo</strong> 🏥 ${demoCard("Healthcare Report Demo","https://docs.google.com/spreadsheets/d/1XDlhtOG2W0MDDav1k7zNzexls8UZHxZJRax52k7mrjs/edit?usp=sharing")}`,
      chips: [{ label: "📊 Sales Demo" },{ label: "🛒 Order Now" }]
    },
    {
      id: "demo_marketing",
      keys: ["marketing report","marketing dashboard","campaign report","marketing demo","marketing"],
      answer: () => `Here is our <strong>Marketing Analytics Demo</strong> 📣 ${demoCard("Marketing Report Demo","https://docs.google.com/spreadsheets/d/1VLzDL_6mL7YgnSr_pycnCjF_K0R4GL9IoxJyksVxGmg/edit?usp=sharing")}`,
      chips: [{ label: "📊 Sales Demo" },{ label: "🛒 Order Now" }]
    },
    {
      id: "demo_insurance",
      keys: ["insurance report","insurance dashboard","policy report","insurance demo","insurance"],
      answer: () => `Here is our <strong>Insurance Analytics Demo</strong> 🛡️ ${demoCard("Insurance Report Demo","https://docs.google.com/spreadsheets/d/1A7XHQKQpI8jqpJg8sYmTR3XgZpAog8HtrxOV-0e9nwg/edit?usp=sharing")}`,
      chips: [{ label: "💰 Pricing" },{ label: "🛒 Order Now" }]
    },
    {
      id: "demo_realestate",
      keys: ["real estate","property dashboard","housing report","real estate demo","property report"],
      answer: () => `Here is our <strong>Real Estate Analytics Demo</strong> 🏠 ${demoCard("Real Estate Report Demo","https://docs.google.com/spreadsheets/d/1ZvE4UOfhsbjqa3ITObon1soxBrJPLMUgvCzSHdCYQ6c/edit?usp=sharing")}`,
      chips: [{ label: "💰 Pricing" },{ label: "🛒 Order Now" }]
    },
    {
      id: "demo_logistics",
      keys: ["logistics","supply chain","shipment report","logistics demo","supply chain demo"],
      answer: () => `Here is our <strong>Logistics & Supply Chain Demo</strong> 🚚 ${demoCard("Logistics Report Demo","https://docs.google.com/spreadsheets/d/1pFr8wy-9KO1yCyWW5AKpGgKS2b87lF7Exf80skzPaCU/edit?usp=sharing")}`,
      chips: [{ label: "💰 Pricing" },{ label: "🛒 Order Now" }]
    },
    {
      id: "demo_streamlit",
      keys: ["streamlit","chatbot demo","delivery chatbot","ai app","streamlit demo"],
      answer: () => `Here is our <strong>AI Delivery Chatbot</strong> built with Streamlit 🤖 ${demoCard("Delivery Data Chatbot","https://delivery-chatbot-scwqochc7mtnkykkayatxn.streamlit.app/")}`,
      chips: [{ label: "📊 Power BI Demos" },{ label: "🛒 Order Now" }]
    },

    // ── ALL DEMOS ──
    {
      id: "demos",
      keys: ["demo","show me","portfolio","projects","work","examples","see dashboard","live demo"],
      answer: `Here are some of our <strong>live dashboard demos</strong> 🎯<br><br>
      Pick a category:`,
      chips: [
        { label: "📊 Sales Demo" },
        { label: "👥 HR Demo" },
        { label: "💰 Finance Demo" },
        { label: "🏥 Healthcare Demo" },
        { label: "📣 Marketing Demo" },
        { label: "🚚 Logistics Demo" },
        { label: "🤖 AI Chatbot Demo" },
      ]
    },

    // ── ORDER ──
    {
      id: "order",
      keys: ["order","book","hire","start project","get started","place order","buy","purchase","get a dashboard","i want","i need"],
      answer: `Ready to get started? 🚀 You can place your order directly using the form below:<br><br>
      <a class="cta-btn" href="https://docs.google.com/forms/d/e/1FAIpQLSd5yJ5uI89_Xqx0t0Xt-vNCmCs5SRXDHQeGFI619PLKVFjTJg/viewform" target="_blank">
        🛒 Place Your Order Now
      </a><br><br>
      Or prefer to talk first? Book a <strong>free consultation call</strong>:<br><br>
      <a class="cta-btn cta-calendly" href="https://calendly.com/muhammadaffaf746/new-meeting" target="_blank">
        📅 Book a Free Meeting
      </a><br><br>
      Or <a href="https://wa.me/923042365964" target="_blank">💬 chat directly on WhatsApp</a> for a quick response!`,
      chips: [
        { label: "💰 Pricing First" },
        { label: "📅 Book a Meeting" },
        { label: "💬 WhatsApp Us" },
      ]
    },

    // ── BOOK A MEETING ──
    {
      id: "meeting",
      keys: ["book","meeting","schedule","call","consultation","calendly","appointment","free call","talk","discuss","zoom","google meet","video call","book a call","book a meeting","free consultation"],
      answer: () => `Let's schedule a <strong>free meeting</strong>! 📅<br><br>
      Pick a time that works for you — Affaf is available for 15 or 30-minute consultations:<br><br>
      ${calendlyCard()}<br>
      No commitment. Just a friendly chat about your data needs! 😊`,
      chips: [
        { label: "💰 Pricing Plans" },
        { label: "📊 View Services" },
        { label: "🛒 Order Now" },
      ]
    },

    // ── CONTACT ──
    {
      id: "contact",
      keys: ["contact","email","reach","whatsapp","phone","call","message","connect","linkedin"],
      answer: () => `Here's how to reach <strong>Muhammad Affaf</strong> directly:<br><br>${contactCard()}`,
      chips: [
        { label: "📅 Book a Meeting" },
        { label: "🛒 Order Now" },
        { label: "💰 Pricing Plans" },
      ]
    },

    // ── CERTIFICATIONS ──
    {
      id: "certifications",
      keys: ["certif","certified","qualification","credential","google","microsoft","coursera","pl-300"],
      answer: `Muhammad Affaf holds <strong>6 professional certifications</strong> 🎓<br><br>
      🏆 Microsoft Power BI Data Analyst (PL-300)<br>
      🏆 Google Data Analytics<br>
      🏆 Business Analytics — Wharton / UPenn<br>
      🏆 Google Project Management<br>
      🏆 Business Data Management & Communication<br>
      🏆 Business English Communication Skills<br><br>
      All verified on <a href="https://www.coursera.org" target="_blank">Coursera</a>.`,
      chips: [
        { label: "💼 Experience" },
        { label: "📁 View Projects" },
        { label: "💰 Pricing" },
      ]
    },

    // ── EXPERIENCE ──
    {
      id: "experience",
      keys: ["experience","pwc","accenture","background","work history","worked","career","years"],
      answer: `Muhammad Affaf has <strong>3+ years</strong> of professional experience 💼<br><br>
      🔹 <strong>PwC Switzerland</strong> — Power BI Job Simulation (Remote)<br>
      🔹 <strong>Accenture North America</strong> — Data Analytics & Visualization (Remote)<br>
      🔹 <strong>Freelance</strong> — Power BI dashboards for global clients<br><br>
      Boosted client revenue by up to <strong>15%</strong> and reduced operational inefficiencies by <strong>25%</strong>.`,
      chips: [
        { label: "🏅 Certifications" },
        { label: "📁 View Projects" },
        { label: "🛒 Order Now" },
      ]
    },

    // ── TIMELINE / DELIVERY ──
    {
      id: "timeline",
      keys: ["how long","timeline","delivery","turnaround","when","deadline","days","quick"],
      answer: `Delivery timelines by plan ⏱️<br><br>
      ⚡ <strong>Basic</strong> — 2-3 business days<br>
      🔄 <strong>Standard</strong> — 4-6 business days<br>
      🏗️ <strong>Premium</strong> — 7-10 business days<br>
      🤝 <strong>Custom</strong> — Discussed per project<br><br>
      Rush delivery available on request via WhatsApp!`,
      chips: [
        { label: "💰 See Pricing" },
        { label: "🛒 Order Now" },
      ]
    },

    // ── CUSTOM QUOTE ──
    {
      id: "custom",
      keys: ["custom","bespoke","specific requirement","custom quote","my requirement","unique","special"],
      answer: `For custom projects, we'd love to understand your needs! 🤝<br><br>
      Please share:<br>
      📌 What type of dashboard/report you need<br>
      📌 Your data sources (Excel, SQL, APIs, etc.)<br>
      📌 Your deadline<br><br>
      The easiest way? <strong>Book a free call</strong> and let's discuss:<br><br>
      <a class="cta-btn cta-calendly" href="https://calendly.com/muhammadaffaf746/new-meeting" target="_blank">📅 Book a Free Meeting</a>
      <br><br>Or <a class="cta-btn" href="https://wa.me/923042365964" target="_blank">💬 Chat on WhatsApp</a>`,
      chips: [{ label: "📞 Contact Info" },{ label: "💰 See Standard Plans" }]
    },

    // ── WHATSAPP ──
    {
      id: "whatsapp",
      keys: ["whatsapp","wa","watsapp","chat now","talk now"],
      answer: `Chat with Affaf directly on WhatsApp 💬<br><br>
      <a class="cta-btn" href="https://wa.me/923042365964" target="_blank">
        💬 Open WhatsApp Chat
      </a>`,
    },

    // ── THANKS ──
    {
      id: "thanks",
      keys: ["thank","thanks","thank you","thx","thnx","great","awesome","helpful","nice","good"],
      answer: () => {
        const name = userName ? `, ${userName}` : "";
        return `You're very welcome${name}! 😊 We're here anytime you need help. Don't hesitate to reach out!`;
      },
      chips: [
        { label: "🛒 Order Now" },
        { label: "📞 Contact Us" },
      ]
    },

    // ── GOODBYE ──
    {
      id: "bye",
      keys: ["bye","goodbye","see you","later","cya","ok thanks","ok thank","done","no thanks"],
      answer: () => {
        const name = userName ? `, ${userName}` : "";
        return `Goodbye${name}! 👋 Looking forward to working with you at <strong>NextGen Analytics</strong>. Have a great day!`;
      }
    },
  ];

  // ── Fuzzy score: how well does msg match a keyword list ──────
  const intentScore = (msg, keys) => {
    let best = 0;
    for (const k of keys) {
      if (msg.includes(k)) { best = Math.max(best, k.length); }
    }
    return best;
  };

  // ── Route message to best intent ────────────────────────────
  const matchIntent = (msg) => {
    const lower = msg.toLowerCase().trim();
    let topScore = 0, topIntent = null;
    for (const intent of intents) {
      const score = intentScore(lower, intent.keys);
      if (score > topScore) { topScore = score; topIntent = intent; }
    }
    return topScore > 0 ? topIntent : null;
  };

  // ── Process answer (string or function) ─────────────────────
  const resolveAnswer = (intent) =>
    typeof intent.answer === "function" ? intent.answer() : intent.answer;

  // ── Fallback with suggestions ────────────────────────────────
  const fallbackResponse = (msg) => {
    appendMsg(
      `I'm not sure I caught that 🤔 Here are some things I can help you with:`,
      "bot"
    );
    showChips([
      { label: "📊 Services" },
      { label: "💰 Pricing" },
      { label: "📁 Demos" },
      { label: "📞 Contact" },
      { label: "🛒 Order Now" },
    ]);
  };

  // ── Lead capture flow ────────────────────────────────────────
  const checkLeadCapture = () => {
    // After 3 messages, if no name yet, ask
    if (messageCount === 3 && !userName) {
      setTimeout(async () => {
        await showTyping(700);
        appendMsg(`By the way, may I know your name so I can assist you better? 😊`, "bot");
        awaitingName = true;
      }, 1200);
    }
    // After name collected, offer WhatsApp if no email yet
    if (messageCount === 6 && userName && !leadEmail) {
      setTimeout(async () => {
        await showTyping(700);
        appendMsg(
          `${userName}, would you like to <strong>book a free consultation</strong> with Affaf? 🎁<br><br>
          ${calendlyCard()}<br>
          Or <a href="https://wa.me/923042365964" target="_blank">💬 message on WhatsApp</a> instead.`,
          "bot"
        );
      }, 1200);
    }
  };

  // ── Core message handler ─────────────────────────────────────
  const handleUserMessage = async (msg) => {
    if (!msg.trim()) return;
    appendMsg(msg, "user");
    input.value = "";
    messageCount++;

    // ── Name capture ──
    if (awaitingName) {
      awaitingName = false;
      userName = msg.trim().split(" ")[0];
      await showTyping(600);
      appendMsg(
        `Nice to meet you, <strong>${userName}</strong>! 🙌 How can NextGen Analytics help you today?`,
        "bot"
      );
      showChips([
        { label: "📊 See Services" },
        { label: "💰 Pricing Plans" },
        { label: "📁 View Demos" },
        { label: "🛒 Order Now" },
      ]);
      return;
    }

    // ── Email capture ──
    if (awaitingEmail) {
      awaitingEmail = false;
      leadEmail = msg.trim();
      await showTyping(700);
      appendMsg(
        `Thank you${userName ? ", "+userName : ""}! 📧 We'll be in touch at <strong>${leadEmail}</strong> within 24 hours. You can also reach us on <a href="https://wa.me/923042365964" target="_blank">WhatsApp</a> for a faster response!`,
        "bot"
      );
      return;
    }

    // ── Intent matching ──
    const matched = matchIntent(msg);
    const delay   = matched ? Math.min(400 + resolveAnswer(matched).length * 0.6, 1800) : 900;

    await showTyping(delay);

    if (matched) {
      lastIntent = matched.id;
      appendMsg(resolveAnswer(matched), "bot");
      if (matched.chips) showChips(matched.chips);
    } else {
      fallbackResponse(msg);
    }

    checkLeadCapture();
  };

  // ── Initial welcome (on first open) ─────────────────────────
  const sendWelcome = async () => {
    if (opened) return;
    opened = true;

    // Clear default bot message
    body.innerHTML = "";

    await showTyping(800);
    appendMsg(
      `${greet()}! 👋 Welcome to <strong>NextGen Analytics</strong>.<br>
      I'm Affaf's AI Assistant — ask me anything about dashboards, pricing, or demos!`,
      "bot"
    );
    showChips([
      { label: "📊 View Services" },
      { label: "💰 Pricing Plans" },
      { label: "📁 Live Demos" },
      { label: "📅 Book a Meeting" },
      { label: "🛒 Order Now" },
      { label: "📞 Contact Affaf" },
    ]);
  };

  // ── Toggle open/close ────────────────────────────────────────
  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isVisible = chatWindow.classList.toggle("chatbot-visible");
    toggleBtn.classList.toggle("pulse", isVisible);
    if (isVisible) sendWelcome();
  });

  closeBtn.addEventListener("click", () => {
    chatWindow.classList.remove("chatbot-visible");
    toggleBtn.classList.remove("pulse");
  });

  document.addEventListener("click", (e) => {
    if (!chatWindow.contains(e.target) && !toggleBtn.contains(e.target)) {
      chatWindow.classList.remove("chatbot-visible");
      toggleBtn.classList.remove("pulse");
    }
  });

  // ── Send button & Enter key ──────────────────────────────────
  sendBtn.addEventListener("click", () => handleUserMessage(input.value.trim()));
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleUserMessage(input.value.trim());
  });

  // ── Inject required CSS ──────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    /* ── Typing indicator dots ── */
    .typing-indicator {
      display: flex !important;
      align-items: center;
      gap: 4px;
      padding: 10px 14px !important;
    }
    .typing-indicator span {
      width: 7px; height: 7px;
      background: rgba(255,255,255,0.5);
      border-radius: 50%;
      display: inline-block;
      animation: bounce 1.2s infinite ease-in-out;
    }
    .typing-indicator span:nth-child(2) { animation-delay: .2s; }
    .typing-indicator span:nth-child(3) { animation-delay: .4s; }
    @keyframes bounce {
      0%,80%,100% { transform: translateY(0); }
      40%         { transform: translateY(-6px); }
    }

    /* ── Quick-reply chips ── */
    .chip-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 6px 12px 10px;
    }
    .chip-btn {
      background: rgba(75,95,255,0.15);
      color: #a0aaff;
      border: 1px solid rgba(75,95,255,0.4);
      border-radius: 20px;
      padding: 5px 13px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .chip-btn:hover {
      background: rgba(75,95,255,0.35);
      color: #fff;
      border-color: #6c5fff;
    }

    /* ── Rich card styles ── */
    .demo-card {
      background: rgba(75,95,255,0.1);
      border: 1px solid rgba(75,95,255,0.35);
      border-radius: 10px;
      padding: 10px 14px;
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
    }
    .demo-card-title { font-size: 13px; color: #ccc; }
    .demo-card-link {
      background: linear-gradient(90deg, #4b5fff, #6c5fff);
      color: #fff !important;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 12px;
      text-decoration: none;
      transition: opacity 0.2s;
    }
    .demo-card-link:hover { opacity: 0.85; }

    .pricing-row {
      display: flex;
      gap: 8px;
      margin-top: 10px;
      flex-wrap: wrap;
    }
    .p-card {
      flex: 1;
      min-width: 80px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      padding: 8px;
      font-size: 12px;
      text-align: center;
      color: #ccc;
    }
    .p-card strong { color: #fff; font-size: 13px; }
    .p-card.featured {
      border-color: rgba(75,95,255,0.6);
      background: rgba(75,95,255,0.15);
    }
    .p-card small { color: #aaa; line-height: 1.5; display: block; margin-top: 4px; }

    .contact-card {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      padding: 10px 14px;
      margin-top: 8px;
      font-size: 13px;
      line-height: 2;
    }
    .contact-card a { color: #a0aaff; text-decoration: none; }
    .contact-card a:hover { color: #fff; text-decoration: underline; }

    .cta-btn {
      display: inline-block;
      background: linear-gradient(90deg, #4b5fff, #6c5fff);
      color: #fff !important;
      padding: 9px 20px;
      border-radius: 8px;
      font-size: 13px;
      text-decoration: none;
      margin-top: 6px;
      transition: opacity 0.2s;
    }
    .cta-btn:hover { opacity: 0.85; }

    /* ── Calendly card ── */
    .calendly-card {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(108,95,255,0.12);
      border: 1px solid rgba(108,95,255,0.45);
      border-radius: 12px;
      padding: 12px 14px;
      margin-top: 10px;
      flex-wrap: wrap;
    }
    .calendly-card-icon { font-size: 22px; flex-shrink: 0; }
    .calendly-card-body {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
      min-width: 120px;
    }
    .calendly-card-body strong { font-size: 13px; color: #fff; }
    .calendly-card-body span  { font-size: 11px; color: #aaa; }
    .calendly-card-btn {
      background: linear-gradient(135deg, #6c5fff, #4b5fff);
      color: #fff !important;
      padding: 7px 16px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 500;
      text-decoration: none;
      white-space: nowrap;
      transition: opacity 0.2s;
      flex-shrink: 0;
    }
    .calendly-card-btn:hover { opacity: 0.85; }
    .cta-calendly {
      background: linear-gradient(135deg, #6c5fff, #4b5fff) !important;
    }

    /* ── Bot/User msg link style ── */
    .bot-msg a { color: #a0aaff; }
    .bot-msg a:hover { color: #fff; }
  `;
  document.head.appendChild(style);

}); // end DOMContentLoaded
