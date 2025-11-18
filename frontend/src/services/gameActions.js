import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// ⭐ Ensure axios sends cookies / token automatically
axios.defaults.withCredentials = true;

/*************************************************
 * ⭐ SAFE PLAY COUNTER (Frontend Cooldown)
 *************************************************/
export async function increasePlay(gameId) {
  const lastPlay = localStorage.getItem(`play_${gameId}`);
  const now = Date.now();

  // 5 min cooldown
  if (lastPlay && now - lastPlay < 5 * 60 * 1000) {
    return { ignored: true };
  }

  try {
    const res = await axios.post(`${BASE_URL}/games/${gameId}/play`);

    localStorage.setItem(`play_${gameId}`, now);
    return res.data;
  } catch (err) {
    console.log("Play count error:", err);
    return { success: false, error: true };
  }
}

/*************************************************
 * ⭐ USER-BASED RATING SYSTEM (Secure + Token Support)
 *************************************************/
export async function rateGame(gameId, stars) {
  try {
    const res = await axios.post(
      `${BASE_URL}/games/${gameId}/rate`,
      { stars },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // send token/cookies
      }
    );

    return {
      success: true,
      rating: res.data.rating,         // NEW averageRating
      totalRatings: res.data.totalRatings,
      userRating: res.data.userRating, // actual user rating
    };
  } catch (err) {
    console.log("Rating error:", err);

    const msg = err?.response?.data?.message || "Rating failed";

    if (msg === "Login required") {
      return { success: false, loginRequired: true };
    }

    return { success: false, message: msg };
  }
}
