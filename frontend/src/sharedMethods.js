import StudentService from "@/services/StudentService.js";

export default {
  applyDisplayOrder(unsorted) {
    return unsorted?.sort((a, b) => a.displayOrder - b.displayOrder);
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
  showNotification: function (variant, bodyContent) {
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
  isValidDateString(value) {
    // Regular expression for YYYY-MM-DD format
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(value);
  },
  jobLabel(jobId) {
    return this.jobId.replace("job-", "");
  },
};
