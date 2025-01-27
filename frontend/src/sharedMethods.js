import StudentService from "@/services/StudentService.js";
import InstituteService from "./services/InstituteService";
export default {
  applyDisplayOrder(unsorted) {
    return unsorted.sort((a, b) => a.displayOrder - b.displayOrder);
  },
  isEnvLocalHost() {
    return location.host.includes("localhost");
  },
  containsAnyLetters(str) {
    return /[a-zA-Z]/.test(str);
  },
  getStudentStatus(code, studentStatusOptions) {
    for (let studentStatusOption of studentStatusOptions) {
      if (studentStatusOption.code == code) {
        return studentStatusOption.label;
      }
    }
    return "";
  },
  getCronTime() {
    if (this.batchRunSchedule == "N") {
      let today = new Date();
      return "0 30 18 " + today.getDate() + " " + (today.getMonth() + 1) + " *";
    } else if (this.batchRunSchedule == "W") {
      const today = new Date();
      const first = today.getDate() - today.getDay() + 1;
      const sixth = first + 5;
      const saturday = new Date(today.setDate(sixth));
      return (
        "0 30 18 " + saturday.getDate() + " " + (saturday.getMonth() + 1) + " *"
      );
    } else if (this.batchRunSchedule == "M") {
      const today = new Date();
      let tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return (
        "0 30 18 " + tomorrow.getDate() + " " + (tomorrow.getMonth() + 1) + " *"
      );
    } else if (this.batchRunSchedule == "Custom") {
      let dateTime = new Date(
        this.batchRunCustomDate + "T" + this.batchRunCustomTime
      );
      return (
        dateTime.getSeconds() +
        " " +
        dateTime.getMinutes() +
        " " +
        dateTime.getHours() +
        " " +
        dateTime.getDate() +
        " " +
        (dateTime.getMonth() + 1) +
        " *"
      );
    } else {
      return null;
    }
  },
  base64ToFileTypeAndOpenWindow: function (data, mimeType) {
    let byteCharacters = atob(data);
    let byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    let byteArray = new Uint8Array(byteNumbers);
    let file = new Blob([byteArray], { type: mimeType + ";base64" });
    let fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  },
  base64ToFileTypeAndDownload: function (data, mimeType, filename) {
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
  },
  getStudentID: function (pen) {
    StudentService.getStudentByPen(pen)
      .then((response) => {
        return response.data[0].studentID;
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.log(error);
      });
  },
  getStudentPen: function (studentID) {
    StudentService.getStudentPen(studentID)
      .then((response) => {
        return response.data.pen;
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.log(error);
      });
  },
  loadStudent: function (student) {
    this.selectedPen = student[0].pen;
    this.selectedId = student[0].studentID;
    this.$router.push({
      path: `/student-profile/${this.selectedId}`,
    });
  },
  dateFormatYYYYMM(value) {
    return value.replace(/^([\d]{4})([\d]{2})$/, "$1-$2");
  },
  dateFormatYYYYMMDD(value) {
    return value.replace(/^([\d]{4})([\d]{2})([\d]{2})$/, "$1-$2-$3");
  },
  jobLabel(jobId) {
    return this.jobId.replace("job-", "");
  },
  sortDistrictListByActiveAndDistrictNumber(districtsList) {
    if (!districtsList) return [];
  
    return districtsList.sort((a, b) => {
      // First, prioritize districts with districtStatusCode "ACTIVE"
      if (a.districtStatusCode === "ACTIVE" && b.districtStatusCode !== "ACTIVE") {
        return -1; // "ACTIVE" comes first
      }
      if (a.districtStatusCode !== "ACTIVE" && b.districtStatusCode === "ACTIVE") {
        return 1; // "ACTIVE" comes first
      }
  
      // Second, sort by districtNumber (as numeric, handling strings like "103", "005", etc.)
      const aNumber = parseInt(a.districtNumber, 10);
      const bNumber = parseInt(b.districtNumber, 10);
  
      return aNumber - bNumber; // Numeric sorting
    });
  },
  sortSchoolListByTranscriptsAndMincode(schoolsList) {
    if (!schoolsList) return [];
    //remove special characters from displayname by overwriting with displayNameNoSpecialChars
    schoolsList.forEach(school => {
      const displayNameNoSpecialChars = school.displayNameNoSpecialChars;
      if (displayNameNoSpecialChars) {
        school.displayName = displayNameNoSpecialChars;
      }
    });

    return [...schoolsList].sort((a, b) => {
      // Sort by canIssueCertificates first (descending - true values first)
      if (a.canIssueTranscripts && !b.canIssueTranscripts) {
        return -1;
      } else if (!a.canIssueTranscripts && b.canIssueTranscripts) {
        return 1;
      }
      // If canIssueTranscripts is the same, sort by mincode (ascending)
      return a.mincode.localeCompare(b.mincode);
    });
  },
  getSchoolById(schools, schoolId) {
    return schools.find((school) => school.schoolId === schoolId) || null;
  },
};
