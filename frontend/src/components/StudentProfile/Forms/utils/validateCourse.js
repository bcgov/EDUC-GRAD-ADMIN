import CourseService from "@/services/CourseService";

export async function validateAndFetchCourse({
  code,
  level,
  courseSession,
  studentProgram,
  existingCourses = [],
  checkExaminable = false,
  canAddExaminable = () => true,
  canAddNonExaminable = () => true,
}) {
  const cleanedSession = courseSession?.replace(
    /[&/\\#,+()$~%.'":*?<>{}-]/g,
    ""
  );
  const upperCode = code?.toUpperCase();
  const upperLevel = level?.toUpperCase() || "";

  if (!upperCode || !cleanedSession) {
    return { error: "Please fill out all course fields." };
  }

  try {
    const response = await CourseService.getCourseByCodeAndLevel(
      upperCode,
      upperLevel
    );
    const courseData = response?.data;

    if (!courseData?.courseID) {
      return {
        error:
          "Invalid Course code/level - course code/level does not exist in the ministry course registry",
      };
    }

    const isDuplicate = existingCourses.some(
      (course) =>
        course.courseID === courseData.courseID &&
        course.courseSession === courseSession
    );
    if (isDuplicate) {
      return {
        error: `The course session is a duplicate of an existing course session for this student`,
      };
    }

    const sessionDate = new Date(
      `${cleanedSession.slice(0, 4)}-${cleanedSession.slice(4, 6)}-01`
    );
    const startDate = new Date(courseData.startDate);
    const endDate = courseData.completionEndDate
      ? new Date(courseData.completionEndDate)
      : new Date(9999, 11, 31);

    if (isNaN(startDate)) return { error: "Course start date is invalid." };
    if (isNaN(endDate)) return { error: "Course completion date is invalid." };

    if (sessionDate < startDate) {
      return {
        error: `Course session date is before the course start date (${courseData.startDate})`,
      };
    }
    if (sessionDate > endDate) {
      return {
        error: `Course is closed. Session date must be before the course completion end date (${courseData.completionEndDate})`,
      };
    }

    let isExaminable = false;
    if (checkExaminable) {
      const { data: examinableCourses } =
        await CourseService.getCourseExaminableCourses();

      const matchingCourses =
        examinableCourses?.filter((course) => {
          const start = new Date(`${course.examinableStart}-01`);
          const end = course.examinableEnd
            ? new Date(`${course.examinableEnd}-01`)
            : new Date(9999, 11, 31);

          return (
            course.courseCode === upperCode &&
            course.courseLevel === upperLevel &&
            start <= sessionDate &&
            end >= sessionDate
          );
        }) || [];

      //get the year of the student program
      const studentProgramYear = studentProgram.substring(0, 4);
      if (
        studentProgramYear === "SCCP" ||
        isNaN(parseInt(studentProgramYear))
      ) {
        return {
          error:
            "This course cannot be added for the student on the" +
            studentProgram +
            " program.",
        };
      }
      const matchingProgramCourses = matchingCourses.filter((course) => {
        const examinableCourseYear = course.programYear || "2004"; // default to "2004" if empty

        if (examinableCourseYear === "2004") {
          return studentProgramYear >= examinableCourseYear;
        } else {
          return studentProgramYear === examinableCourseYear;
        }
      });

      isExaminable = matchingProgramCourses.length > 0;

      if (!isExaminable && !canAddNonExaminable()) {
        return {
          error:
            "An exam is not required for this course and session date and it cannot be entered as examinable.",
        };
      }
      if (isExaminable && !canAddExaminable()) {
        return {
          error:
            "This course required an exam at the time of the course session date. Your role does not have permission to add examinable courses.",
        };
      }
    }
    return {
      courseData,
      courseID: courseData.courseID,
      courseSession,
      isExaminable,
    };
  } catch (err) {
    if (err?.response?.data?.code === "500") {
      return {
        error: "Error connecting to the course web service",
      };
    } else {
      return {
        error:
          "Invalid Course code/level - course code/level does not exist in the ministry course registry",
      };
    }
  }
}
