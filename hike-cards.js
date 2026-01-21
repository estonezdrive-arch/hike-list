class HikeCards extends HTMLElement {
  static get observedAttributes() { return ["items"]; }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = 
      <style>
        :host { display:block; font-family: system-ui; }
        .wrap{display:flex;gap:24px}
        .card{width:300px;height:420px;border-radius:28px;overflow:hidden;position:relative}
        .bg{position:absolute;inset:0;background-size:cover;background-position:center}
        .title{
          position:absolute;top:16px;left:16px;right:16px;
          background:rgba(100,100,100,.6);
          color:#fff;border-radius:999px;
          text-align:center;padding:10px;font-size:20px
        }
        .stats{
          position:absolute;bottom:16px;left:16px;right:16px;
          background:rgba(200,200,200,.6);
          border-radius:999px;padding:12px;
          display:flex;justify-content:space-between;font-size:14px
        }
      </style>
      <div id="root"></div>
    ;
  }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { this.render(); }

  render() {
    const root = this.shadowRoot.getElementById("root");
    if (!root) return;

    let data = [];
    const raw = this.getAttribute("items");
    if (raw) {
      try { data = JSON.parse(raw); } catch (e) { data = []; }
    }

    root.innerHTML = 
      <div class="wrap">
        ${data.map(i => 
          <div class="card">
            <div class="bg" style="background-image:url('${i.image || ""}')"></div>
            <div class="title">${i.title || ""}</div>
            <div class="stats">
              <div>${i.difficulty || ""}</div>
              <div>${i.distance || ""}</div>
              <div>${i.duration || ""}</div>
            </div>
          </div>
        ).join("")}
      </div>
    ;
  }
}

customElements.define("hike-cards", HikeCards);
