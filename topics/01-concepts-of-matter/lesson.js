// Topic 1 — Concepts of Matter (WAEC SSCE Physics, Part I).
const QUIZ = [
  {
    q: "Which of the following provides evidence that matter is made up of particles in constant random motion?",
    options: ["Capillarity", "Brownian motion", "Expansion of solids", "Surface tension"],
    answer: 1,
    explain: "The random zig-zag movement of smoke or pollen particles shows they are being hit by invisible, moving molecules.",
  },
  {
    q: "In a smoke cell experiment, the smoke particles move about randomly because they are",
    options: ["attracting one another", "heated by the lamp", "hit unevenly by moving air molecules", "electrically charged"],
    answer: 2,
    explain: "Air molecules strike each smoke particle from all sides, but not evenly, so it is pushed first one way, then another.",
  },
  {
    q: "Which statement about the particles of a solid is correct?",
    options: ["They are far apart and move freely", "They vibrate about fixed positions", "There are no forces between them", "They slide past one another"],
    answer: 1,
    explain: "Strong forces hold solid particles in place; they can only vibrate about fixed positions.",
  },
  {
    q: "Which of the following is NOT true of evaporation?",
    options: ["It occurs at all temperatures", "It takes place at the surface of the liquid", "It produces cooling", "It occurs at a fixed temperature"],
    answer: 3,
    explain: "Boiling occurs at a fixed temperature (the boiling point). Evaporation happens at any temperature.",
  },
  {
    q: "The pressure exerted by a gas in a container is due to",
    options: ["the weight of the gas", "collisions of gas molecules with the walls", "attraction between gas molecules", "the gas molecules expanding"],
    answer: 1,
    explain: "Each molecule that hits a wall pushes on it. Pressure is the total force of these collisions per unit area.",
  },
  {
    q: "Water rises in a narrow glass tube because",
    options: ["cohesion between water molecules is greater than adhesion to glass", "adhesion between water and glass is greater than cohesion of water", "water is lighter than glass", "air pressure inside the tube is greater"],
    answer: 1,
    explain: "Water sticks to glass more strongly than to itself, so it creeps up the walls and forms a concave meniscus.",
  },
  {
    q: "Which of the following is an amorphous solid?",
    options: ["Sodium chloride", "Copper", "Glass", "Diamond"],
    answer: 2,
    explain: "Glass has no regular, repeating arrangement of particles. The others are crystalline.",
  },
  {
    q: "In a face-centred cubic arrangement, atoms are found",
    options: ["only at the corners of the cube", "at the corners and at the centre of the cube", "at the corners and at the centre of each face", "only at the centre of each face"],
    answer: 2,
    explain: "FCC = corners + face centres. Corners + one atom at the centre is body-centred (BCC).",
  },
  {
    q: "Wet clothes on a line will dry fastest on a day that is",
    options: ["hot, humid and still", "hot, dry and windy", "cold, dry and still", "cold, humid and windy"],
    answer: 1,
    explain: "High temperature, low humidity and a draught all speed up evaporation.",
  },
  {
    q: "Mercury forms a convex meniscus in a glass tube because",
    options: ["its adhesion to glass is greater than its cohesion", "its cohesion is greater than its adhesion to glass", "it is a metal", "it is denser than water"],
    answer: 1,
    explain: "Mercury atoms attract each other more strongly than they attract glass, so the surface bulges upward and the level is depressed.",
  },
];

Lesson.mount(document.getElementById("lesson"), {
  id: "01-concepts-of-matter",
  eyebrow: "Topic 1 · Part 1 · Matter, Space & Time",
  title: "Concepts of Matter",
  intro: "What is everything made of, and how do we know? 11 short stops, about 25 minutes.",
  goals: [
    "Describe the particle structure of matter: atoms, molecules and ions.",
    "Describe solids, liquids and gases by particle arrangement, motion and forces.",
    "Explain how Brownian motion and diffusion are evidence for the particle nature of matter.",
    "State the kinetic theory and use it to explain states of matter, gas pressure, evaporation and boiling.",
    "Explain cohesion, adhesion and capillarity.",
    "Compare crystalline and amorphous solids; describe face-centred and body-centred arrangements.",
  ],
  quizSize: QUIZ.length,
  next: "The interactive experience for this topic is coming next.",
  stops: [
    {
      title: "Zoom into a drop",
      blocks: [
        "Everything around you, from your desk and the air to the water in a sachet, is <b>matter</b>. But what is it actually made of? Let's zoom in.",
        { sim: Sims.zoom, caption: "Tap <b>Zoom in</b> until you can't go any further." },
        { key: "<b>Matter</b> is anything that has mass and occupies space. All matter is made of tiny particles that are always moving." },
        {
          mcq: "Which of these is NOT matter?",
          options: ["The air inside a balloon", "Light from a torch", "Water in a sachet", "Smoke from a fire"],
          answer: 1,
          explain: "Light has no mass and takes up no space. It is a form of energy, not matter.",
          hint: "Ask: does it have mass, and does it take up space?",
        },
      ],
    },
    {
      title: "Meet the particles",
      blocks: [
        "The tiny particles of matter come in three kinds.",
        {
          reveal: [
            ["Atom", "The smallest particle of an element that can take part in a chemical reaction. e.g. a carbon atom, C."],
            ["Molecule", "The smallest particle of a substance that can exist on its own and still have that substance's properties. e.g. water, H₂O; oxygen, O₂."],
            ["Ion", "An atom (or group of atoms) that has gained or lost electrons, so it carries a charge. e.g. Na⁺ and Cl⁻ in common salt."],
          ],
        },
        {
          mcq: "One molecule of water is made of…",
          options: ["one hydrogen atom and two oxygen atoms", "two hydrogen atoms and one oxygen atom", "three oxygen atoms", "two ions"],
          answer: 1,
          explain: "H₂O: two hydrogen (H) atoms and one oxygen (O) atom. You saw it at the end of the zoom.",
        },
      ],
    },
    {
      title: "Three states of matter",
      blocks: [
        "The <i>same</i> particles can behave in three different ways. Switch between the states and watch closely.",
        { sim: Sims.states, caption: "Try all three states." },
        {
          sort: {
            buckets: ["Solid", "Liquid", "Gas"],
            items: [
              ["Fixed shape", 0],
              ["Particles vibrate about fixed positions", 0],
              ["Strongest forces between particles", 0],
              ["Takes the container's shape but keeps its volume", 1],
              ["Particles slide past each other", 1],
              ["Fills its whole container", 2],
              ["Easily compressed", 2],
              ["Particles far apart, moving fast", 2],
            ],
          },
        },
        "Examples you already know: a stone (solid), groundnut oil (liquid), cooking gas (gas).",
      ],
    },
    {
      title: "Evidence 1: Brownian motion",
      blocks: [
        "We can't see particles directly, so how do we <i>know</i> they exist and are moving?",
        "In 1827 the botanist <b>Robert Brown</b> looked at pollen grains in water under a microscope. They jiggled about non-stop, as if alive.",
        "In the lab we use a <b>smoke cell</b>: a small glass cell filled with smoke, lit from the side and viewed through a microscope. The smoke particles show up as tiny bright specks.",
        {
          mcq: "What will the smoke specks do?",
          predict: true,
          options: ["Stay perfectly still", "Slowly sink to the bottom", "Move in a random, zig-zag way", "Move in neat circles"],
          explain: "Prediction locked in. Look through the microscope and see.",
        },
        { sim: Sims.brownian, caption: "Watch the bright speck. Then switch on <b>Show air molecules</b> to see what's really going on." },
        { key: "<b>Brownian motion</b> is the random, zig-zag movement of tiny particles (like smoke or pollen) in a fluid. They are hit <i>unevenly</i> by the invisible, fast-moving molecules around them. This is evidence that matter is made of particles in constant random motion." },
        {
          mcq: "If the smoke cell is warmed, the specks will move…",
          options: ["more vigorously", "more slowly", "not at all", "in straight lines"],
          answer: 0,
          explain: "Warmer air molecules move faster, so they hit the specks harder and more often. Try Hot in the simulation.",
        },
      ],
    },
    {
      title: "Evidence 2: Diffusion",
      blocks: [
        "Fresh bread comes out of the oven at the bakery down the street, and soon you can smell it from the road. How did the smell reach you?",
        "Smells are carried by particles that spread out <i>by themselves</i>. Two gases are separated below.",
        {
          mcq: "When the partition is lifted, will the gases mix faster when hot or cold?",
          predict: true,
          options: ["Faster when hot", "Faster when cold", "No difference"],
          explain: "Test it: lift the partition, note the time, then Reset and try another temperature.",
        },
        { sim: Sims.diffusion, caption: "Lift the partition. Then <b>Reset</b> and compare Cold and Hot." },
        { key: "<b>Diffusion</b> is the spreading of particles from where they are crowded (high concentration) to where they are fewer (low concentration), because of their random motion. It is faster in gases than in liquids, and faster at higher temperatures." },
        "Lab examples: a crystal of potassium permanganate slowly turning still water purple; brown bromine vapour spreading up a gas jar.",
        {
          mcq: "Diffusion is slowest in…",
          options: ["a gas", "a liquid", "a solid", "it is the same in all"],
          answer: 2,
          explain: "Solid particles only vibrate in place, so they hardly spread at all. Liquids are slower than gases.",
        },
      ],
    },
    {
      title: "The kinetic theory",
      blocks: [
        "Brownian motion and diffusion point to one big idea: the <b>kinetic theory of matter</b>. (“Kinetic” means “to do with motion.”)",
        {
          reveal: [
            ["1 · Tiny particles", "All matter is made up of tiny particles: atoms, molecules or ions."],
            ["2 · Always moving", "The particles are in constant, random motion."],
            ["3 · Forces between them", "Particles attract one another. The attraction is strongest when they are close (solids) and weakest when far apart (gases)."],
            ["4 · Hotter = faster", "The higher the temperature, the faster the particles move. Temperature measures the <b>average kinetic energy</b> of the particles."],
            ["5 · Collisions", "Gas particles collide with each other and with the walls of their container without losing energy overall."],
          ],
          prompt: "Tap each statement of the theory.",
        },
        {
          table: {
            head: ["State", "Spacing", "Motion", "Forces"],
            rows: [
              ["Solid", "Very close, regular pattern", "Vibrate about fixed positions", "Very strong"],
              ["Liquid", "Close, irregular", "Slide past one another", "Weaker"],
              ["Gas", "Far apart", "Fast, random, in all directions", "Almost none"],
            ],
          },
        },
        {
          mcq: "According to the kinetic theory, when a liquid is heated its particles…",
          options: ["get bigger", "move faster", "stop attracting each other", "turn into atoms"],
          answer: 1,
          explain: "Heating gives the particles more kinetic energy, so they move faster. The particles themselves do not get bigger. That's a common mistake.",
        },
      ],
    },
    {
      title: "Gas pressure",
      blocks: [
        "Pump air into a bicycle tyre and it becomes firm. What is the air actually doing inside?",
        { sim: Sims.pressure, caption: "Squeeze the gas with the <b>Volume</b> slider, then change the temperature. Watch the pressure gauge." },
        { key: "Gas particles keep hitting the walls of their container, and each hit pushes on the wall. <b>Gas pressure</b> is the total force of these collisions on each unit area of the wall." },
        {
          mcq: "Why does pushing in the piston increase the pressure?",
          options: ["The particles get bigger", "The particles hit the walls more often", "The particles move faster", "More particles are created"],
          answer: 1,
          explain: "The same particles have less space, so they reach the walls more often. Their speed doesn't change, because the temperature hasn't changed.",
        },
        {
          mcq: "A car is parked in the hot afternoon sun. The pressure in its tyres…",
          options: ["increases", "decreases", "stays the same"],
          answer: 0,
          explain: "Hotter particles move faster, so they hit the walls harder and more often. That's why tyres can burst in great heat.",
        },
      ],
    },
    {
      title: "Evaporation and boiling",
      blocks: [
        "Why does water kept in a clay pot stay cool, even on a hot afternoon? Let's watch water molecules in a dish.",
        { sim: Sims.evaporation, caption: "Fast molecules are shown in <b>orange</b>. Watch them break free at the surface, and keep an eye on the thermometer. Then try Sun and Wind." },
        { key: "<b>Evaporation:</b> the fastest molecules at the surface of a liquid escape into the air. The slower ones are left behind, so the average kinetic energy falls. <b>Evaporation causes cooling.</b>" },
        "That's the clay-pot secret: water seeps through tiny pores, evaporates from the outside of the pot, and cools the water inside. Sweating cools your body the same way.",
        {
          mcq: "Which day will dry wet clothes on a line fastest?",
          options: ["Hot, dry and windy", "Hot, humid and still", "Cool, humid and windy", "Cool, dry and still"],
          answer: 0,
          explain: "Evaporation is faster when the temperature is high, the air is dry (low humidity), there is a draught to carry vapour away, and the surface area is large.",
        },
        "<b>Boiling</b> is different. When a liquid is heated to its <b>boiling point</b>, bubbles of vapour form <i>throughout</i> the liquid and rise to the surface.",
        {
          sort: {
            buckets: ["Evaporation", "Boiling"],
            items: [
              ["Happens at any temperature", 0],
              ["Only at the surface", 0],
              ["Causes cooling", 0],
              ["Faster with wind and dry air", 0],
              ["Happens at a fixed temperature", 1],
              ["Bubbles form throughout the liquid", 1],
              ["Temperature stays constant while it happens", 1],
              ["Boiling point changes with the pressure above the liquid", 1],
            ],
          },
        },
      ],
    },
    {
      title: "Cohesion, adhesion & capillarity",
      blocks: [
        "Particles don't only attract their own kind.",
        {
          reveal: [
            ["Cohesion", "Attraction between particles of the <b>same</b> substance. e.g. water molecules holding together in a raindrop."],
            ["Adhesion", "Attraction between particles of <b>different</b> substances. e.g. water sticking to glass, which is why a drinking glass stays wet."],
          ],
        },
        { sim: Sims.capillary, caption: "Three glass tubes stand in a liquid. Switch between <b>Water</b> and <b>Mercury</b> and compare the tubes." },
        { key: "<b>Capillarity</b> is the rise or fall of a liquid in a narrow tube. Water <b>rises</b> because its adhesion to glass is greater than its cohesion; its surface curves up at the walls (<b>concave meniscus</b>). Mercury <b>falls</b> because its cohesion is greater than its adhesion to glass (<b>convex meniscus</b>). The narrower the tube, the bigger the rise or fall." },
        {
          mcq: "Which of these does NOT depend on capillarity?",
          options: ["Kerosene rising up the wick of a lantern", "Ink soaking into blotting paper", "Water rising through soil to plant roots", "A helium balloon rising in the air"],
          answer: 3,
          explain: "A balloon rises because of upthrust from the air (Archimedes' principle, which you'll meet in Topic 6). The others are all capillary action.",
        },
      ],
    },
    {
      title: "Crystalline & amorphous solids",
      blocks: [
        "Look closely at grains of salt or sugar and you'll see tiny cubes with flat faces. That's because their particles are packed in a regular, repeating pattern.",
        { sim: Sims.crystal, caption: "Drag to rotate. Compare <b>Body-centred</b> and <b>Face-centred</b>." },
        { key: "<b>Crystalline</b> solids have particles arranged in a regular, repeating 3-D pattern (a lattice). They have regular shapes, flat faces and a sharp melting point. <b>Amorphous</b> solids have no regular pattern; they soften gradually over a range of temperatures." },
        {
          sort: {
            buckets: ["Crystalline", "Amorphous"],
            items: [
              ["Common salt", 0], ["Copper", 0], ["Sugar", 0], ["Diamond", 0],
              ["Glass", 1], ["Rubber", 1], ["Candle wax", 1], ["Plastic", 1],
            ],
          },
        },
      ],
    },
    {
      title: "Check yourself",
      blocks: [
        "Ten WAEC-style questions. One attempt each, so take your time.",
        { quiz: QUIZ },
      ],
    },
  ],
});
