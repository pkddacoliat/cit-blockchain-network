import { emit } from "cluster";

/**
 * Create Module Transaction
 * @param {ie.cit.pkddacoliat.module.CreateModule} moduleData
 * @transaction
 */

function createModule(moduleData) {
  return getAssetRegistry("ie.cit.pkddacoliat.module.Module").then(
    moduleRegistry => {
      let factory = getFactory();
      let NS = "ie.cit.pkddacoliat.module";

      let moduleId = "0001";
      let module = factory.newResource(NS, "Module", moduleId);

      module.crn = moduleData.crn;
      module.subject = moduleData.subject;
      module.course = moduleData.course;
      module.section = moduleData.section;
      module.title = moduleData.title;
      module.credits = moduleData.credits;

      let event = factory.newEvent(NS, "ModuleCreated");
      event.moduleId = moduleId;
      emit(event);

      return moduleRegistry.addAll([module]);
    }
  );
}

/**
 * Create Grade Transaction
 * @param {ie.cit.pkddacoliat.module.CreateGrade} gradeData
 * @transaction
 */

function createGrade(gradeData) {
  return getAssetRegistry("ie.cit.pkddacoliat.grade.Grade").then(
    moduleRegistry => {
      let factory = getFactory();
      let NS = "ie.cit.pkddacoliat.grade";

      let gradeId = "0001";
      let grade = factory.newResource(NS, "Grade", gradeId);

      grade.stage = gradeData.stage;
      grade.semester = gradeData.semester;
      grade.finalGrade = gradeData.finalGrade;

      let event = factory.newEvent(NS, "GradeCreated");
      event.gradeId = gradeId;
      emit(event);

      return moduleRegistry.addAll([grade]);
    }
  );
}

/**
 * Create Course Transaction
 * @param {ie.cit.pkddacoliat.course.CreateCourse} courseData
 * @transaction
 */

function createCourse(courseData) {
  return getAssetRegistry("ie.cit.pkddacoliat.course.Course").then(
    moduleRegistry => {
      let factory = getFactory();
      let NS = "ie.cit.pkddacoliat.course";

      let courseId = "0001";
      let course = factory.newResource(NS, "Course", courseId);

      course.courseCode = courseData.courseCode;
      course.courseTitle = courseData.courseTitle;
      course.fieldOfStudy = courseData.fieldOfStudy;
      course.courseType = courseData.courseType;
      course.qualificationType = courseData.qualificationType;
      course.deliveryMode = courseData.deliveryMode;
      course.noOfSemesters = courseData.noOfSemesters;
      course.totalCredits = courseData.totalCredits;
      course.NFQLevel = courseData.NFQLevel;

      let event = factory.newEvent(NS, "CourseCreated");
      event.gradeId = courseId;
      emit(event);

      return moduleRegistry.addAll([course]);
    }
  );
}

/**
 * Create College Transaction
 * @param {ie.cit.pkddacoliat.college.CreateCollege} collegeData
 * @transaction
 */

function createCollege(collegeData) {
  return getAssetRegistry("ie.cit.pkddacoliat.college.College").then(
    moduleRegistry => {
      let factory = getFactory();
      let NS = "ie.cit.pkddacoliat.college";

      let collegeId = "0001";
      let college = factory.newResource(NS, "College", collegeId);

      college.collegeName = collegeData.collegeName;
      college.campus = collegeData.campus;
      college.department = collegeData.department;

      let event = factory.newEvent(NS, "CourseCreated");
      event.gradeId = courseId;
      emit(event);

      return moduleRegistry.addAll([course]);
    }
  );
}