const now = new Date();
function getOffsetStr(tz) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    timeZoneName: "shortOffset"
  }).formatToParts(now);
  const part = parts.find(p => p.type === 'timeZoneName');
  return part ? part.value : "";
}

console.log(getOffsetStr("UTC"));
console.log(getOffsetStr("Asia/Kolkata"));
