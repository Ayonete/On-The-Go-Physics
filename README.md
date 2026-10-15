# On-The-Go Physics

Lesson notes plus an interactive experience (game or simulation) for each topic in the
WAEC SSCE Physics syllabus, built for secondary-school students in Nigeria.

## Principles

- **Syllabus-first.** Every lesson's learning goals come from the WAEC syllabus notes for that topic.
- **Clean and minimal UI** by default. Shared tokens live in `shared/styles.css`.
- **Light and fast.** Plain HTML/CSS/JS with no build step, so pages load quickly on low-end phones
  and slow networks and can be hosted anywhere (GitHub Pages works).

## Structure

```
index.html              Topic hub (reads shared/topics.js)
shared/
  styles.css            Design tokens + base components
  topics.js             The 31 syllabus topics and their status
topics/
  _template/            Copy this to start a new topic
  NN-slug/
    index.html          Lesson notes + learning goals + experience + self-check
    experience.js       The game/simulation
docs/syllabus.md        Topic → syllabus scope reference
```

## Adding a topic

1. Copy `topics/_template` to `topics/NN-slug` (slug as in `shared/topics.js`).
2. Write the notes and goals, then build the experience.
3. Set the topic's `status` to `"live"` in `shared/topics.js`.

## Run locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000.
