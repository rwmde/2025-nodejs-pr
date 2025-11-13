module.exports = function addStudent(repo, logger, name, age, group) {
  const student = repo.create(name, age, group);
  logger.log("Student created:", student);
  return student;
};
