const tzOffsetHours = (tz) => {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "shortOffset" }).formatToParts(new Date());
  const tzName = parts.find(p => p.type === "timeZoneName")?.value || "";
  let hours = 0;
  if (tzName.includes("+") || tzName.includes("-")) {
     const sign = tzName.includes("-") ? -1 : 1;
     const timePart = tzName.split(/[+-]/)[1];
     const [h, m] = timePart.split(":");
     hours = sign * (parseInt(h, 10) + (m ? parseInt(m, 10)/60 : 0));
  }
  return hours;
}

console.log(tzOffsetHours("America/New_York"));
console.log(tzOffsetHours("Asia/Tokyo"));
console.log(tzOffsetHours("UTC"));
console.log(tzOffsetHours("Asia/Kolkata"));
