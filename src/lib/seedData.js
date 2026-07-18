import { uid, isoDate } from "./helpers";

// Starter data shown the first time someone opens the app

const seedSubjects = [
  { id: "s1", name: "Mathematics", palette: 0 },
  { id: "s2", name: "English", palette: 1 },
  { id: "s3", name: "Science", palette: 2 },
];

function seedTasks() {
  const today = new Date();
  const t = (offset) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    return isoDate(d);
  };
  return [
    { id: uid(), subjectId: "s1", title: "Chapter 8 review", date: t(0), time: "10:00", done: false },
    { id: uid(), subjectId: "s1", title: "Practice problem set", date: t(0), time: "16:00", done: true },
    { id: uid(), subjectId: "s2", title: "Essay draft", date: t(0), time: "13:30", done: false },
    { id: uid(), subjectId: "s2", title: "Read Ch. 4", date: t(1), time: "09:00", done: false },
    { id: uid(), subjectId: "s3", title: "Lab report", date: t(-1), time: "11:00", done: true },
    { id: uid(), subjectId: "s3", title: "Study cells unit", date: t(2), time: "15:00", done: false },
    { id: uid(), subjectId: "s1", title: "Quiz prep", date: t(3), time: "10:00", done: false },
  ];
}

function seedNotes() {
  return [
    {
      id: uid(),
      title: "Group project ideas",
      body: "Bring the grading rubric to Thursday's meeting and confirm room booking.",
      createdAt: isoDate(new Date()),
    },
  ];
}

function seedReminders() {
  const d = new Date();
  d.setHours(d.getHours() + 3, 0, 0, 0);
  return [
    { id: uid(), title: "Return library books", datetime: d.toISOString().slice(0, 16), done: false },
  ];
}

export { seedSubjects, seedTasks, seedNotes, seedReminders };
