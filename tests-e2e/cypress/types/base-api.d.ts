declare interface BaseApiEntity {
  createUser: string;
  updateUser: string;
  createDate: string;
  updateDate: string;
}

declare interface paginationApiEntity {
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
}