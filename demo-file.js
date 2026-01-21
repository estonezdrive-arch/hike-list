class DemoBox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = 
      <style>
        :host { display:block; }
        .box{
          border: 3px solid #111;
          padding: 20px;
          border-radius: 16px;
          font-family: system-ui;
          font-size: 18px;
          background: #fff;
        }
        .small{ font-size: 13px; opacity: .7; margin-top: 10px; }
      </style>

      <div class="box">
        ✅ Custom Element loaded from GitHub!
        <div class="small" id="time"></div>
      </div>
    ;
  }

  connectedCallback() {
    const el = this.shadowRoot.getElementById("time");
    if (el) el.textContent = "Loaded at: " + new Date().toLocaleString();
  }
}

customElements.define("demo-box", DemoBox);
