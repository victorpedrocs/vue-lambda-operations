import express from 'express';
import { asyncHandler } from '../../middleware/errorHandler';
import { getRecords } from '../../controller/records/getRecords';
import { postRecord } from '../../controller/records/postRecord';
import { deleteRecord } from '../../controller/records/deleteRecord';

export const recordsRouter = express.Router();

recordsRouter.post('/', asyncHandler(postRecord));
recordsRouter.get('/', asyncHandler(getRecords));
recordsRouter.delete('/:id', asyncHandler(deleteRecord));
