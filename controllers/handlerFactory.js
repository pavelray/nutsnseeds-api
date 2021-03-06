const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

/** Delete a perticular document by Id */
exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with that Id', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  });
