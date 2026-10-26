const now = new Date("2026-05-19T01:33:24Z");
const tz = 'America/New_York';
console.log(new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short', hour: '2-digit', minute: '2-digit' }).format(now));
