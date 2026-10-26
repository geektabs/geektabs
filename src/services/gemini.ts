export async function getInspiration(forceRefetch: boolean = false) {
  try {
    const cached = localStorage.getItem('GeekTabs-daily-quote');
    const cachedDate = localStorage.getItem('GeekTabs-daily-quote-date');
    const today = new Date().toISOString().split('T')[0];

    if (!forceRefetch && cached && cachedDate === today) {
      return JSON.parse(cached);
    }

    const response = await fetch('/api/inspiration');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const parsed = await response.json();
    
    // Save to cache
    localStorage.setItem('GeekTabs-daily-quote', JSON.stringify(parsed));
    localStorage.setItem('GeekTabs-daily-quote-date', today);

    return parsed;
  } catch (error: any) {
    console.warn("Failed to fetch inspiration:", error?.message || error);
    
    const cached = localStorage.getItem('GeekTabs-daily-quote');
    if (cached) return JSON.parse(cached);

    return { quote: "Focus on being productive instead of busy.", author: "Tim Ferriss" };
  }
}
