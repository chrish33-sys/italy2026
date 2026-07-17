const SUPABASE_URL = "https://dxfdfqaouzcqdjcfqxpa.supabase.co";
const SUPABASE_KEY = "sb_publishable_HCnmpHVljiBGXPDx2MtvXg_mn7Wvl1-";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* -------------------------------------------------------
   Questionnaire results carousel
------------------------------------------------------- */
(function () {
  const slides = *
    { src: "questionnaire_result_view_2.png", caption: "Result view 2 of 5" },
    { src: "questionnaire_result_view_3.png", caption: "Result view 3 of 5" },
    { src: "questionnaire_result_view_4.png", caption: "Result view 4 of 5" },
    { src: "questionnaire_result_view_5.png", caption: "Result view 5 of 5" }
  ];

  let idx = 0;

  const img*= document.getElementById("resultS*ideImage");
  const cap = document*getElementById("resultSlideCaption*);
  const prev = document.getElem*ntById("prevResultSlide");
  const next = document.getElementById("nextResultSlide");

  function render() {
    if (!img || !cap) return;
    img.src = slides[idx].src;
    cap.textContent = slides[idx].caption;
  }

  if (prev) {
    prev.addEventListener("click", () => {
      idx = (idx - 1 + slides.length) % slides.length;
      render();
    });
  }

  if (next) {
    next.addEventListener("click", () => {
      idx = (idx + 1) % slides.length;
      render();
    });
  }

  render();
})();

/* -------------------------------------------------------
   Market carousel
------------------------------------------------------- */
(function () {
  const markets = [
    {
      name: "Stresa market",
      when: "Friday morning, around 8:00–13:00",
      where: "Piazza Capucci, Stresa",
      journey: "Local / walkable from the villa",
      map: "https://www.google.com/maps/search/?api=1&query=Piazza+Capucci+Stresa+Italy"
    },
    {
      name: "Verbania Intra market",
      when: "Saturday, around 9:00–16:00",
      where: "Intra, Verbania",
      journey: "Nearby lake town; car/taxi/boat option depending on plan",
      map: "https://www.google.com/maps/search/?api=1&query=Intra+Verbania+market+Italy"
    },
    {
      name: "Cannobio market",
      when: "Sunday morning, around 8:00–13:00",
      where: "Cannobio lakefront",
      journey: "Excursion up the lake",
      map: "https://www.google.com/maps/search/?api=1&query=Cannobio+market+Lake+Maggiore+Italy"
    },
    {
      name: "Luino market",
      when: "Wednesday, around 9:00–16:00",
      where: "Luino",
      journey: "Larger excursion across/around the lake",
      map: "https://www.google.com/maps/search/?api=1&query=Luino+market+Lake+Maggiore+Italy"
    }
  ];

  let i = 0;

  const box = document.getElementById("marketCard");
  const cap = document.getElementById("marketCaption");
  const prev = document.getElementById("prevMarket");
  const next = document.getElementById("nextMarket");

  function draw() {
    if (!box) return;

    const m = markets[i];

    box.innerHTML = `
      <h4>${m.name}</h4>
      <div class="market-row">
        <b>When</b><span>${m.when}</span>
        <b>Where</b><span>${m.where}</span>
        <b>How far</b><span>${m.journey}</span>
      </div>
      <div class="links">
        ${m.map}Map: ${m.name}</a>
      </div>
    `;

    if (cap) cap.textContent = `Market ${i + 1} of ${markets.length}`;
  }

  if (prev) {
    prev.addEventListener("click", () => {
      i = (i - 1 + markets.length) % markets.length;
      draw();
    });
  }

  if (next) {
    next.addEventListener("click", () => {
      i = (i + 1) % markets.length;
      draw();
    });
  }

  draw();
})();

/* -------------------------------------------------------
   Shared Supabase voting
------------------------------------------------------- */
(function () {
  const activityCards = document.querySelectorAll(".activity");
  if (!activityCards.length) return;

  let currentVoter = localStorage.getItem("italy2026_voter");

  if (!currentVoter || currentVoter.trim() === "") {
    currentVoter = prompt("Who's voting? Enter your name:");

    if (!currentVoter || currentVoter.trim() === "") {
      currentVoter = "Guest-" + Math.random().toString(36).slice(2, 7);
    }

    currentVoter = currentVoter.trim();
    localStorage.setItem("italy2026_voter", currentVoter);
  }

  const voteState = {};

  function ensureVoteState(activity) {
    if (!voteState[activity]) {
      voteState[activity] = {
        up: 0,
        down: 0,
        mine: "none"
      };
    }

    return voteState[activity];
  }

  function renderVotes() {
    activityCards.forEach((card) => {
      const activity = card.dataset.activity;
      const state = ensureVoteState(activity);

      const upButton = card.querySelector(".up");
      const downButton = card.querySelector(".down");

      if (!upButton || !downButton) return;

      upButton.querySelector("span").textContent = state.up || 0;
      downButton.querySelector("span").textContent = state.down || 0;

      upButton.classList.toggle("active", state.mine === "up");
      downButton.classList.toggle("active", state.mine === "down");
    });
  }

  async function loadVoteTotals() {
    const { data, error } = await supabaseClient
      .from("vote_totals")
      .select("*");

    if (error) {
      console.error("Error loading vote totals:", error);
      return;
    }

    activityCards.forEach((card) => {
      const activity = card.dataset.activity;
      const state = ensureVoteState(activity);

      state.up = 0;
      state.down = 0;
    });

    if (data) {
      data.forEach((row) => {
        const state = ensureVoteState(row.activity);
        state.up = Number(row.up_votes || 0);
        state.down = Number(row.down_votes || 0);
      });
    }

    renderVotes();
  }

  async function loadMyVotes() {
    const { data, error } = await supabaseClient
      .from("votes")
      .select("activity, vote")
      .eq("voter", currentVoter);

    if (error) {
      console.error("Error loading my votes:", error);
      return;
    }

    activityCards.forEach((card) => {
      const activity = card.dataset.activity;
      const state = ensureVoteState(activity);
      state.mine = "none";
    });

    if (data) {
      data.forEach((row) => {
        const state = ensureVoteState(row.activity);
        state.mine = row.vote || "none";
      });
    }

    renderVotes();
  }

  async function submitVote(activity, requestedVote) {
    const state = ensureVoteState(activity);

    let nextVote = requestedVote;

    if (state.mine === requestedVote) {
      nextVote = "none";
    }

    const { error } = await supabaseClient
      .from("votes")
      .upsert(
        {
          activity: activity,
          vote: nextVote,
          voter: currentVoter
        },
        {
          onConflict: "activity,voter"
        }
      );

    if (error) {
      console.error("Error submitting vote:", error);
      alert("Vote could not be saved. Check Supabase setup.");
      return;
    }

    state.mine = nextVote;

    await loadVoteTotals();
    await loadMyVotes();
  }

  activityCards.forEach((card) => {
    const activity = card.dataset.activity;

    const upButton = card.querySelector(".up");
    const downButton = card.querySelector(".down");

    if (upButton) {
      upButton.addEventListener("click", () => {
        submitVote(activity, "up");
      });
    }

    if (downButton) {
      downButton.addEventListener("click", () => {
        submitVote(activity, "down");
      });
    }
  });

  async function initialiseVoting() {
    await loadVoteTotals();
    await loadMyVotes();
  }

  initialiseVoting();

  // Refresh shared totals periodically while the page is open.
  setInterval(loadVoteTotals, 15000);
})();
