import StudentService from "@/services/StudentService.js";

export default {
    getStudentStatus(code, studentStatusOptions) {
        for (var i = 0; i <= studentStatusOptions.length; i++) {
          if (studentStatusOptions[i].code == code) {
            return studentStatusOptions[i].label;
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
        for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        var file = new Blob([byteArray], { type: mimeType + ';base64' });
        var fileURL = URL.createObjectURL(file);        
        window.open(fileURL);
    },   
    base64ToFileTypeData: function (data, mimeType) {
      var byteCharacters = atob(data);
      var byteNumbers = new Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      var file = new Blob([byteArray], { type: mimeType + ';base64' });
      return file;
    },       
    loadStudent: function (student) {
        this.selectedPen = student[0].pen;
        this.selectedId = student[0].studentID;
        let path = 'student-profile';
        var currentRoute =  this.$route.path.split("/").slice(1)[0];

        this.$router.push({
          path: `/student-profile/${this.selectedId}`
        });
        //Used for reloading if on the same Student Profile page  
        if(path == currentRoute){
          location.reload();
        }
    },
    saveGraduationStatus(id) {
        //add the user info
        this.editedGradStatus.updatedBy = this.username;
        this.editedGradStatus.studentID = id;
        this.editedGradStatus.pen = this.studentPen;
        //process the program completion date
        if(this.editedGradStatus.programCompletionDate == ''){
          this.editedGradStatus.programCompletionDate = null;
        }
        if(this.editedGradStatus.programCompletionDate != null){
          this.editedGradStatus.programCompletionDate = this.editedGradStatus.programCompletionDate.replace("/", "-");
          var date;
          try{
            date = new Date(this.editedGradStatus.programCompletionDate);
            this.editedGradStatus.programCompletionDate = date.toISOString().split('T')[0];
          }catch(error){
            // eslint-disable-next-line
            console.log(error);
          }
        }
        if(this.editedGradStatus.schoolOfRecord == ''){
          this.editedGradStatus.schoolOfRecord = null;
        }
        if(this.editedGradStatus.schoolAtGrad == ''){
          this.editedGradStatus.schoolAtGrad = null;
        }
  
        StudentService.editGraduationStatus(
          id,
          this.editedGradStatus
        )
        .then((response) => {
          this.updateStatus = response.data;
          this.studentGradStatus.pen = response.data.pen;
          this.studentGradStatus.program = response.data.program;
          this.studentGradStatus.programCompletionDate = response.data.programCompletionDate;
          this.studentGradStatus.honoursStanding = response.data.honoursStanding;
          this.studentGradStatus.gpa = response.data.gpa;
          this.studentGradStatus.studentGrade = response.data.studentGrade;
          this.studentGradStatus.schoolName = this.editedGradStatus.schoolName;
          this.studentGradStatus.schoolOfRecord = response.data.schoolOfRecord;
          this.studentGradStatus.schoolAtGradName = this.editedGradStatus.schoolAtGradName;
          this.studentGradStatus.schoolAtGrad = response.data.schoolAtGrad;
          this.studentGradStatus.studentStatus = response.data.studentStatus;
          this.studentGradStatus.recalculateGradStatus = response.data.recalculateGradStatus;
          this.studentGradStatus.updatedTimestamp = response.data.updatedTimestamp;
          this.studentGradStatus.studentStatusName = this.getStudentStatus(
            response.data.studentStatus
          );         
          this.showTop = !this.showTop;
          this.showEdit = false;
          //Update the student audit history
          this.$store.dispatch("updateStudentAuditHistory");
          this.showNotification("success", "GRAD Status Saved");
        })
        .catch((error) => {
          if(this.editedGradStatus.programCompletionDate != null){
            this.editedGradStatus.programCompletionDate = this.editedGradStatus.programCompletionDate.replace("-", "/").substring(0, 7);
          }         
          if(error.response.data){
            if(error.response.data.messages){
              this.errorMessage = error.response.data.messages[0].message;
            }
          }
          this.showNotification(
            "danger",
            this.errorMessage
          );
        });
      },
}