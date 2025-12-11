'use strict';

function generateCourseObject(course) {
  // Parse externalCode to extract courseCode (first 5 chars) and courseLevel (last digits)
  let courseCode = '';
  let courseLevel = '';

  if (course.externalCode) {
    const externalCode = String(course.externalCode);

    // 38 uses hyphen separator
    if (course.originatingSystem === '38' && externalCode.includes('-')) {
      const parts = externalCode.split('-');
      courseCode = parts[0].trim();
      courseLevel = parts[1] ? parts[1].trim() : '';
    }
    // 39 uses space separator
    else if (course.originatingSystem === '39') {
      const cleanCode = externalCode.replace(/\s+/g, '');
      if (cleanCode.length >= 5) {
        courseCode = cleanCode.substring(0, 5);
        courseLevel = cleanCode.substring(5);
      } else {
        courseCode = cleanCode;
      }
    }
    // Fallback
    else {
      const cleanCode = externalCode.replace(/[\s-]/g, '');
      if (cleanCode.length >= 5) {
        courseCode = cleanCode.substring(0, 5);
        courseLevel = cleanCode.substring(5);
      } else {
        courseCode = cleanCode;
      }
    }
  }

  return {
    courseID: course.courseID,
    courseCode: courseCode,
    courseLevel: courseLevel,
    externalCode: course.externalCode,
    originatingSystem: course.originatingSystem
  };
}

module.exports = {
  generateCourseObject: generateCourseObject,
};
