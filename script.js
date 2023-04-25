// data
const timeline = [
  {
    year: 2022,
    month: 08,
    month_name: "HIML BLOCK",
    title: "OMG! HTML so easy!!!",
  },
  {
    year: 2022,
    month: 09,
    month_name: "CSS BLOCK",
    title: "I wanna be a nail master!",
  },
  {
    year: 2022,
    month: 12,
    month_name: "FIRST PROGECT",
    title: "I can do it! I`m fucking programmer!!!",
  },
  {
    year: 2023,
    month: 01,
    month_name: "JavaScript",
    title: "1+'1'-1=10 it was elementary",
  },
  {
    year: 2023,
    month: 04,
    month_name: "React",
    title: "How could I have been without it before?",
  },
  {
    year: 2023,
    month: 05,
    month_name: "internship",
    title: "After that, I'm not afraid of anything!",
  },
  {
    year: 2023,
    month: 06,
    month_name: "job search",
    title:
      "Where's my offer for $3,000 a week and an office with hot tubs and cookies?",
  },
  {
    year: 2023,
    month: 08,
    month_name: "job search",
    title: "I'm ready to code for cookies...Will you take me?",
  },
  { year: 1996, month: 06, month_name: "June 1996", title: "Super Mario 64" },
  {
    year: 2023,
    month: 07,
    month_name: "My first job in IT",
    title: "I am Junior and i am the happiest person in the world!",
  },
  {
    year: 2023,
    month: 10,
    month_name: "I want more!",
    title: "I want to be seniorrrrrr!!!!",
  },
];

//
const mario = document.getElementById("mario");
const ground = document.getElementById("ground");
const grass = document.getElementById("grass");
const eventsContainer = document.getElementById("events");
let currentIndex = -1;
let currentPipe;
let int1;

// click handler
const pipeHandler = () => {
  clearInterval(int1);
  document.getElementById("info").style.display = "none";

  // clear old
  !currentPipe || currentPipe.classList.remove("active");

  // get index
  const index = parseInt(event.currentTarget.dataset.index);

  // walk
  const xpos = -100 - index * 150 - 25;
  const curXpos = -100 - currentIndex * 150 - 25;
  const distance = curXpos - xpos;
  const duration = Math.abs(distance) * 3;
  // console.log(distance);
  eventsContainer.style.transitionDuration = `${duration}ms`;
  eventsContainer.style.transform = `translateX(${xpos}px)`;
  ground.style.transitionDuration = `${duration}ms`;
  ground.style.backgroundPosition = `${xpos}px 32px`;
  grass.style.transitionDuration = `${duration}ms`;
  grass.style.backgroundPosition = `${xpos}px 0`;

  //
  playSfx("jump");

  // walk style
  const dir = distance < 0 ? "left" : "right";
  mario.classList.remove(
    "idle",
    "walk-left",
    "walk-right",
    "search-left",
    "search-right"
  );
  mario.classList.add(`walk-${dir}`);
  int1 = setTimeout(
    (dir, target) => {
      mario.classList.remove(`walk-${dir}`);
      mario.classList.add(`search-${dir}`);
      target.classList.add("active");
      playSfx("pipe");
    },
    duration,
    dir,
    event.currentTarget
  );

  // store position
  currentIndex = index;
  currentPipe = event.currentTarget;
};

// setup timeline
timeline.forEach((event, index) => {
  const e = document.createElement("div");
  e.classList.add("event");
  e.dataset.index = index;
  e.dataset.title = event.title;
  e.dataset.month = event.month_name;
  eventsContainer.appendChild(e);
  e.addEventListener("click", pipeHandler.bind(this));
});

/**
 * Audio handling
 */
const canAudio = "AudioContext" in window || "webkitAudioContext" in window;
const buffers = {};
let context = void 0;

if (canAudio) {
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext(); // Make it crossbrowser
  var gainNode = context.createGain();
  gainNode.gain.value = 1; // set volume to 100%
}

const playSfx = function play(id) {
  if (!canAudio || !buffers.hasOwnProperty(id)) return;
  const buffer = buffers[id];
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start();
};

const loadBuffers = (urls, ids) => {
  if (typeof urls == "string") urls = [urls];
  if (typeof ids == "string") ids = [ids];
  urls.forEach((url, index) => {
    window
      .fetch(`assets/data/${url}`)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        context.decodeAudioData(arrayBuffer, (buffer) => {
          buffers[ids[index]] = buffer;
        });
      });
  });
};

loadBuffers(["jump.mp3", "smb_pipe.mp3"], ["jump", "pipe"]);
