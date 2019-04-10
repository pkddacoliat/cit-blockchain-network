/**
 * A transaction to assign a grade to a student
 * @param {ie.cit.blockchain.grade.AssignGrade} gradeData
 * @transaction
 */

async function assignGrade(gradeData) {

    // Get the student registry
    let studentRegistry = await getParticipantRegistry(
      "ie.cit.blockchain.participant.CITStudent"
    );

    // Add the grade to the student's list of grades
    gradeData.student.grades.push(gradeData.grade);
    
    // Add the credits to the student if the grade is a pass or more
    if(gradeData.grade.finalGrade >= 40) {
      gradeData.student.currentCredits += gradeData.grade.module.credits;
    }
    
    // Update the student registry
    await studentRegistry.update(gradeData.student);

    // Todo: Emit an event.
  }
  