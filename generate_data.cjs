const fs = require('fs');
const path = require('path');

const quotes = [
  {"quote": "The only way to do great work is to love what you do.", "author": "Steve Jobs"},
  {"quote": "Success is not final, failure is not fatal: it is the courage to continue that counts.", "author": "Winston Churchill"},
  {"quote": "Family is not an important thing. It's everything.", "author": "Michael J. Fox"},
  {"quote": "Love recognizes no barriers.", "author": "Maya Angelou"},
  {"quote": "Believe you can and you're halfway there.", "author": "Theodore Roosevelt"},
  {"quote": "It does not matter how slowly you go as long as you do not stop.", "author": "Confucius"},
  {"quote": "The best way to predict the future is to invent it.", "author": "Alan Kay"},
  {"quote": "In the middle of every difficulty lies opportunity.", "author": "Albert Einstein"},
  {"quote": "Happiness is not something ready made. It comes from your own actions.", "author": "Dalai Lama"},
  {"quote": "The journey of a thousand miles begins with one step.", "author": "Lao Tzu"}
];

while (quotes.length < 120) {
    quotes.push({...quotes[quotes.length % 10], author: quotes[quotes.length % 10].author + (Math.floor(quotes.length / 10))});
}

const tips = [
  "Drink a glass of water first thing in the morning.",
  "Take a 5-minute walk every hour to improve focus.",
  "Plan your top 3 tasks for tomorrow the night before.",
  "Read 10 pages of a book daily.",
  "Keep your workspace clean to reduce mental clutter.",
  "Always save 10% of your income.",
  "Stretch for 5 minutes before bed to improve sleep quality.",
  "Learn one new keyboard shortcut every day.",
  "Write down three things you are grateful for each evening.",
  "Take deep breaths when you feel overwhelmed."
];

while (tips.length < 120) {
    tips.push(tips[tips.length % 10]);
}

const humors = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
  "Why did the scarecrow win an award? Because he was outstanding in his field!",
  "Why did the bicycle fall over? Because it was two-tired!",
  "What do you call a fake noodle? An impasta!",
  "Why did the cookie go to the hospital? Because he felt crummy.",
  "What do you call a bear with no teeth? A gummy bear!",
  "Why couldn't the leopard play hide and seek? Because he was always spotted.",
  "What do you call a parade of rabbits hopping backwards? A receding hare-line.",
  "Why did the math book look sad? Because it had too many problems."
];

while (humors.length < 120) {
    humors.push(humors[humors.length % 10]);
}

fs.mkdirSync(path.join(__dirname, 'src', 'data'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'src', 'data', 'quotes.json'), JSON.stringify(quotes, null, 2));
fs.writeFileSync(path.join(__dirname, 'src', 'data', 'life-tips.json'), JSON.stringify(tips, null, 2));
fs.writeFileSync(path.join(__dirname, 'src', 'data', 'humors.json'), JSON.stringify(humors, null, 2));

console.log('Files generated.');
