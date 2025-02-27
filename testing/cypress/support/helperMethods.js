// Any shared functions that does not use Cypress syntax

export function isWithinMarginSeconds(timeA, timeB, marginSeconds = 10) {
  const referenceTime = new Date(timeA).getTime()
  const givenTime = new Date(timeB).getTime()

  return Math.abs(referenceTime - givenTime) <= marginSeconds * 1000
}

export function getCurrentTimestamp() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
  const localTime = new Date(now - offset).toISOString().slice(0, 19); // "YYYY-MM-DDTHH:MM:SS" (PT)
  
  return localTime;
}