// API Service separating endpoints and frontend
// Base URL from the FastAPI server, but can mock data directly if Backend is down.

const API_BASE = 'http://localhost:8000/api';

// localStorage Helpers
export const getLocalItem = (key, defaultVal) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (error) {
    return defaultVal;
  }
};

export const setLocalItem = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error setting localStorage", error);
  }
};

// Services
export const apiConfig = {
  async fetchHackathons() {
    try {
      const res = await fetch(`${API_BASE}/hackathons`);
      return res.json();
    } catch (e) {
      console.error(e);
      // Fallback or empty state if API is down
      return [];
    }
  },

  async fetchHackathonDetail(slug) {
    try {
      const res = await fetch(`${API_BASE}/hackathons/${slug}`);
      if (!res.ok) throw new Error('Not found');
      return res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  async fetchCampData(hackathonSlug = null) {
    // According to specs, teams should also mix local creations.
    const locals = getLocalItem('local_camps', []);
    try {
      const qs = hackathonSlug ? `?hackathon=${hackathonSlug}` : '';
      const res = await fetch(`${API_BASE}/camp${qs}`);
      const serverData = await res.json();
      return [...serverData, ...locals];
    } catch (e) {
      return locals;
    }
  },

  async createCamp(campData) {
    const locals = getLocalItem('local_camps', []);
    locals.push({ ...campData, teamCode: `T-LOCAL-${Date.now()}` });
    setLocalItem('local_camps', locals);
    return { success: true };
  },

  async fetchLeaderboard(hackathonSlug) {
    const locals = getLocalItem(`local_subs_${hackathonSlug}`, []);
    try {
      const qs = hackathonSlug ? `?hackathon=${hackathonSlug}` : '';
      const res = await fetch(`${API_BASE}/leaderboard${qs}`);
      const serverData = await res.json();
      // Combine logically based on requirements later
      return serverData;
    } catch (e) {
      // Fallback mock
      return { entries: locals };
    }
  },

  async submitProject(hackathonSlug, payload) {
    const key = `local_subs_${hackathonSlug}`;
    const locals = getLocalItem(key, []);
    // Ensure we don't have dupes, simplistically adding
    locals.push({
      rank: '-', // Unset until approved
      teamName: payload.teamCode, // For mock
      score: 'Pending',
      submittedAt: new Date().toISOString()
    });
    setLocalItem(key, locals);
    return { success: true };
  }
};
