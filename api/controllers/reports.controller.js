import { reportsService } from "../services/reports.service.js";

const reportsController = {

    createReport: async (req, res) => { 
        try { 
            const { product_id, reason } = req.body; 
            const reporter_id = req.user.id;
            
            const [newReport] = await reportsService.createReport({ 
                reporter_id, 
                product_id, 
                reason,
                status: 'pendente'
            });

            res.status(201).json(newReport); 

        } catch (error) { 
            res.status(500).json({ error: error.message }); 
        }
    },

    findAllReports: async (req, res) => {
        try {
            const reports = await reportsService.getAllReports();
            res.status(200).json(reports);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    findReportById: async (req, res) => {
        try {
            const { id } = req.params;

            const report = await reportsService.getReportById(id);
            res.status(200).json(report);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteReportById: async (req, res) => {
        try {
            const { id } = req.params;

            await reportsService.deleteReportById(id);
            res.status(200).json({ message: 'Report deletado com sucesso!' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateReportById: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body; // Pegamos só o status

            const [updatedReport] = await reportsService.updateReportStatus(id, status);
            
            res.status(200).json(updatedReport);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }       
    },
};

export { reportsController };