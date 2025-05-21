declare interface BaseReportPayload extends BaseApiEntity {
  id: string;
  studentID: string;
  distributionDate: string;
  documentStatusCode: string;
  documentStatusLabel: string;
}