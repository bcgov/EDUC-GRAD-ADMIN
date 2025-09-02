const { object, string } = require('yup');
const { uuidGeneric } = require('./custom-validations');

const baseStudentNoteSchema = object({  
  note: string().max(255).required(),
  studentID: uuidGeneric().required()
});


module.exports = {  
  baseStudentNoteSchema
};
