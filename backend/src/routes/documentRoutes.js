const express = require('express');
const controller = require('../controllers/documentController');
const { documentUpload } = require('../middleware/upload');
const { asyncHandler } = require('../utils/asyncHandler');

const documentRouter = express.Router({ mergeParams: true });
documentRouter.post('/', documentUpload, asyncHandler(controller.uploadDocument));
documentRouter.get('/:fileId', asyncHandler(controller.downloadDocument));
documentRouter.get('/:fileId/download', asyncHandler(controller.downloadDocument));
documentRouter.delete('/:fileId', asyncHandler(controller.deleteDocument));

module.exports = { documentRouter };
