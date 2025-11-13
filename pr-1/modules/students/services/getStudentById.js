module.exports = function getStudentById(repo, logger, id) {
  const student = repo.findById(id);
  logger.log("Student:", student);
  return student;
};
