import StudentService from "@/services/StudentService.js";

export default {
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
        if(title == "success"){
            title ="success";
            delay = 5000;
        }else if(title == "danger"){
            title ="Error";
        }else if(title == "warning"){
            title ="Warning";
        }
        this.$bvToast.toast(bodyContent, {
            title: title,
            variant: variant,
            solid: true,
            autoHideDelay: delay,
        });
    },
    base64ToFileTypeAndOpenWindow: function (data, mimeType) {
        var byteCharacters = atob(data);
        var byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        var file = new Blob([byteArray], { type: mimeType + ';base64' });
        var fileURL = URL.createObjectURL(file);        
        window.open(fileURL, '_blank');
    },   
    base64ToFileTypeData: function (data, mimeType) {
      var byteCharacters = atob(data);
      var byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      var file = new Blob([byteArray], { type: mimeType + ';base64' });
      return file;
    }, 
    getStudentID: function (pen){
      StudentService.getStudentByPen(pen).then((response) => {
        return response.data[0].studentID;
      }).catch((error) => {
        // eslint-disable-next-line
        console.log(error)
      });            
    },
    getStudentPen: function (studentID){
      StudentService.getStudentPen(studentID).then((response) => {
        return response.data.pen;
      }).catch((error) => {
        // eslint-disable-next-line
        console.log(error);
      });
    },      
    loadStudent: function (student) {
      this.selectedPen = student[0].pen;
      this.selectedId = student[0].studentID;
      this.$router.push({
        path: `/student-profile/${this.selectedId}`
      });
    },
}