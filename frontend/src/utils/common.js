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
/**
 * SORTING
 */

// DUPLICATE - function is duplicated in sharedMethods; TODO Refactor uses of applyDisplayOrder() in batch before moving here
export function applyDisplayOrder(unsorted) {
  return unsorted?.sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 *  VALIDATION FUNCTIONS
 */
export function isEnvLocalHost() {
  return location.host.includes("localhost");
}

export function containsAnyLetters(str) {
  return /[a-zA-Z]/.test(str);
}

export function isMincode(mincode) {
  return !(mincode.length != 8 || containsAnyLetters(mincode));
}

/**
 * TEMPORARY validation until institute API is implemented with better method to identify schools offering Program Francaphone
 * @param {string} mincode
 * @returns true if mincode entered belongs to PF school; false otherwise or if mincode is not a valid format (8-digit string)
 */
export function isPFSchool(mincode) {
  // other schools that offer *-PF that don't belong to district 093
  const otherPFSchools = ["09898009", "09898047"];

  return !!(
    isMincode(mincode) &&
    (mincode.search(/^093.*/) >= 0 ||
      otherPFSchools.find((pfSchool) => pfSchool == mincode))
  );
}

export function isProgramComplete(completionDate, programCode) {
  console.debug(
    "DEBUG: Program is Complete data:\n completionDate - " +
      completionDate +
      "\n programCode - " +
      programCode
  );

  if (programCode === "SCCP") {
    let today = new Date();
    return !!completionDate && new Date(completionDate) <= today;
  } else {
    return !!completionDate;
  }
}

export function isProgramPF(program) {
  return program.includes("PF");
}
