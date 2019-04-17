/**
 * A transaction to enroll a student to a course
 * @param {ie.cit.blockchain.course.EnrollStudent} courseData
 * @transaction
 */

async function enrollStudent(courseData) {
	let studentRegistry = await getParticipantRegistry("ie.cit.blockchain.participant.CITStudent");
  	let student = await studentRegistry.get(courseData.studentNumber);
  	let factory = getFactory();
  	
  	if (!student.course) {
      let course = factory.newResource("ie.cit.blockchain.course", "Course", courseData.courseCode);
      student.course = course;
      student.currentCredits = 0;
      student.grades = [];	
      await studentRegistry.update(student);
    }
  	else {
      throw new Error("Student already enrolled in a course.");
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
  	
  	let module = factory.newRelationship("ie.cit.blockchain.module", "Module", gradeData.moduleCRN);
    grade.module = module;
  
  	let student = factory.newRelationship("ie.cit.blockchain.participant", "CITStudent", gradeData.studentNumber);
  	grade.student = student;
  
    let studentRegistry = await getParticipantRegistry("ie.cit.blockchain.participant.CITStudent");
    let studentInfo = await studentRegistry.get(gradeData.studentNumber);
  
  	let moduleRegistry = await getAssetRegistry("ie.cit.blockchain.module.Module");
  	let moduleInfo = await moduleRegistry.get(gradeData.moduleCRN);
  	
  	if(!studentInfo.course) {
      throw new Error("Student is not enrolled to a course.");
    }
  	else{
      if(gradeData.finalGrade >= 40) {
        studentInfo.grades.push(grade);
      	studentInfo.currentCredits += moduleInfo.credits;
      }
      else {
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
