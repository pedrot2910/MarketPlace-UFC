import { Router } from 'express';
import { reportsController } from '../controllers/reports.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validateSchema } from '../middlewares/validation.middleware.js';
import { reportsSchema } from '../schemas/reports.schema.js';

const reportsRoutes = Router();

reportsRoutes.post('/', authMiddleware, validateSchema(reportsSchema.create), reportsController.createReport);
reportsRoutes.get('/', authMiddleware, reportsController.findAllReports);
reportsRoutes.get('/:id', authMiddleware, validateSchema(reportsSchema.findReportById), reportsController.findReportById);
reportsRoutes.delete('/:id', authMiddleware, validateSchema(reportsSchema.delete), reportsController.deleteReportById);
reportsRoutes.put('/:id', authMiddleware, validateSchema(reportsSchema.update), reportsController.updateReportById);
export { reportsRoutes };