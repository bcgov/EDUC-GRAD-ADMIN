declare interface BatchJob {
  createTime: string;
  endTime: string;
  exitCode: string;
  exitMessage: string;
  id: number;
  jobExecutionId: number;
  lastUpdated: string;
  startTime: string;
  status: string;
  version: number;
}

declare interface BatchJobv2 extends BaseApiEntity {
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