const { object, string, number } = require('yup');

const getPaginatedPSISchema = object({
  body: object().noUnknown(),
  query: object({
    pageNumber: number().integer().required(),
    pageSize: number().integer().required(),
    searchParams: object({
      psiCode: string().optional(),
      psiName: string().optional(),
      cslCode: string().optional(),
      openFlag: string().optional(),
      transmissionMode: string().optional(),
    })
      .required()
      .noUnknown(),
    sort: object({
      psiCode: string().oneOf(['ASC', 'DESC']).optional(),
      psiName: string().oneOf(['ASC', 'DESC']).optional(),
    })
      .optional()
      .noUnknown(),
  }).noUnknown(),
  params: object().noUnknown(),
}).noUnknown();

module.exports = {
  getPaginatedPSISchema,
};
