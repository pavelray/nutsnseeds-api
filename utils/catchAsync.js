// Handle Async function exception
module.exports = executeFunction => {
  return (req, res, next) => {
    executeFunction(req, res, next).catch(next);
  };
};
