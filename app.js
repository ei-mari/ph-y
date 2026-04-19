const PROGRESS_KEY = "pv-flashcard-progress";
const ORDER_KEY = "pv-flashcard-order";
const STAGE_KEY = "pv-flashcard-stage";
const WRITING_KEY = "pv-flashcard-writing";

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * 60 * 1000;

const ANKI_DEFAULTS = {
  learningSteps: [1 * MINUTE, 10 * MINUTE],
  relearningSteps: [10 * MINUTE],
  graduatingInterval: 1,
  easyInterval: 4,
  minimumInterval: 1,
  startingEase: 2.5,
  easyBonus: 1.3,
  intervalModifier: 1,
  newInterval: 0,
  lapseEaseDelta: 0.2,
  easyEaseDelta: 0.15,
  minimumEase: 1.3,
};

const CARD_HINTS = {
  "stage1:01": ["visit briefly", "come for a short visit"],
  "stage1:02": ["come to my place", "visit my house"],
  "stage1:03": ["search for", "try to find"],
  "stage1:04": ["board", "get onto"],
  "stage1:05": ["get inside", "enter the car"],
  "stage1:06": ["leave the train", "get out at"],
  "stage1:07": ["tidy up", "make it neat"],
  "stage1:08": ["search online", "check on the internet"],
  "stage1:09": ["wear", "put some clothes on"],
  "stage1:10": ["remove", "take your shoes off"],
  "stage1:11": ["return", "visit again later"],
  "stage1:12": ["return", "go to the previous place again"],
  "stage1:13": ["think of", "create an idea"],
  "stage1:14": ["end the call", "finish the phone conversation"],
  "stage1:15": ["take", "go out for"],
  "stage1:16": ["escape", "get away quickly"],
  "stage1:17": ["start living together", "begin sharing a home"],
  "stage1:18": ["leave your place", "move to another home"],
  "stage1:19": ["arrive", "be present"],
  "stage1:20": ["appear", "be found"],
  "stage1:21": ["come upstairs", "come to my office level"],
  "stage1:22": ["postpone", "delay doing"],
  "stage1:23": ["enter", "come inside"],
  "stage1:24": ["stay home", "not go out"],
  "stage1:25": ["accept", "take responsibility for"],
  "stage1:26": ["continue", "go to the next point"],
  "stage1:27": ["quit", "stop trying"],
  "stage1:28": ["arrive at", "reach"],
  "stage1:29": ["continue doing", "maintain the same level"],
  "stage1:30": ["keep in place", "press so it does not move"],
  "stage1:31": ["submit", "turn in"],
  "stage1:32": ["escape from", "take a break from"],
  "stage1:33": ["start now", "continue without waiting"],
  "stage1:34": ["be originally from", "have your roots in"],
  "stage1:35": ["match well", "fit each other naturally"],
  "stage1:36": ["enter", "gain access to"],
  "stage1:37": ["hang", "place on the wall"],
  "stage1:38": ["leave me alone", "stop bothering me"],
  "stage1:39": ["go downstairs", "head down to"],
  "stage1:40": ["fall behind", "not keep pace"],
  "stage1:41": ["go for a drink", "leave work for drinks"],
  "stage1:42": ["approach", "walk toward"],
  "stage1:43": ["restart", "switch it off and on again"],
  "stage1:44": ["meet by chance", "see unexpectedly"],
  "stage1:45": ["store neatly", "put in its proper place"],
  "stage1:46": ["prove to be", "end up being"],
  "stage1:47": ["admire", "respect greatly"],
  "stage1:48": ["request", "ask somebody for"],
  "stage1:49": ["be quiet", "stop talking"],
  "stage1:50": ["discard", "get rid of"],
};

const CARD_EXAMPLES = {
  "stage1:01": ["Please drop by after work if you have time.", "My uncle likes to drop by without calling first.", "I will drop by the bakery on my way home."],
  "stage1:02": ["A few friends are coming over tonight.", "Why don't you come over and study with us?", "My cousins came over for lunch on Sunday."],
  "stage1:03": ["I am looking for my keys again.", "She looked for a quiet place to read.", "We are looking for a better apartment downtown."],
  "stage1:04": ["We got on the bus just before it left.", "Make sure you get on the right train this time.", "They got on at the next station."],
  "stage1:05": ["Get in the taxi before it starts raining.", "The kids got in the car and buckled up.", "He told us to get in quickly."],
  "stage1:06": ["I got off at Central Station this morning.", "She got off the bus one stop early.", "Let's get off here and walk the rest of the way."],
  "stage1:07": ["We need to clean up before the guests arrive.", "He cleaned up the kitchen after dinner.", "Clean up your desk before you leave."],
  "stage1:08": ["I always look up new words in a dictionary app.", "She looked up the train schedule online.", "Can you look his number up for me?"],
  "stage1:09": ["Put on your hat before you go outside.", "He put on some music while he cooked.", "I need to put on a jacket because it's windy."],
  "stage1:10": ["Please take off your shoes at the door.", "He took off his glasses and rubbed his eyes.", "I need to take off this wet coat."],
  "stage1:11": ["I want to come back here next weekend.", "She came back from Canada yesterday.", "Please come back when you have more time."],
  "stage1:12": ["I had to go back for my wallet.", "Let's go back and check the room again.", "She went back to work after lunch."],
  "stage1:13": ["We need to come up with a new slogan.", "She came up with a clever answer.", "Can you come up with three ideas by tomorrow?"],
  "stage1:14": ["I have to hang up now because class is starting.", "She hung up before I could answer.", "Please don't hang up yet."],
  "stage1:15": ["Let's go for coffee after the meeting.", "He went for a long run this morning.", "I could go for some ramen right now."],
  "stage1:16": ["The dog ran away when the gate opened.", "He wanted to run away from all his problems.", "They ran away before anyone noticed them."],
  "stage1:17": ["They plan to move in next month.", "My sister moved in with her best friend.", "We moved in last weekend and still have boxes everywhere."],
  "stage1:18": ["He will move out at the end of June.", "She moved out when she got a new job.", "We have to move out by Friday."],
  "stage1:19": ["Only two students showed up for class.", "He never shows up on time.", "Thanks for showing up to help us."],
  "stage1:20": ["My missing glove finally turned up.", "Something unexpected always turns up.", "The documents turned up in an old drawer."],
  "stage1:21": ["Come up to the second floor when you get here.", "She came up to me and asked a question.", "Can you come up after lunch?"],
  "stage1:22": ["I can't put off this decision any longer.", "She kept putting off her homework.", "Don't put off calling the doctor."],
  "stage1:23": ["Come in and have some tea.", "The cat came in through the open window.", "Please come in before it gets dark."],
  "stage1:24": ["Let's stay in and watch a movie tonight.", "They stayed in because of the storm.", "I want to stay in this weekend and rest."],
  "stage1:25": ["I can't take on any more clients this month.", "She took on a new project at work.", "He is ready to take on more responsibility."],
  "stage1:26": ["Let's move on to the next topic.", "It took her a while to move on after the breakup.", "We should move on before we run out of time."],
  "stage1:27": ["I won't give up that easily.", "She gave up trying to fix the printer.", "Don't give up on your dream."],
  "stage1:28": ["Text me when you get to the station.", "We got to the airport very early.", "How long does it take to get to your office?"],
  "stage1:29": ["Keep up the great work.", "Can you keep up at this pace?", "She works hard to keep up during lessons."],
  "stage1:30": ["Hold down the papers so they don't fly away.", "He held down the lid while it cooled.", "Can you hold this box down while I tape it?"],
  "stage1:31": ["Please hand in your report by Monday.", "She handed in the form this morning.", "Don't forget to hand in your homework."],
  "stage1:32": ["I need to get away for a few days.", "She got away from the city for the weekend.", "We all need to get away from stress sometimes."],
  "stage1:33": ["Go ahead and start without me.", "He smiled and said I could go ahead.", "Please go ahead with your presentation."],
  "stage1:34": ["I come from a small town in Hokkaido.", "Where do you come from originally?", "She comes from a family of musicians."],
  "stage1:35": ["These colors go together really well.", "Rice and curry go together perfectly.", "I don't think those shoes go together with that dress."],
  "stage1:36": ["We couldn't get into the building after nine.", "How did the cat get into the closet?", "She used a keycard to get into the lab."],
  "stage1:37": ["Can you put up the new calendar?", "They put up a tent by the lake.", "We need to put up some shelves in the office."],
  "stage1:38": ["Please go away and let me concentrate.", "The pain went away after a few hours.", "I wish these clouds would go away."],
  "stage1:39": ["He went down to the basement to check the pipes.", "Can you go down and open the door?", "She went down to the kitchen for some water."],
  "stage1:40": ["I don't want to get behind in math class.", "She got behind on her bills last month.", "Try not to get behind with your reading."],
  "stage1:41": ["Do you want to go out after dinner?", "They went out for drinks on Friday night.", "We haven't gone out in weeks."],
  "stage1:42": ["She went up to the counter and asked for help.", "I saw him go up to the teacher after class.", "He went up to the dog very carefully."],
  "stage1:43": ["Turn the computer off and on again.", "He turned the lights on and off to test them.", "Can you turn the heater on and off from your phone?"],
  "stage1:44": ["I ran into my old teacher at the mall.", "She ran into some traffic on the way home.", "We ran into each other at a concert."],
  "stage1:45": ["Please put away the dishes after dinner.", "He put away his tools before leaving.", "I finally put away my winter clothes."],
  "stage1:46": ["The trip turned out better than we expected.", "It turned out to be a great restaurant.", "Everything turned out fine in the end."],
  "stage1:47": ["Many students look up to that coach.", "I looked up to my older sister when I was young.", "He really looks up to his grandfather."],
  "stage1:48": ["I need to ask for some extra time.", "She asked for directions at the station.", "He never asks for help unless he really needs it."],
  "stage1:49": ["He told his brother to shut up during the movie.", "Someone in the crowd yelled at the man to shut up.", "I was about to complain, but I shut up instead."],
  "stage1:50": ["Throw away those old magazines.", "He threw away the receipt by mistake.", "Please throw away any spoiled food."],
  "stage2:51": ["I need a few minutes to freshen up before dinner.", "She freshened up and changed into a clean shirt.", "Why don't you freshen up after the long flight?"],
  "stage2:52": ["We checked in at the hotel around three.", "Did you already check in for your flight?", "Let's check in before we grab lunch."],
  "stage2:53": ["We have to check out by eleven tomorrow.", "She checked out of the hotel early this morning.", "Don't forget to check out at the front desk."],
  "stage2:54": ["Can you help me pick out a gift for my sister?", "She picked out a blue dress for the party.", "It took him forever to pick out a new phone."],
  "stage2:55": ["Let's get together sometime next week.", "Our family gets together every New Year's Day.", "We got together for coffee after class."],
  "stage2:56": ["He's going through a difficult breakup right now.", "We all go through stressful times sometimes.", "She went through a lot last year."],
  "stage2:57": ["Please put down your phone during dinner.", "He put down the box by the door.", "You can put your bags down over there."],
  "stage2:58": ["I'd like to try on these boots, please.", "She tried on three jackets before choosing one.", "Why don't you try the sweater on first?"],
  "stage2:59": ["Hold on, I can't find my wallet.", "Can you hold on for just a second?", "She told me to hold on while she checked."],
  "stage2:60": ["The teacher gave out the worksheets quickly.", "They were giving out free samples at the station.", "I'll give out the name tags before the event starts."],
  "stage2:61": ["Can you pick up some milk on your way home?", "I picked up my package after work.", "She'll pick up the kids at five."],
  "stage2:62": ["Be careful or you'll fall over.", "The chair almost fell over in the wind.", "He slipped on the ice and fell over."],
  "stage2:63": ["I usually get up at six on weekdays.", "She got up quietly so she wouldn't wake the baby.", "It's hard to get up on rainy mornings."],
  "stage2:64": ["We've run out of paper for the printer.", "They ran out of gas in the middle of nowhere.", "I need to buy rice because we're running out of it."],
  "stage2:65": ["He walked out before the movie ended.", "I couldn't believe she just walked out like that.", "The customer got angry and walked out of the store."],
  "stage2:66": ["I need the weekend to catch up on sleep.", "She studied hard to catch up with the rest of the class.", "Let's catch up over lunch sometime."],
  "stage2:67": ["I work out three times a week.", "She's been working out at a new gym lately.", "He started to work out again after summer."],
  "stage2:68": ["We had to turn back because of the rain.", "The hikers turned back before it got dark.", "If we miss the exit, we'll have to turn back."],
  "stage2:69": ["You should go after the job if you really want it.", "She went after her goal with confidence.", "He's finally ready to go after a bigger dream."],
  "stage2:70": ["Please stand up when your name is called.", "He stood up to stretch his legs.", "Could you stand up for a moment?"],
  "stage2:71": ["You need to speak up in the back row.", "She spoke up when she heard something unfair.", "Please speak up so everyone can hear you."],
  "stage2:72": ["Can you pass on the message to Mia?", "He passed the letter on to his manager.", "I'll pass on your thanks to the team."],
  "stage2:73": ["You can come along if you want.", "My little brother came along to the park.", "Why don't you come along with us tonight?"],
  "stage2:74": ["Sorry, something came up at work.", "If anything comes up, call me right away.", "A family issue came up, so she had to leave."],
  "stage2:75": ["Her bright red coat really stands out.", "One student stood out from the rest.", "This design stands out in a good way."],
  "stage2:76": ["We're going over to Ken's house after dinner.", "Do you want to go over to their place tomorrow?", "I went over to my neighbor's to return a dish."],
  "stage2:77": ["We're heading to Osaka tomorrow morning.", "She headed to the station right after class.", "Let's head to the food court first."],
  "stage2:78": ["We looked around the market for souvenirs.", "Feel free to look around while you wait.", "They spent the afternoon looking around town."],
  "stage2:79": ["You'll get through this busy week somehow.", "We got through the presentation without any problems.", "She finally got through all her homework."],
  "stage2:80": ["Make sure you turn in your worksheet before lunch.", "He turned in his keys at the front desk.", "I forgot to turn in my essay yesterday."],
  "stage2:81": ["Do you get along with your new roommate?", "My cousins get along really well.", "She gets along with almost everyone at work."],
  "stage2:82": ["The boys were fooling around in the hallway.", "Stop fooling around and finish your homework.", "They spent the afternoon fooling around by the river."],
  "stage2:83": ["Please give back the book when you're done.", "She gave the pen back to me after class.", "When will you give back my charger?"],
  "stage2:84": ["I'll find out what time the movie starts.", "She found out the truth last night.", "Can you find out if he's available tomorrow?"],
  "stage2:85": ["He loves to show off his cooking skills.", "She showed off her new sneakers to everyone.", "Stop showing off and just play the game."],
  "stage2:86": ["I'll call you back after the meeting.", "She called back as soon as she saw the missed call.", "Can you call the customer back this afternoon?"],
  "stage2:87": ["My alarm goes off at six every day.", "A car alarm went off outside our window.", "The smoke detector went off while I was cooking."],
  "stage2:88": ["This jacket goes with almost everything.", "Do these shoes go with my dress?", "I think the soup goes well with bread."],
  "stage2:89": ["They stayed together for many years.", "I hope the group can stay together until the end.", "My grandparents stayed together through hard times."],
  "stage2:90": ["I usually get around by bike.", "It's easy to get around the city by train.", "How do tourists get around here?"],
  "stage2:91": ["I finally get to relax this weekend.", "She got to meet the author in person.", "We didn't get to finish the game."],
  "stage2:92": ["Listen up, everyone, class is starting.", "You should listen up when your coach is talking.", "The kids listened up as soon as the teacher raised her voice."],
  "stage2:93": ["He stood me up again last night.", "I can't believe she stood him up on his birthday.", "No one wants to get stood up on a first date."],
  "stage2:94": ["We went to the station to see her off.", "His friends saw him off at the airport.", "I'll come see you off before your flight."],
  "stage2:95": ["Let's meet up after school.", "We met up for brunch on Sunday.", "Are you free to meet up later today?"],
  "stage2:96": ["I like to look back on old photos sometimes.", "She looked back on her school days with a smile.", "When we look back on this trip, we'll laugh."],
  "stage2:97": ["My legs gave out near the end of the race.", "The old chair finally gave out.", "His voice gave out during the speech."],
  "stage2:98": ["Don't worry, I'll pay for lunch today.", "She paid for the tickets online.", "Who is going to pay for the repairs?"],
  "stage2:99": ["Can you help me put up these curtains?", "They put up a sign in front of the store.", "We're putting up shelves in the bedroom this weekend."],
  "stage2:100": ["We hung out at the park all afternoon.", "Do you want to hang out after work?", "They usually hang out at that cafe on weekends."]
};

const els = {
  deckName: document.getElementById("deck-name"),
  progress: document.getElementById("progress-text"),
  stageSelect: document.getElementById("stage-select"),
  orderNormalBtn: document.getElementById("order-normal-btn"),
  orderRandomBtn: document.getElementById("order-random-btn"),
  studyModeBtn: document.getElementById("study-mode-btn"),
  listModeBtn: document.getElementById("list-mode-btn"),
  studyView: document.getElementById("study-view"),
  listView: document.getElementById("list-view"),
  listGrid: document.getElementById("list-grid"),
  card: document.getElementById("card"),
  image: document.getElementById("card-image"),
  backImage: document.getElementById("back-card-image"),
  frontText: document.getElementById("front-text"),
  hintBtn: document.getElementById("hint-btn"),
  answerBtn: document.getElementById("answer-btn"),
  hintPanel: document.getElementById("hint-panel"),
  hintText: document.getElementById("hint-text"),
  backText: document.getElementById("back-text"),
  examplesBtn: document.getElementById("examples-btn"),
  examplesPanel: document.getElementById("examples-panel"),
  examplesText: document.getElementById("examples-text"),
  translationBtn: document.getElementById("translation-btn"),
  explanationBtn: document.getElementById("explanation-btn"),
  translationPanel: document.getElementById("translation-panel"),
  explanationPanel: document.getElementById("explanation-panel"),
  translationText: document.getElementById("translation-text"),
  explanationText: document.getElementById("explanation-text"),
  audioBtn: document.getElementById("audio-btn"),
  writingBtn: document.getElementById("writing-btn"),
  writingPanel: document.getElementById("writing-panel"),
  writingInput: document.getElementById("writing-input"),
  writingCopyBtn: document.getElementById("writing-copy-btn"),
  writingShareBtn: document.getElementById("writing-share-btn"),
  audioPlayer: document.getElementById("audio-player"),
  againBtn: document.getElementById("again-btn"),
  goodBtn: document.getElementById("good-btn"),
  easyBtn: document.getElementById("easy-btn"),
  againTime: document.getElementById("again-time"),
  goodTime: document.getElementById("good-time"),
  easyTime: document.getElementById("easy-time"),
  listSearch: document.getElementById("list-search"),
};

const library = window.APP_DATA || {
  name: "Essential Verbs",
  stages: [],
};

const state = {
  progress: loadProgress(),
  writingDrafts: loadWritingDrafts(),
  orderMode: localStorage.getItem(ORDER_KEY) || "review",
  stageId: localStorage.getItem(STAGE_KEY) || (library.stages[0] && library.stages[0].id),
  queue: [],
  currentIndex: 0,
  currentCard: null,
  isBack: false,
  viewMode: "study",
  listSearch: "",
};

function loadProgress() {
  const saved = localStorage.getItem(PROGRESS_KEY);
  if (!saved) return { cards: {} };

  try {
    return JSON.parse(saved);
  } catch {
    return { cards: {} };
  }
}

function saveProgress() {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(state.progress));
}

function loadWritingDrafts() {
  const saved = localStorage.getItem(WRITING_KEY);
  if (!saved) return {};

  try {
    return JSON.parse(saved);
  } catch {
    return {};
  }
}

function saveWritingDrafts() {
  localStorage.setItem(WRITING_KEY, JSON.stringify(state.writingDrafts));
}

function getStage() {
  return library.stages.find((stage) => stage.id === state.stageId) || library.stages[0];
}

function getFilteredCards() {
  const stage = getStage();
  const query = state.listSearch.trim().toLowerCase();
  if (!query) return stage.cards;

  return stage.cards.filter((card) =>
    [
      card.answer,
      card.frontText,
      card.backText,
      card.translation,
      card.explanation,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query)
  );
}

function getCardKey(card) {
  return `${getStage().id}:${card.id}`;
}

function getWritingDraft(card) {
  return state.writingDrafts[getCardKey(card)] || "";
}

function setWritingDraft(card, text) {
  state.writingDrafts[getCardKey(card)] = text;
  saveWritingDrafts();
}

function getCardHints(stageId, card) {
  return CARD_HINTS[`${stageId}:${card.id}`] || [];
}

function getCardExamples(stageId, card) {
  return CARD_EXAMPLES[`${stageId}:${card.id}`] || [];
}

function buildExamplesMarkup(examples) {
  if (!examples.length) {
    return "<ul class=\"hint-list\"><li>Example sentences are not set yet.</li></ul>";
  }
  return `<ul class="hint-list">${examples.map((example) => `<li>${example}</li>`).join("")}</ul>`;
}

function buildPromptText(frontText, answer) {
  return buildFrontText(frontText, answer).replace(/\n/g, "<br>");
}

function buildSolvedPromptText(frontText, answer, solvedText = "") {
  return buildSolvedText(frontText, answer, solvedText).replace(/\n/g, "<br>");
}

function getCardProgress(card) {
  const key = getCardKey(card);
  if (!state.progress.cards[key]) {
    state.progress.cards[key] = {
      status: "new",
      step: 0,
      interval: 0,
      ease: ANKI_DEFAULTS.startingEase,
      dueAt: 0,
      seen: 0,
      lastGrade: "",
      lastStudiedAt: 0,
      originalInterval: 0,
    };
  }

  const meta = state.progress.cards[key];
  meta.status ||= "new";
  meta.step = Number.isFinite(meta.step) ? meta.step : 0;
  meta.interval = Number.isFinite(meta.interval) ? meta.interval : 0;
  meta.ease = Number.isFinite(meta.ease) ? meta.ease : ANKI_DEFAULTS.startingEase;
  meta.dueAt = Number.isFinite(meta.dueAt) ? meta.dueAt : 0;
  meta.seen = Number.isFinite(meta.seen) ? meta.seen : 0;
  meta.lastGrade ||= "";
  meta.lastStudiedAt = Number.isFinite(meta.lastStudiedAt) ? meta.lastStudiedAt : 0;
  meta.originalInterval = Number.isFinite(meta.originalInterval) ? meta.originalInterval : 0;
  return meta;
}

function buildQueue() {
  const stage = getStage();
  const now = Date.now();
  const cards = [...stage.cards];

  if (state.orderMode === "random") {
    for (let i = cards.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }

  const due = [];
  const future = [];

  for (const card of cards) {
    const meta = getCardProgress(card);
    const entry = { card, dueAt: meta.dueAt || 0, seen: meta.seen || 0 };
    if (meta.status === "new" || entry.dueAt <= now) {
      due.push(entry);
    } else {
      future.push(entry);
    }
  }

  due.sort((a, b) => a.dueAt - b.dueAt || a.seen - b.seen);
  future.sort((a, b) => a.dueAt - b.dueAt);
  return [...due, ...future].map((entry) => entry.card);
}

function ensureCurrentCard() {
  if (state.queue.length === 0) state.queue = buildQueue();
  if (state.currentIndex >= state.queue.length) state.currentIndex = 0;
  state.currentCard = state.queue[state.currentIndex];
}

function buildFrontText(frontText, answer) {
  const blankWidth = Math.max(answer.replace(/\s+/g, "").length, 6);
  return frontText.replace(/(?:____\s*)+/g, `<span class="blank single-blank" style="--blank-ch:${blankWidth};"></span>`);
}

function buildSolvedText(frontText, answer, solvedText = "") {
  if (solvedText) return solvedText;
  return frontText.replace(/(?:____\s*)+/g, `<span class="filled">${answer}</span>`);
}

function buildSolvedPlainText(frontText, answer, solvedText = "") {
  if (solvedText) return solvedText;
  return frontText.replace(/(?:____\s*)+/g, (match) => `${answer}${/\s$/.test(match) ? " " : ""}`);
}

function formatRelative(ms, repeat = false) {
  if (ms <= 0) return "in 0 mins";
  const minutes = Math.round(ms / MINUTE);
  if (minutes < 60) return `in ${minutes} mins`;
  const hours = Math.round(ms / (60 * MINUTE));
  if (hours < 24) return `in ${hours} hours`;
  const days = Math.round(ms / DAY);
  return `in ${days} days`;
}

function clampEase(value) {
  return Math.max(ANKI_DEFAULTS.minimumEase, Number(value.toFixed(2)));
}

function getFirstStep(steps) {
  return steps.length > 0 ? steps[0] : 0;
}

function getGoodReviewDays(intervalDays, ease) {
  const scaled = Math.round(intervalDays * ease * ANKI_DEFAULTS.intervalModifier);
  return Math.max(ANKI_DEFAULTS.minimumInterval, intervalDays + 1, scaled);
}

function getEasyReviewDays(intervalDays, ease) {
  const goodDays = getGoodReviewDays(intervalDays, ease);
  const scaled = Math.round(intervalDays * ease * ANKI_DEFAULTS.easyBonus * ANKI_DEFAULTS.intervalModifier);
  return Math.max(ANKI_DEFAULTS.easyInterval, goodDays + 1, scaled);
}

function getLapseGraduatingDays(meta) {
  const baseInterval = Math.max(meta.originalInterval || meta.interval || 1, 1);
  const scaled = Math.round(baseInterval * ANKI_DEFAULTS.newInterval);
  return Math.max(ANKI_DEFAULTS.minimumInterval, scaled);
}

function predictSchedule(meta, grade) {
  const learningSteps = ANKI_DEFAULTS.learningSteps;
  const relearningSteps = ANKI_DEFAULTS.relearningSteps;
  const reviewInterval = Math.max(meta.interval || 1, 1);

  if (meta.status === "review") {
    if (grade === "again") {
      return {
        status: relearningSteps.length > 0 ? "relearning" : "review",
        step: 0,
        interval: reviewInterval,
        originalInterval: reviewInterval,
        ease: clampEase(meta.ease - ANKI_DEFAULTS.lapseEaseDelta),
        dueMs: 0,
      };
    }

    if (grade === "good") {
      const nextDays = getGoodReviewDays(reviewInterval, meta.ease);
      return {
        status: "review",
        step: 0,
        interval: nextDays,
        originalInterval: 0,
        ease: meta.ease,
        dueMs: nextDays * DAY,
      };
    }

    const nextEase = clampEase(meta.ease + ANKI_DEFAULTS.easyEaseDelta);
    const nextDays = getEasyReviewDays(reviewInterval, nextEase);
    return {
      status: "review",
      step: 0,
      interval: nextDays,
      originalInterval: 0,
      ease: nextEase,
      dueMs: nextDays * DAY,
    };
  }

  if (meta.status === "relearning") {
    if (grade === "again") {
      return {
        status: "relearning",
        step: 0,
        interval: meta.interval,
        originalInterval: meta.originalInterval,
        ease: meta.ease,
        dueMs: 0,
      };
    }

    if (grade === "good") {
      const nextStep = meta.step + 1;
      if (nextStep < relearningSteps.length) {
        return {
          status: "relearning",
          step: nextStep,
          interval: meta.interval,
          originalInterval: meta.originalInterval,
          ease: meta.ease,
          dueMs: relearningSteps[nextStep],
        };
      }

      const nextDays = getLapseGraduatingDays(meta);
      return {
        status: "review",
        step: 0,
        interval: nextDays,
        originalInterval: 0,
        ease: meta.ease,
        dueMs: nextDays * DAY,
      };
    }

    const nextDays = getEasyReviewDays(Math.max(meta.originalInterval || meta.interval || 1, 1), meta.ease);
    return {
      status: "review",
      step: 0,
      interval: nextDays,
      originalInterval: 0,
      ease: clampEase(meta.ease + ANKI_DEFAULTS.easyEaseDelta),
      dueMs: nextDays * DAY,
    };
  }

  if (meta.status === "learning") {
    if (grade === "again") {
      return {
        status: "learning",
        step: 0,
        interval: 0,
        originalInterval: 0,
        ease: meta.ease,
        dueMs: 0,
      };
    }

    if (grade === "good") {
      const nextStep = meta.step + 1;
      if (nextStep < learningSteps.length) {
        return {
          status: "learning",
          step: nextStep,
          interval: 0,
          originalInterval: 0,
          ease: meta.ease,
          dueMs: learningSteps[nextStep],
        };
      }

      return {
        status: "review",
        step: 0,
        interval: ANKI_DEFAULTS.graduatingInterval,
        originalInterval: 0,
        ease: meta.ease,
        dueMs: ANKI_DEFAULTS.graduatingInterval * DAY,
      };
    }

    return {
      status: "review",
      step: 0,
      interval: ANKI_DEFAULTS.easyInterval,
      originalInterval: 0,
      ease: meta.ease,
      dueMs: ANKI_DEFAULTS.easyInterval * DAY,
    };
  }

  if (grade === "again") {
    return {
      status: "learning",
      step: 0,
      interval: 0,
      originalInterval: 0,
      ease: meta.ease,
      dueMs: 0,
    };
  }

  if (grade === "good") {
    if (learningSteps.length > 1) {
      return {
        status: "learning",
        step: 1,
        interval: 0,
        originalInterval: 0,
        ease: meta.ease,
        dueMs: learningSteps[1],
      };
    }

    return {
      status: "review",
      step: 0,
      interval: ANKI_DEFAULTS.graduatingInterval,
      originalInterval: 0,
      ease: meta.ease,
      dueMs: ANKI_DEFAULTS.graduatingInterval * DAY,
    };
  }

  return {
    status: "review",
    step: 0,
    interval: ANKI_DEFAULTS.easyInterval,
    originalInterval: 0,
    ease: meta.ease,
    dueMs: ANKI_DEFAULTS.easyInterval * DAY,
  };
}

function populateStageSelect() {
  els.stageSelect.innerHTML = "";
  for (const stage of library.stages) {
    const option = document.createElement("option");
    option.value = stage.id;
    option.textContent = stage.name;
    els.stageSelect.appendChild(option);
  }
}

function renderList() {
  const cards = getFilteredCards();
  els.listGrid.innerHTML = "";

  if (cards.length === 0) {
    els.listGrid.innerHTML = '<article class="list-empty">No matches found.</article>';
    return;
  }

  for (const card of cards) {
    const item = document.createElement("article");
    item.className = "list-card";
    item.id = `list-card-${card.id}`;
    item.innerHTML = `
      <div class="list-image-frame">
        <img src="${card.image}" alt="${card.answer}">
      </div>
      <div class="list-copy">
        <div class="list-head">
          <p class="list-answer">${card.backText}</p>
          <button class="list-audio ghost icon-btn" type="button" aria-label="Play Audio">🎧</button>
        </div>
        <p class="list-sentence">${buildSolvedText(card.frontText, card.answer, card.solvedText)}</p>
        <div class="list-controls">
          <button class="list-toggle-btn ghost" type="button">日本語</button>
          <button class="list-toggle-btn ghost" type="button">解説</button>
          <button class="list-toggle-btn ghost" type="button">例文</button>
        </div>
        <div class="list-detail-panels">
          <div class="list-detail is-hidden">
            <span>日本語</span>
            <p>${card.translation || "未設定"}</p>
          </div>
          <div class="list-detail is-hidden">
            <span>解説</span>
            <p>${card.explanation || "未設定"}</p>
          </div>
          <div class="list-detail list-detail-examples is-hidden">
            <span>例文</span>
            <div>${buildExamplesMarkup(getCardExamples(getStage().id, card))}</div>
          </div>
        </div>
      </div>
    `;

    item.querySelector(".list-audio").addEventListener("click", () => {
      els.audioPlayer.src = card.audio;
      playAudio();
    });

    const [translationToggle, explanationToggle, examplesToggle] = item.querySelectorAll(".list-toggle-btn");
    const [translationPanel, explanationPanel, examplesPanel] = item.querySelectorAll(".list-detail");
    translationToggle.addEventListener("click", () => {
      const willOpen = translationPanel.classList.contains("is-hidden");
      translationPanel.classList.toggle("is-hidden", !willOpen);
      examplesPanel.classList.add("is-hidden");
      explanationPanel.classList.add("is-hidden");
    });
    examplesToggle.addEventListener("click", () => {
      const willOpen = examplesPanel.classList.contains("is-hidden");
      translationPanel.classList.add("is-hidden");
      examplesPanel.classList.toggle("is-hidden", !willOpen);
      explanationPanel.classList.add("is-hidden");
    });
    explanationToggle.addEventListener("click", () => {
      const willOpen = explanationPanel.classList.contains("is-hidden");
      translationPanel.classList.add("is-hidden");
      examplesPanel.classList.add("is-hidden");
      explanationPanel.classList.toggle("is-hidden", !willOpen);
    });

    els.listGrid.appendChild(item);
  }
}

function setViewMode(mode) {
  state.viewMode = mode;
  const isStudyShell = mode === "study";
  els.studyModeBtn.classList.toggle("is-active", mode === "study");
  els.listModeBtn.classList.toggle("is-active", mode === "list");
  els.studyView.classList.toggle("is-hidden", !isStudyShell);
  els.listView.classList.toggle("is-hidden", mode !== "list");
}

function syncBackPanelState() {
  const hasOpenPanel =
    !els.examplesPanel.classList.contains("is-hidden") ||
    !els.translationPanel.classList.contains("is-hidden") ||
    !els.explanationPanel.classList.contains("is-hidden") ||
    !els.writingPanel.classList.contains("is-hidden");
  const backFace = els.card.querySelector(".card-back");
  if (backFace) {
    backFace.classList.toggle("has-open-panel", hasOpenPanel);
  }
  els.examplesBtn.classList.toggle("is-open", !els.examplesPanel.classList.contains("is-hidden"));
  els.translationBtn.classList.toggle("is-open", !els.translationPanel.classList.contains("is-hidden"));
  els.explanationBtn.classList.toggle("is-open", !els.explanationPanel.classList.contains("is-hidden"));
}

function toggleBackPanel(targetPanel) {
  const panels = [els.examplesPanel, els.translationPanel, els.explanationPanel];
  const willOpen = targetPanel.classList.contains("is-hidden");
  for (const panel of panels) {
    panel.classList.add("is-hidden");
  }
  if (willOpen) {
    targetPanel.classList.remove("is-hidden");
  }
  syncBackPanelState();
}

function renderScheduleHints() {
  const meta = getCardProgress(state.currentCard);
  els.againTime.textContent = formatRelative(predictSchedule(meta, "again").dueMs, true);
  els.goodTime.textContent = formatRelative(predictSchedule(meta, "good").dueMs);
  els.easyTime.textContent = formatRelative(predictSchedule(meta, "easy").dueMs);
}

function render() {
  ensureCurrentCard();
  const stage = getStage();
  const card = state.currentCard;
  const stageIndex = stage.cards.findIndex((item) => item.id === card.id);
  const displayIndex = stageIndex === -1 ? state.currentIndex + 1 : stageIndex + 1;

  els.deckName.textContent = `${library.name} / ${stage.name}`;
  els.progress.textContent = `${displayIndex} / ${stage.cards.length}`;
  els.stageSelect.value = stage.id;
  els.listSearch.value = state.listSearch;
  els.orderNormalBtn.classList.toggle("is-active", state.orderMode === "review");
  els.orderRandomBtn.classList.toggle("is-active", state.orderMode === "random");
  els.image.src = card.image;
  els.image.alt = card.answer;
  els.backImage.src = card.image;
  els.backImage.alt = card.answer;
  els.frontText.innerHTML = buildPromptText(card.frontText, card.answer);
  const hints = getCardHints(stage.id, card);
  els.hintText.innerHTML = hints.length
    ? `<ul class="hint-list">${hints.map((hint) => `<li>${hint}</li>`).join("")}</ul>`
    : '<ul class="hint-list"><li>Try a simpler English expression.</li><li>Think of a more basic verb phrase.</li></ul>';
  els.backText.innerHTML = buildSolvedPromptText(card.frontText, card.answer, card.solvedText);
  els.examplesText.innerHTML = buildExamplesMarkup(getCardExamples(stage.id, card));
  els.translationText.textContent = card.translation || "日本語訳は未設定です。";
  els.explanationText.textContent = card.explanation || "解説は未設定です。";
  els.writingInput.value = getWritingDraft(card);
  setAudioSource(card.audio);
  els.card.classList.toggle("is-back", state.isBack);
  els.card.classList.toggle("is-front", !state.isBack);
  renderScheduleHints();
  renderList();
  setViewMode(state.viewMode);
}

function clearInstantFlip() {
  requestAnimationFrame(() => {
    els.card.classList.remove("is-instant");
  });
}

function setFront(options = {}) {
  if (options.instant) {
    els.card.classList.add("is-instant");
  }
  state.isBack = false;
  els.hintPanel.classList.add("is-hidden");
  els.examplesPanel.classList.add("is-hidden");
  els.translationPanel.classList.add("is-hidden");
  els.explanationPanel.classList.add("is-hidden");
  els.writingPanel.classList.add("is-hidden");
  render();
  syncBackPanelState();
  if (options.instant) {
    clearInstantFlip();
  }
}

function setBack() {
  state.isBack = true;
  render();
  setAudioSource(state.currentCard.audio);
  playAudio();
}

function setAudioSource(src) {
  const resolvedSrc = new URL(src, window.location.href).href;
  if (els.audioPlayer.src === resolvedSrc) return;
  els.audioPlayer.src = resolvedSrc;
}

function playAudio() {
  els.audioPlayer.currentTime = 0;
  const playback = els.audioPlayer.play();
  if (playback && typeof playback.catch === "function") {
    playback.catch(() => {
      const retry = () => {
        els.audioPlayer.play().catch(() => {});
      };
      els.audioPlayer.addEventListener("canplay", retry, { once: true });
    });
  }
}

function scheduleCurrent(grade) {
  const card = state.currentCard;
  const meta = getCardProgress(card);
  const now = Date.now();
  const next = predictSchedule(meta, grade);

  meta.seen += 1;
  meta.lastGrade = grade;
  meta.lastStudiedAt = now;
  meta.status = next.status;
  meta.step = next.step;
  meta.interval = next.interval;
  meta.ease = next.ease;
  meta.dueAt = now + next.dueMs;
  meta.originalInterval = next.originalInterval;

  saveProgress();

  state.queue = buildQueue();
  if (grade === "again") {
    const currentId = card.id;
    const sameIndex = state.queue.findIndex((item) => item.id === currentId);
    state.currentIndex = sameIndex === -1 ? 0 : sameIndex;
  } else if (state.orderMode === "random") {
    state.currentIndex = 0;
  } else {
    const currentId = card.id;
    const nextIndex = state.queue.findIndex((item) => item.id !== currentId);
    state.currentIndex = nextIndex === -1 ? 0 : nextIndex;
  }

  setFront({ instant: true });
}

function reloadStage() {
  state.queue = buildQueue();
  state.currentIndex = 0;
  setFront();
}

els.card.addEventListener("click", () => {
  if (!state.isBack) {
    setBack();
  }
});

els.audioBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  playAudio();
});

els.writingBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  els.writingPanel.classList.toggle("is-hidden");
  syncBackPanelState();
});

els.examplesBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleBackPanel(els.examplesPanel);
});

els.hintBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  els.hintPanel.classList.toggle("is-hidden");
});

els.answerBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  setBack();
});

els.hintPanel.addEventListener("click", (event) => {
  event.stopPropagation();
});

els.translationBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleBackPanel(els.translationPanel);
});

els.explanationBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleBackPanel(els.explanationPanel);
});

els.writingInput.addEventListener("input", () => {
  if (!state.currentCard) return;
  setWritingDraft(state.currentCard, els.writingInput.value);
});

els.writingCopyBtn.addEventListener("click", async (event) => {
  event.stopPropagation();
  const text = els.writingInput.value.trim();
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    els.writingCopyBtn.textContent = "Copied";
    setTimeout(() => {
      els.writingCopyBtn.textContent = "Copy";
    }, 1200);
  } catch {}
});

els.writingShareBtn.addEventListener("click", async (event) => {
  event.stopPropagation();
  const text = els.writingInput.value.trim();
  if (!text) return;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Self Writing",
        text,
      });
      return;
    } catch {}
  }

  try {
    await navigator.clipboard.writeText(text);
    els.writingShareBtn.textContent = "Copied";
    setTimeout(() => {
      els.writingShareBtn.textContent = "Share";
    }, 1200);
  } catch {}
});

els.againBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  scheduleCurrent("again");
});

els.goodBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  scheduleCurrent("good");
});

els.easyBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  scheduleCurrent("easy");
});

els.orderNormalBtn.addEventListener("click", () => {
  state.orderMode = "review";
  localStorage.setItem(ORDER_KEY, state.orderMode);
  reloadStage();
});

els.orderRandomBtn.addEventListener("click", () => {
  state.orderMode = "random";
  localStorage.setItem(ORDER_KEY, state.orderMode);
  reloadStage();
});

els.stageSelect.addEventListener("change", () => {
  state.stageId = els.stageSelect.value;
  localStorage.setItem(STAGE_KEY, state.stageId);
  reloadStage();
});

els.studyModeBtn.addEventListener("click", () => {
  state.viewMode = "study";
  setFront({ instant: true });
});
els.listModeBtn.addEventListener("click", () => {
  state.listSearch = "";
  els.listSearch.value = "";
  renderList();
  setViewMode("list");
});
els.listSearch.addEventListener("input", () => {
  state.listSearch = els.listSearch.value;
  renderList();
});

document.addEventListener("keydown", (event) => {
  if (event.key === " " || event.key === "Enter") {
    event.preventDefault();
    if (!state.isBack) setBack();
    return;
  }

  if (!state.isBack) return;
  if (event.key === "1") scheduleCurrent("again");
  if (event.key === "2") scheduleCurrent("good");
  if (event.key === "3") scheduleCurrent("easy");
});

populateStageSelect();
state.queue = buildQueue();
ensureCurrentCard();
setFront();
