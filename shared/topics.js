// Single source of truth for the topic list (WAEC SSCE Physics syllabus).
// status: "planned" | "building" | "live"
window.TOPICS = [
  // Part I — Interaction of matter, space & time
  { n: 1,  part: 1, slug: "concepts-of-matter",          title: "Concepts of Matter",                          status: "planned" },
  { n: 2,  part: 1, slug: "fundamental-derived-quantities", title: "Fundamental & Derived Quantities",         status: "planned" },
  { n: 3,  part: 1, slug: "position-distance-displacement", title: "Position, Distance & Displacement",        status: "planned" },
  { n: 4,  part: 1, slug: "mass-and-weight",             title: "Mass and Weight",                             status: "planned" },
  { n: 5,  part: 1, slug: "time",                        title: "Time",                                        status: "planned" },
  { n: 6,  part: 1, slug: "fluids-at-rest",              title: "Fluids at Rest",                              status: "planned" },
  { n: 7,  part: 1, slug: "motion",                      title: "Motion",                                      status: "planned" },
  { n: 8,  part: 1, slug: "speed-and-velocity",          title: "Speed and Velocity",                          status: "planned" },
  { n: 9,  part: 1, slug: "rectilinear-acceleration",    title: "Rectilinear Acceleration",                    status: "planned" },
  { n: 10, part: 1, slug: "scalars-and-vectors",         title: "Scalars and Vectors",                         status: "planned" },
  { n: 11, part: 1, slug: "equilibrium-of-forces",       title: "Equilibrium of Forces",                       status: "planned" },
  { n: 12, part: 1, slug: "simple-harmonic-motion",      title: "Simple Harmonic Motion",                      status: "planned" },
  { n: 13, part: 1, slug: "newtons-laws",                title: "Newton's Laws of Motion",                     status: "planned" },
  // Part II — Energy: mechanical and heat
  { n: 14, part: 2, slug: "energy",                      title: "Energy",                                      status: "planned" },
  { n: 15, part: 2, slug: "work-energy-power",           title: "Work, Energy and Power",                      status: "planned" },
  { n: 16, part: 2, slug: "heat-energy",                 title: "Heat Energy",                                 status: "planned" },
  // Part III — Waves
  { n: 17, part: 3, slug: "production-of-waves",         title: "Production & Propagation of Waves",           status: "planned" },
  { n: 18, part: 3, slug: "types-of-waves",              title: "Types of Waves",                              status: "planned" },
  { n: 19, part: 3, slug: "properties-of-waves",         title: "Properties of Waves",                         status: "planned" },
  { n: 20, part: 3, slug: "light-waves",                 title: "Light Waves",                                 status: "planned" },
  { n: 21, part: 3, slug: "electromagnetic-waves",       title: "Electromagnetic Waves",                       status: "planned" },
  { n: 22, part: 3, slug: "sound-waves",                 title: "Sound Waves",                                 status: "planned" },
  // Part IV — Fields
  { n: 23, part: 4, slug: "fields",                      title: "Description & Properties of Fields",          status: "planned" },
  { n: 24, part: 4, slug: "gravitational-field",         title: "Gravitational Field",                         status: "planned" },
  { n: 25, part: 4, slug: "electric-field",              title: "Electric Field",                              status: "planned" },
  { n: 26, part: 4, slug: "magnetic-field",              title: "Magnetic Field",                              status: "planned" },
  { n: 27, part: 4, slug: "electromagnetic-field",       title: "Electromagnetic Field",                       status: "planned" },
  { n: 28, part: 4, slug: "simple-ac-circuits",          title: "Simple a.c. Circuits",                        status: "planned" },
  // Part V — Atomic and nuclear physics
  { n: 29, part: 5, slug: "structure-of-the-atom",       title: "Structure of the Atom",                       status: "planned" },
  { n: 30, part: 5, slug: "structure-of-the-nucleus",    title: "Structure of the Nucleus",                    status: "planned" },
  { n: 31, part: 5, slug: "wave-particle-paradox",       title: "Wave–Particle Paradox",                       status: "planned" },
];

window.PARTS = {
  1: "Interaction of Matter, Space & Time",
  2: "Energy: Mechanical and Heat",
  3: "Waves",
  4: "Fields",
  5: "Atomic and Nuclear Physics",
};
