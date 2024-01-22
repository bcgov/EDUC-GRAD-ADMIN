export function base64ToFileTypeAndOpenWindow(data, mimeType) {
  let byteCharacters = atob(data);
  let byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  let byteArray = new Uint8Array(byteNumbers);
  let file = new Blob([byteArray], { type: mimeType + ";base64" });
  let fileURL = URL.createObjectURL(file);
  window.open(fileURL);
}
export function containsAnyLetters(str) {
  return /[a-zA-Z]/.test(str);
}
export function isEnvLocalHost() {
  return location.host.includes("localhost");
}
export function loadStudent(student) {
  this.selectedPen = student[0].pen;
  this.selectedId = student[0].studentID;
  this.$router.push({
    path: `/student-profile/${this.selectedId}`,
  });
}
export function parseStudentStatus(code, studentStatusOptions) {
  for (let studentStatusOption of studentStatusOptions) {
    if (studentStatusOption.code == code) {
      return studentStatusOption.label;
    }
  }
  return "";
}
export function showNotification(variant, bodyContent) {
  let title = variant;
  let delay = 30000;
  if (title == "success") {
    title = "success";
    delay = 5000;
  } else if (title == "danger") {
    title = "Error";
  } else if (title == "warning") {
    title = "Warning";
  }
  this.$bvToast.toast(bodyContent, {
    title: title,
    variant: variant,
    solid: true,
    autoHideDelay: delay,
  });
}
