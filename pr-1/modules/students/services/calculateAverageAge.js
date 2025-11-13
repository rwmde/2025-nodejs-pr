module.exports = function calculateAverageAge(repo, logger) {
  const avg = repo.getAverageAge();
  logger.log("Average age:", avg);
  return avg;
};
