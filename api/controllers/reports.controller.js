import { reportsService } from "../services/reports.service.js";

const reportsController = {

    createReport: async (req, res, next) => { 
        try { 
            
            const [newReport] = await reportsService.createReport(req.body, req.user.id);

            res.status(201).json(newReport); 

        } catch (error) { 
            next(error);
        }
    },

    findAllReports: async (req, res, next) => {
        try {
            const reports = await reportsService.getAllReports();
            res.status(200).json(reports);
        } catch (error) {
            next(error);
        }
    },

    findReportById: async (req, res, next) => {
        try {
            const { id } = req.params;

            const report = await reportsService.getReportById(id);
            res.status(200).json(report);

        } catch (error) {
            next(error);
        }
    },

    deleteReportById: async (req, res, next) => {
        try {
            const { id } = req.params;

            await reportsService.deleteReportById(id);
            res.status(200).json({ message: 'Report deletado com sucesso!' });
        } catch (error) {
            next(error);
        }
    },

    updateReportById: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { status } = req.body; // Pegamos só o status

            const [updatedReport] = await reportsService.updateReportStatus(id, status);
            
            res.status(200).json(updatedReport);

        } catch (error) {
            next(error);
        }       
    },
};

export { reportsController };