class HikeCards extends HTMLElement {
    static get observedAttributes() {
        return ["items", "columns", "card-height"];
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._items = [];
        this._columns = 3;
        this._cardHeight = 420;
    }

    connectedCallback() {
        this._render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this._readAttrs();
            this._render();
        }
    }

    set data(itemsArray) {
        this._items = Array.isArray(itemsArray) ? itemsArray : [];
        this._render();
    }

    _readAttrs() {
        const raw = this.getAttribute("items");
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                this._items = Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                console.warn("HikeCards: Invalid JSON in 'items'", e);
            }
        }
    }

    _render() {
        // We use backticks (`) to put the CSS inside a Javascript string
        this.shadowRoot.innerHTML = `
        <style>
            :host { 
                display: block; 
                width: 100%; 
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                --gap: 24px;
                --card-radius: 20px;
                --pill-radius: 50px;
                --pill-bg: rgba(255, 255, 255, 0.85);
                --shadow: 0 10px 30px rgba(0,0,0,0.12);
            }
            * { box-sizing: border-box; }
            
            .wrap {
                display: flex;
                flex-wrap: wrap;
                gap: var(--gap);
                justify-content: center;
                padding: 10px;
            }

            .card {
                position: relative;
                width: 320px;
                height: ${this._cardHeight}px;
                border-radius: var(--card-radius);
                overflow: hidden;
                box-shadow: var(--shadow);
                background: #f4f4f4;
                cursor: pointer;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }

            .card:hover {
                transform: translateY(-5px);
                box-shadow: 0 16px 40px rgba(0,0,0,0.2);
            }

            .bg {
                width: 100%;
                height: 100%;
                background-size: cover;
                background-position: center;
                transition: transform 0.5s ease;
            }
            .card:hover .bg { transform: scale(1.05); }

            .titlePill {
                position: absolute;
                top: 16px; left: 16px; right: 16px;
                background: rgba(0, 0, 0, 0.6);
                color: #fff;
                padding: 12px 20px;
                border-radius: var(--pill-radius);
                font-weight: 600;
                font-size: 18px;
                text-align: center;
                backdrop-filter: blur(4px);
            }

            .statsPill {
                position: absolute;
                bottom: 16px; left: 16px; right: 16px;
                background: var(--pill-bg);
                border-radius: var(--pill-radius);
                display: flex;
                justify-content: space-between;
                padding: 12px 20px;
                font-size: 14px;
                font-weight: 500;
                color: #333;
                backdrop-filter: blur(4px);
            }
        </style>
        <div class="wrap" id="wrap"></div>
        `;

        const wrap = this.shadowRoot.getElementById("wrap");
        const items = (this._items || []).slice(0, 50);

        items.forEach((it) => {
            const card = document.createElement("div");
            card.className = "card";
            
            // Handle Click
            card.onclick = () => {
                this.dispatchEvent(new CustomEvent('cardClick', { 
                    detail: { url: it.url || '' },
                    bubbles: true,
                    composed: true
                }));
            };

            const bg = document.createElement("div");
            bg.className = "bg";
            bg.style.backgroundImage = it.image ? `url("${it.image}")` : `background: #ccc`;

            const title = document.createElement("div");
            title.className = "titlePill";
            title.textContent = it.title || "Untitled";

            const stats = document.createElement("div");
            stats.className = "statsPill";
            stats.innerHTML = `
                <span>${it.difficulty || '-'}</span>
                <span>${it.distance || '-'}</span>
                <span>${it.duration || '-'}</span>
            `;

            card.appendChild(bg);
            card.appendChild(title);
            card.appendChild(stats);
            wrap.appendChild(card);
        });
    }
}

customElements.define("hike-cards", HikeCards);
