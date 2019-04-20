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

        // If course does not exists, create a new asset for it
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
  // Get the factory
  let factory = getFactory();

  // Get the module registry
  let moduleRegistry = await getAssetRegistry(
    "ie.cit.blockchain.module.Module"
  );

  // Check if module exists in the registry
  let moduleExists = await moduleRegistry.exists(gradeData.moduleCRN);

  // If module does not exists, throw an error
  if (!moduleExists) {
    throw new Error("Module does not exists in the registry.");
  } else {
    // Get the student registry
    let studentRegistry = await getParticipantRegistry(
      "ie.cit.blockchain.participant.Student"
    );

    // Check if student exists in the registry
    let studentExists = await studentRegistry.exists(gradeData.studentNumber);

    // If student does not exists, throw an error
    if (!studentExists) {
      throw new Error("Student does not exists in the registry.");
    } else {
      // Get the grade registry
      let gradeRegistry = await getAssetRegistry(
        "ie.cit.blockchain.grade.Grade"
      );

      // Generate an ID for the new grade
      let gradeId = generateGradeId(
        gradeData.studentNumber,
        gradeData.moduleCRN
      );

      // Check if grade already exists in the registry
      let gradeExists = await gradeRegistry.exists(gradeId);

      // If grade already exists, throw an error
      if (gradeExists) {
        throw new Error("Grade already exists in the registry");
      } else {
        // If the grade does not exists yet, create a new asset for it
        let grade = factory.newResource(
          "ie.cit.blockchain.grade",
          "Grade",
          gradeId
        );
        grade.finalGrade = gradeData.finalGrade;

        // Create a relationship between the module and the grade
        let module = factory.newRelationship(
          "ie.cit.blockchain.module",
          "Module",
          gradeData.moduleCRN
        );
        grade.module = module;

        // Create a relationship between the student and the grade
        let student = factory.newRelationship(
          "ie.cit.blockchain.participant",
          "Student",
          gradeData.studentNumber
        );
        grade.student = student;

        // Get the instance of the student from the registry
        let studentInstance = await studentRegistry.get(
          gradeData.studentNumber
        );

        // Get the instance of the module from the registry
        let moduleInstance = await moduleRegistry.get(gradeData.moduleCRN);

        // Check if student is enrolled in a course, if not throw an error
        if (!studentInstance.course) {
          throw new Error("Student is not enrolled to a course.");
        } else {
          // Check if the grade is equal or greater than a pass
          if (gradeData.finalGrade >= 40) {
            // Add the grade to the student's list of grades
            studentInstance.grades.push(grade);
            // Add the number of credits for the module to the total
            // number of credits the student have
            studentInstance.currentCredits += moduleInstance.credits;

            // Get the course registry
            let courseRegistry = await getAssetRegistry(
              "ie.cit.blockchain.course.Course"
            );

            // Get the instance of the course of the student
            let course = await courseRegistry.get(
              studentInstance.course.getIdentifier()
            );

            // Check if the current credits of student is equal to the total credits needed for the course
            // If so, change the value of the graduated property to TRUE to represent that the student
            // has accummulated the credits needed to finish the course
            if (studentInstance.currentCredits == course.totalCredits) {
              studentInstance.graduated = true;
            }
          } else {
            // Throw an error if the student failed the module
            throw new Error("Student failed the module.");
          }
        }

        // Update the grade and student registries
        await gradeRegistry.add(grade);
        await studentRegistry.update(studentInstance);
      }
    }
  }
}

// Create ID for the grade by joining the student number with the module CRN
function generateGradeId(studentNumber, moduleCRN) {
  return studentNumber.concat("_", moduleCRN);
}
