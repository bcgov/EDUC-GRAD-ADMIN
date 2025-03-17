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

export function base64ToFileTypeAndDownload(data: string, mimeType: string, filename: string) {
  let b64Data = data;
  let sliceSize = 512;
  let contentType = mimeType;

  const byteCharacters = atob(b64Data);

  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}