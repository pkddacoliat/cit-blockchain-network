## TODO
### Admin
- [x] Admin has ALL permission to ALL resources in the network.
- [x] Admin can CREATE a student in the student registry.
- [x] Admin can CREATE a verifier in the verifier registry.
- [x] Admin can CREATE a course in the course registry.
- [x] Admin can CREATE a module in the module registry.
- [x] Admin can invoke the transaction EnrollStudent.
- [x] Admin can invoke the transaction AssignGrade.
- [x] Enrolling a student creates a new relationship between student and college/issuer.
- [x] Enrolling a student creates a new relationship between student and course.
- [x] Enrolling a student initialises following properties: grades, currentCredits, and graduated.
- [x] Assigning a grade to a student creates a new grade asset with four properties: the gradeId, moduleCRN which links to a module, studentNumber which links to a student, and the finalGrade.
- [x] Assigning a grade to a student adds the grade to their array of grades.
- [x] Assigning a grade to a student adds the credits for the module to their current credits.
- [x] After assigning a grade to a student, check the current credits against the number of total credits in the course. If they match, change the boolean value graduated to TRUE to represent that student successfully finished the course.
- [ ] Add a trace concept to the grade to record the transactionId, timestamp, and a boolean value that indicate if the grade is a pass or not.

### Student
- [x] Student can READ their own information stored in the student registry.
- [x] Student can READ their own grades stored in the grade registry.
- [x] Student can READ the courses stored in the course registry.
- [x] Student can READ the modules stored in the module registry.
- [x] Student can READ EnrollStudent transaction related to them.
- [x] Student can READ AssignGrade transactions related to them.

### Verifier
- [x] Verifier can READ the students stored in the student registry.
- [x] Verifier can READ their own information stored in the verifier registry.
- [x] Verifier can READ courses stored in the course registry.
- [x] Verifier can READ grades stored in the grade registry.
- [x] Verifier can READ modules stored in the module registry.
- [x] Verifier can READ EnrollStudent transactions.
- [x] Verifier can READ AssignGrade transactions.

### Queries
- [x] SELECT all students.
- [x] SELECT a student based on the student number.
- [x] SELECT all courses.
- [x] SELECT a course based on the course code.
- [x] SELECT all modules.
- [x] SELECT a module based on the module CRN.
- [ ] SELECT all grades based on the student number.
- [ ] SELECT all grades of a student on a given stage.

Go back to the main [README](README.md) file.
