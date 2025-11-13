module.exports = function getStudentsByGroup(repo, logger, group) {
  const list = repo.findByGroup(group);
  logger.log(`Group ${group}:`, list);
  return list;
};
