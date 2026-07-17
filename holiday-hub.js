const SUPABASE_URL = "https://dxfdfqaouzcqdjcfqxpa.supabase.co";
const SUPABASE_KEY = "sb_publishable_HCnmpHVljiBGXPDx2MtvXg_mn7Wvl1-";

const supabaseClient = window.supabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

/* -------------------------------------------------------
   Questionnaire results carousel
------------------------------------------------------- */
(function () {
  const slides = [
    { src: "questionnaire_result_view_2.png", caption: "Result view 2 of 5" },
    { src: "questionnaire_result_view_3.png", caption: "Result view 3 of 5" },
    { src: "questionnaire_result_view_4.png", caption: "Result view 4 of 5" },
    { src: "questionnaire_result_view_5.png", caption: "Result view 5 of 5" }
  ];

  let idx = 0;

  const img = document.getElementById("resultSlideImage");
  const cap = document.getElementById("resultSlideCaption");
  const prev = document.getElementById("prevResultSlide");
  const next = document.getElementById("nextResultSlide");

  function render() {
    if (!img || !cap) return;
    img.src = slides[idx].src;
    cap.textContent = slides[idx].caption;
  }

  if (prev) {
    prev.addEventListener("click", function () {
      idx = (idx - 1 + slides.length) % slides.length;
      render();
    });
  }

  if (next) {
    next.addEventListener("click", function () {
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
      when: "Friday morning, around 8:00-13:00",
      where: "Piazza Capucci, Stresa",
      journey: "Local / walkable from the villa",
      map: "https://www.google.com/maps/search/?api=1&query=Piazza+Capucci+Stresa+Italy"
    },
    {
      name: "Verbania Intra market",
      when: "Saturday, around 9:00-16:00",
      where: "Intra, Verbania",
      journey: "Nearby lake town; car/taxi/boat option depending on plan",
      map: "https://www.google.com/maps/search/?api=1&query=Intra+Verbania+market+Italy"
    },
    {
      name: "Cannobio market",
      when: "Sunday morning, around 8:00-13:00",
      where: "Cannobio lakefront",
      journey: "Excursion up the lake",
      map: "https://www.google.com/maps/search/?api=1&query=Cannobio+market+Lake+Maggiore+Italy"
    },
    {
      name: "Luino market",
      when: "Wednesday, around 9:00-16:00",
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

    box.innerHTML =
      "<h4>" + m.name + "</h4>" +
      "<div class=\"market-row\">" +
      "<b>When</b><span>" + m.when + "</span>" +
      "<b>Where</b><span>" + m.where + "</span>" +
      "<b>How far</b><span>" + m.journey + "</span>" +
      "</div>" +
      "<div class=\"links\">" +
      "\""Map: " + m.name + "</a>" +
      "</div>";

    if (cap) {
      cap.textContent = "Market " + (i + 1) + " of " + markets.length;
    }
  }

  if (prev) {
    prev.addEventListener("click", function () {
      i = (i - 1 + markets.length) % markets.length;
      draw();
    });
  }

  if (next) {
    next.addEventListener("click", function () {
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
  const cards = Array.from(document.querySelectorAll(".activity"));
  const errorBox = document.getElementById("voteSetupError");

  if (!cards.length) return;

  if (!supabaseClient) {
    if (errorBox) {
      errorBox.style.display = "block";
      errorBox.textContent = "Voting could not load because Supabase is missing.";
    }
    return;
  }

  function getVoterName() {
    let voter = localStorage.getItem("italy2026_voter");

    if (!voter || !voter.trim()) {
      voter = prompt("Who's voting? Enter your name:");

      if (!voter || !voter.trim()) {
        voter = "Guest-" + Math.random().toString(36).slice(2, 7);
      }

      voter = voter.trim();
      localStorage.setItem("italy2026_voter", voter);
    }

    return voter;
  }

  function clearActiveStates() {
    cards.forEach(function (card) {
      const up = card.querySelector(".up");
      const down = card.querySelector(".down");

      if (up) up.classList.remove("active");
      if (down) down.classList.remove("active");
    });
  }

  function setCardVoteState(activity, vote) {
    const card = document.querySelector(".activity[data-activity=\"" + activity + "\"]");
    if (!card) return;

    const up = card.querySelector(".up");
    const down = card.querySelector(".down");

    if (!up || !down) return;

    up.classList.toggle("active", vote === "up");
    down.classList.toggle("active", vote === "down");
  }

  async function loadTotals() {
    const result = await supabaseClient
      .from("vote_totals")
      .select("*");

    if (result.error) {
      console.error("Could not load vote totals:", result.error);

      if (errorBox) {
        errorBox.style.display = "block";
        errorBox.textContent = "Voting totals could not load. Check Supabase permissions.";
      }

      return;
    }

    cards.forEach(function (card) {
      const upCount = card.querySelector(".up span");
      const downCount = card.querySelector(".down span");

      if (upCount) upCount.textContent = "0";
      if (downCount) downCount.textContent = "0";
    });

    result.data.forEach(function (row) {
      const card = document.querySelector(".activity[data-activity=\"" + row.activity + "\"]");
      if (!card) return;

      const upCount = card.querySelector(".up span");
      const downCount = card.querySelector(".down span");

      if (upCount) upCount.textContent = row.up_votes || 0;
      if (downCount) downCount.textContent = row.down_votes || 0;
    });

    if (errorBox) {
      errorBox.style.display = "none";
    }
  }

  async function loadMyVotes() {
    const voter = localStorage.getItem("italy2026_voter");
    if (!voter) return;

    const result = await supabaseClient
      .from("votes")
      .select("activity, vote")
      .eq("voter", voter);

    if (result.error) {
      console.error("Could not load my votes:", result.error);
      return;
    }

    clearActiveStates();

    result.data.forEach(function (row) {
      setCardVoteState(row.activity, row.vote);
    });
  }

  async function getExistingVote(activity, voter) {
    const result = await supabaseClient
      .from("votes")
      .select("id, vote")
      .eq("activity", activity)
      .eq("voter", voter)
      .maybeSingle();

    if (result.error) {
      console.error("Could not check current vote:", result.error);
      return null;
    }

    return result.data;
  }

  async function saveVote(activity, requestedVote) {
    const voter = getVoterName();
    const existing = await getExistingVote(activity, voter);

    const nextVote =
      existing && existing.vote === requestedVote
        ? "none"
        : requestedVote;

    let result;

    if (existing && existing.id) {
      result = await supabaseClient
        .from("votes")
        .update({
          vote: nextVote
        })
        .eq("id", existing.id);
    } else {
      result = await supabaseClient
        .from("votes")
        .insert([
          {
            activity: activity,
            vote: nextVote,
            voter: voter
          }
        ]);
    }

    if (result.error) {
      console.error("Could not save vote:", result.error);
      alert("Vote could not be saved. Check Supabase setup.");
      return;
    }

    await loadTotals();
    await loadMyVotes();
  }

  function attachHandlers() {
    cards.forEach(function (card) {
      const activity = card.dataset.activity;
      const up = card.querySelector(".up");
      const down = card.querySelector(".down");

      if (up) {
        up.addEventListener("click", function () {
          saveVote(activity, "up");
        });
      }

      if (down) {
        down.addEventListener("click", function () {
          saveVote(activity, "down");
        });
      }
    });
  }

  attachHandlers();
  loadTotals();
  loadMyVotes();

  setInterval(loadTotals, 15000);
})();
