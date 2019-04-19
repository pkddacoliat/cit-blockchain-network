/**
 * A transaction to enroll a student to a course
 * @param {ie.cit.blockchain.course.EnrollStudent} courseData
 * @transaction
 */

async function enrollStudent(courseData) {
  // Get the factory
  let factory = getFactory();

  // Get the student registry
  let studentRegistry = await getParticipantRegistry(
    "ie.cit.blockchain.participant.Student"
  );

  // Check if student exists in the registry
  let studentExists = await studentRegistry.exists(courseData.studentNumber);

  // If student does not exists, throw an error
  if (!studentExists) {
    throw new Error("Student does not exists in the registry.");
  } else {
    // If the student exists, get the instance of it from the registry
    let student = await studentRegistry.get(courseData.studentNumber);

    // Check if student is already enrolled in a course
    if (student.course) {
      throw new Error("Student is already enrolled in a course.");
    } else {
      // Get the course registry
      let courseRegistry = await getAssetRegistry(
        "ie.cit.blockchain.course.Course"
      );

      // Check if course exists in the registry
      let courseExists = await courseRegistry.exists(courseData.courseCode);

      // If course does not exists, throw an error
      if (!courseExists) {
        throw new Error("Course does not exists in the registry.");
      } else {
        // If course exists, then create a relationship with the student
        // and initialise all the other properties of the student
        let studentCourse = factory.newRelationship(
          "ie.cit.blockchain.course",
          "Course",
          courseData.courseCode
        );
        student.course = studentCourse;
        student.currentCredits = 0;
        student.grades = [];
        student.graduated = false;

        // Create a relationship with the student and the issuing college which is CIT
        let issuerRegistry = await getParticipantRegistry(
          "ie.cit.blockchain.participant.Issuer"
        );

        // Check if CIT exists in the registry
        let CITExists = await issuerRegistry.exists("CIT");

        // If course does not exists, create a new instance of it
        if (!CITExists) {
          let CIT = factory.newResource(
            "ie.cit.blockchain.participant",
            "Issuer",
            "CIT"
          );
          CIT.collegeName = "Cork Institute of Technology";
          await issuerRegistry.add(CIT);
        }

        // Create a relationship between student and CIT
        let studentCollege = factory.newRelationship(
          "ie.cit.blockchain.participant",
          "Issuer",
          "CIT"
        );
        student.college = studentCollege;

        // Update the student information in the registry
        await studentRegistry.update(student);
      }
    }
  }
}

/**
 * A transaction to assign a grade to a student
 * @param {ie.cit.blockchain.grade.AssignGrade} gradeData
 * @transaction
 */

async function assignGrade(gradeData) {
  let gradeRegistry = await getAssetRegistry("ie.cit.blockchain.grade.Grade");
  let factory = getFactory();
  let namespace = "ie.cit.blockchain.grade";

  let gradeId = generateGradeId(gradeData.studentNumber, gradeData.moduleCRN);
  let grade = factory.newResource(namespace, "Grade", gradeId);
  grade.finalGrade = gradeData.finalGrade;

  let module = factory.newRelationship(
    "ie.cit.blockchain.module",
    "Module",
    gradeData.moduleCRN
  );
  grade.module = module;

  let student = factory.newRelationship(
    "ie.cit.blockchain.participant",
    "Student",
    gradeData.studentNumber
  );
  grade.student = student;

  let studentRegistry = await getParticipantRegistry(
    "ie.cit.blockchain.participant.Student"
  );
  let studentInfo = await studentRegistry.get(gradeData.studentNumber);

  let moduleRegistry = await getAssetRegistry(
    "ie.cit.blockchain.module.Module"
  );
  let moduleInfo = await moduleRegistry.get(gradeData.moduleCRN);

  if (!studentInfo.course) {
    throw new Error("Student is not enrolled to a course.");
  } else {
    if (gradeData.finalGrade >= 40) {
      studentInfo.grades.push(grade);
      studentInfo.currentCredits += moduleInfo.credits;
    } else {
      throw new Error("Student failed the module.");
    }
  }

  await gradeRegistry.add(grade);
  await studentRegistry.update(studentInfo);
}

// Create ID for the grade by joining the student number with the module CRN
function generateGradeId(studentNumber, moduleCRN) {
  return studentNumber.concat("_", moduleCRN);
}
