declare interface BaseStudentApiEntity extends BaseApiEntity {
  pen: string;
  studentID: string;
  program: string;
  programCompletionDate: string;
  gpa: string;
  batchId: string;
  studentGrade: string;
  studentGradData: string;
  studentProjectedGradData: string;
  studentStatus: string;
  legalFirstName: string;
  legalMiddleNames: string;
  legalLastName: string;
  schoolAtGradId: string;
  schoolOfRecordId: string;
  adultStartDate: string;
  consumerEducationRequirementMet: string;
  honoursStanding: string;
  recalculateGradStatus: string;
  recalculateProjectedGrad: string;
  studentCitizenship: string;
}

declare interface StudentHistoryApiEntity extends BaseStudentApiEntity {
  activityCode: string;
  activityDescription?: string;
  batchId: string;
}

declare interface StudentIdApiEntity extends BaseStudentApiEntity {
  schoolName: string;
  schoolAtGradName: string;
  studentStatusName: string;
  careerPrograms: [];
  optionalPrograms: [];
  nonGradReasons: [];
}