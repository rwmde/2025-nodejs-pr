module.exports = function removeStudent(repo, logger, id) {
  const removed = repo.delete(id);
  logger.log(removed ? `Student ${id} removed` : `Student ${id} not found`);
  return removed;
};
