"use strict";

// Minimal 2D vector helpers (operating on plain {x, y} objects to avoid allocations).
const Vec2 = {
    create: (x = 0, y = 0) => ({ x, y }),
    set: (v, x, y) => { v.x = x; v.y = y; return v; },
    add: (out, a, b) => { out.x = a.x + b.x; out.y = a.y + b.y; return out; },
    scale: (out, a, s) => { out.x = a.x * s; out.y = a.y * s; return out; },
    length: (v) => Math.sqrt(v.x * v.x + v.y * v.y)
};

// Read a numeric control by id. Returns null when the element is missing.
function num(id) {
    const el = document.getElementById(id);
    if (!el) return null;
    return parseFloat(el.value);
}

// Read a control as a number, or fall back to a default when missing/empty.
function numOr(id, fallback) {
    const v = num(id);
    return (v === null || isNaN(v)) ? fallback : v;
}

// Base class for canvas simulations. Subclasses implement step(dt) and render(ctx).
class Simulation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;

        this.running = false;
        this.time = 0;          // simulated time in seconds
        this.stepTime = 0;       // ms spent in last step()
        this._lastFrame = 0;
        this._frameId = null;

        // fixed time step (s); overridden by examples via the timeStep control
        this.dt = 0.016;
    }

    start() {
        if (this.running) return;
        this.running = true;
        this._lastFrame = performance.now();
        this._frameId = requestAnimationFrame(this._tick);
    }

    stop() {
        this.running = false;
        if (this._frameId !== null) {
            cancelAnimationFrame(this._frameId);
            this._frameId = null;
        }
    }

    reset() {
        this.time = 0;
        this.init();
        this.render(this.ctx);
    }

    // One simulation step using the current this.dt. Override in subclass.
    step(dt) { }

    // Draw the current state. Override in subclass.
    render(ctx) { }

    // Called on reset() and once at construction. Override in subclass.
    init() { }

    _tick = (now) => {
        if (!this.running) return;
        const realDt = (now - this._lastFrame) / 1000;
        this._lastFrame = now;

        const t0 = performance.now();
        // Fixed time step per frame for deterministic, stable integration.
        const h = this.dt;
        this.step(h);
        this.time += h;
        this.stepTime = performance.now() - t0;

        this.render(this.ctx);
        this._updateStats();

        this._frameId = requestAnimationFrame(this._tick);
    };

    // Hook to refresh the stats table. Examples override if they expose one.
    _updateStats() { }
}
