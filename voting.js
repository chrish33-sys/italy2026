(function () {
  const SUPABASE_URL = "https://" + "dxfdfqaouzcqdjcfqxpa.supabase.co";
  const SUPABASE_KEY = "sb_publishable_HCnmpHVljiBGXPDx2MtvXg_mn7Wvl1-";

  if (!window.supabase) {
    console.error("Supabase library is not loaded.");
    return;
  }

  const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const cards = Array.from(document.querySelectorAll(".activity"));

  if (!cards.length) {
    console.error("No activity cards found.");
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

  function resetVoteButtons() {
    cards.forEach((card) => {
      const oldUp = card.querySelector(".up");
      const oldDown = card.querySelector(".down");

      if (oldUp) {
        const newUp = oldUp.cloneNode(true);
        oldUp.replaceWith(newUp);
      }

      if (oldDown) {
        const newDown = oldDown.cloneNode(true);
        oldDown.replaceWith(newDown);
      }
    });
  }

  function setButtonState(activity, vote) {
    const card = document.querySelector('.activity[data-activity="' + activity + '"]');
    if (!card) return;

    const up = card.querySelector(".up");
    const down = card.querySelector(".down");

    if (!up || !down) return;

    up.classList.toggle("active", vote === "up");
    down.classList.toggle("active", vote === "down");
  }

  async function loadTotals() {
    const result = await db.from("vote_totals").select("*");

    if (result.error) {
      console.error("Could not load vote totals:", result.error);
      return;
    }

    cards.forEach((card) => {
      const up = card.querySelector(".up span");
      const down = card.querySelector(".down span");

      if (up) up.textContent = "0";
      if (down) down.textContent = "0";
    });

    result.data.forEach((row) => {
      const card = document.querySelector('.activity[data-activity="' + row.activity + '"]');
      if (!card) return;

      const up = card.querySelector(".up span");
      const down = card.querySelector(".down span");

      if (up) up.textContent = row.up_votes || 0;
      if (down) down.textContent = row.down_votes || 0;
    });
  }

  async function loadMyVotes() {
    const voter = localStorage.getItem("italy2026_voter");
    if (!voter) return;

    const result = await db
      .from("votes")
      .select("activity, vote")
      .eq("voter", voter);

    if (result.error) {
      console.error("Could not load my votes:", result.error);
      return;
    }

    cards.forEach((card) => {
      const activity = card.dataset.activity;
      setButtonState(activity, "none");
    });

    result.data.forEach((row) => {
      setButtonState(row.activity, row.vote);
    });
  }

  async function getMyCurrentVote(activity, voter) {
    const result = await db
      .from("votes")
      .select("vote")
      .eq("activity", activity)
      .eq("voter", voter)
      .maybeSingle();

    if (result.error) {
      console.error("Could not check current vote:", result.error);
      return "none";
    }

    return result.data ? result.data.vote : "none";
  }

  async function saveVote(activity, requestedVote) {
    const voter = getVoterName();

    const currentVote = await getMyCurrentVote(activity, voter);

    const nextVote = currentVote === requestedVote ? "none" : requestedVote;

    const result = await db
      .from("votes")
      .upsert(
        {
          activity: activity,
          vote: nextVote,
          voter: voter
        },
        {
          onConflict: "activity,voter"
        }
      );

    if (result.error) {
      console.error("Could not save vote:", result.error);
      alert("Vote could not be saved. Check Supabase setup.");
      return;
    }

    await loadTotals();
    await loadMyVotes();
  }

  function attachVoteHandlers() {
    cards.forEach((card) => {
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

  resetVoteButtons();
  attachVoteHandlers();
  loadTotals();
  loadMyVotes();

  setInterval(loadTotals, 15000);
})();
