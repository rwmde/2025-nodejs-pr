module.exports = function getAllStudents(repo, logger) {
  const list = repo.findAll();
  logger.log("All students:", list);
  return list;
};
