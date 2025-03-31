declare interface BatchJob extends BaseApiEntity {
  actualStudentProcesssed: number;
  endTime: string;
  expectedStudentsProcessed: number;
  failedStudentsProcessed: number;
  id: string;
  jobExecutionId: number;
  jobParameters: string;
  jobType: string;
  localDownload: boolean;
  startTime: string;
  status: string;
  triggerBy: string;
} 