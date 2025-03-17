// Any shared functions that does not use Cypress syntax

export function isWithinMarginSeconds(timeA: string, timeB: string, marginSeconds: number = 10) : boolean {
  const referenceTime = new Date(timeA).getTime()
  const givenTime = new Date(timeB).getTime()

  return Math.abs(referenceTime - givenTime) <= marginSeconds * 1000
}

export function getCurrentTimestamp() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
  const localTime = new Date(now.getTime() - offset).toISOString().slice(0, 19); // "YYYY-MM-DDTHH:MM:SS" (PT)
  
  return localTime;
}

export function formatTime(value: string) {
  if (value) {
    return new Date(value).toLocaleString("en-CA", {
      hourCycle: "h23",
    });
  } else {
    return "";
  }
}