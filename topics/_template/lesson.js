// Topic N — Title. See shared/lesson.js for every block type.
Lesson.mount(document.getElementById("lesson"), {
  id: "NN-slug",
  eyebrow: "Topic N · Part X",
  title: "Topic Title",
  intro: "One-line hook. N short stops, about M minutes.",
  goals: ["Learning goal mapped from the WAEC syllabus notes"],
  stops: [
    {
      title: "First stop",
      blocks: [
        "A short paragraph.",
        { sim: Sims.example, caption: "What to try." },
        { key: "The key idea in one or two sentences." },
        { mcq: "Question?", options: ["A", "B"], answer: 0, explain: "Why." },
      ],
    },
  ],
});
