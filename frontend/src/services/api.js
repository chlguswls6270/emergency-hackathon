// API Service separating endpoints and frontend
// Base URL from the FastAPI server, but can mock data directly if Backend is down.

const IS_LOCAL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE = IS_LOCAL 
  ? 'http://localhost:8000/api' 
  : (import.meta.env.VITE_API_URL || 'https://emergency-hackathon.onrender.com/api');

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
  async fetchRankings(days = null) {
    try {
      const qs = days ? `?days=${days}` : '';
      const res = await fetch(`${API_BASE}/rankings${qs}`);
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

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

  async deleteCamp(teamCode) {
    let locals = getLocalItem('local_camps', []);
    locals = locals.filter(c => c.teamCode !== teamCode);
    setLocalItem('local_camps', locals);
    return { success: true };
  },

  async fetchLeaderboard(hackathonSlug) {
    const locals = getLocalItem(`local_subs_${hackathonSlug}`, []);
    try {
      const qs = hackathonSlug ? `?hackathon=${hackathonSlug}` : '';
      const res = await fetch(`${API_BASE}/leaderboard${qs}`);
      const serverData = await res.json();
      
      const combined = [...(serverData.entries || []), ...locals];
      
      // Basic sorting descending (assumes number score or simply leaves pending at bottom)
      combined.sort((a, b) => {
        if (a.score === 'Pending') return 1;
        if (b.score === 'Pending') return -1;
        return (b.score || 0) - (a.score || 0);
      });
      // Re-assign ranks
      combined.forEach((item, index) => {
        if (item.score !== 'Pending') {
           item.rank = index + 1;
        }
      });
      
      return { ...serverData, entries: combined };
    } catch (e) {
      // Fallback mock
      return { entries: locals };
    }
  },

  async submitProject(hackathonSlug, formData) {
    const key = `local_subs_${hackathonSlug}`;
    const locals = getLocalItem(key, []);
    try {
      const res = await fetch(`${API_BASE}/submit`, {
        method: 'POST',
        body: formData // No custom headers, let browser set boundary automatically
      });
      const data = await res.json();
      
      locals.push({
        rank: '-', 
        teamName: data.teamCode || formData.get('teamCode'), 
        score: 'Pending',
        submittedAt: new Date().toISOString(),
        isLocal: true,
        artifactFilename: data.filename
      });
      setLocalItem(key, locals);
      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false };
    }
  },

  async undoSubmit(hackathonSlug, teamCode) {
    const key = `local_subs_${hackathonSlug}`;
    let locals = getLocalItem(key, []);
    locals = locals.filter(sub => sub.teamName !== teamCode);
    setLocalItem(key, locals);
    return { success: true };
  },

  async sendOffer(hackathonSlug, toTeamCode, fromUserOrTeam) {
    const key = `local_offers_${hackathonSlug || 'global'}`;
    const offers = getLocalItem(key, []);
    offers.push({
      id: Date.now().toString(),
      toTeamCode,
      fromUserOrTeam,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    setLocalItem(key, offers);
    return { success: true };
  },

  async getOffers(hackathonSlug, teamCode) {
    const key = `local_offers_${hackathonSlug || 'global'}`;
    const offers = getLocalItem(key, []);
    return offers.filter(o => o.toTeamCode === teamCode);
  },

  async updateOffer(hackathonSlug, offerId, status) {
    const key = `local_offers_${hackathonSlug || 'global'}`;
    let offers = getLocalItem(key, []);
    offers = offers.map(o => o.id === offerId ? { ...o, status } : o);
    setLocalItem(key, offers);
    return { success: true };
  },

  // Hackathon participation specific endpoints
  getParticipations() {
    return getLocalItem('my_participations', []);
  },
  participateInHackathon(hackathon) {
    const list = this.getParticipations();
    if (!list.find(h => h.slug === hackathon.slug)) {
      list.push({ slug: hackathon.slug, title: hackathon.title, joinedAt: new Date().toISOString() });
      setLocalItem('my_participations', list);
    }
    return { success: true };
  },
  cancelParticipation(slug) {
    let list = this.getParticipations();
    list = list.filter(h => h.slug !== slug);
    setLocalItem('my_participations', list);
    return { success: true };
  }
};
