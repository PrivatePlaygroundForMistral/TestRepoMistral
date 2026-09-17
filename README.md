# Physically-Based Animation Examples

A collection of minimal, self-contained HTML+JS demos of physically-based
animation (PBA) algorithms. Each example renders an algorithm on a
`<canvas>` and is structured similarly to the
[learn.physics-simulation.org](https://learn.physics-simulation.org) examples:
a canvas, a small controls table, and an explanation, all in one file.

There is **no build step** and **no dependencies**. Open `index.html` in a
browser, or any example directly.

## Structure

```
.
├── index.html              # landing page listing all examples
├── css/
│   └── style.css            # shared styling (layout + controls table)
├── js/
│   └── sim.js               # shared framework: Vec2 helpers, Simulation base class
└── examples/
    └── particle_system.html # explicit-Euler particle system with a generator + lifespan
```

## Shared framework (`js/sim.js`)

- `Vec2` — tiny 2D vector helpers operating on plain `{x, y}` objects.
- `num(id)` / `numOr(id, fallback)` — read numeric values from control inputs.
- `Simulation` — base class that owns the canvas, a fixed-timestep
  `requestAnimationFrame` loop, start/stop/reset, and a `time`/`stepTime`
  counter. Subclasses override:
  - `init()`        — (re)initialize state (called by `reset()` and at construction)
  - `step(dt)`      — advance the simulation by one fixed step `dt`
  - `render(ctx)`   — draw the current state
  - `_updateStats()`— refresh the read-only stat inputs in the controls table

## Example: Particle System (Explicit Euler)

`examples/particle_system.html` implements:

1. A **particle generator** at the bottom-center of the canvas that spawns
   particles upward with a random angular spread, at a configurable emission
   rate (particles/s). A fractional accumulator keeps the spawn count correct
   even at low frame rates.
2. **Explicit (forward) Euler** integration of the equation of motion under
   gravity for every particle:

   ```
   x(t + dt) = x(t) + dt * v(t)      // position uses the OLD velocity
   v(t + dt) = v(t) + dt * a(t)
   ```

3. A finite **life span** per particle. Each step decrements the remaining
   life; when it reaches zero (or the particle falls off-screen) it is removed
   from the simulation. Particles also fade and shrink as they age.

Controls: time step size, gravity, emission rate, life span, initial speed,
plus Reset / Pause. Live stats show current time, time per sim. step, and the
current particle count.

## Adding a new example

1. Copy `examples/particle_system.html` to `examples/<your_example>.html`.
2. Keep the `<link>`/`<script>` to `../css/style.css` and `../js/sim.js`.
3. Subclass `Simulation` and implement `init()`, `step(dt)`, `render(ctx)`,
   and (if you show stats) `_updateStats()`.
4. Add a link to it in `index.html`.
