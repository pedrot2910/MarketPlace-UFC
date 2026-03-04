import { categoriesService } from "../services/categories.service.js";

const categoriesController = {

createCategory: async (req, res, next) => { 
        try { 

            const [newCategorie] = await categoriesService.createCategory(req.body);

            // Success
            res.status(201).json(newCategorie); 
        } catch (error) { 
            // Internal Error
            next(error);
        }
    },
    
findAllCategories: async (req, res, next) => {
    try {
        const Categories = await categoriesService.getAllCategories();
        res.status(200).json(Categories);
    } catch (error) {
        next(error);
    }

},

findCategoryById: async (req, res, next) => {
        try {
            
            const Categories = await categoriesService.getCategoryById(req.params.id);
            res.status(200).json(Categories);

        } catch (error) {
            next(error);
        }
    },
deleteCategoryById: async (req, res, next) => {
        try {

            await categoriesService.deleteCategoryById(req.params.id);
            res.status(200).json({ message: 'Categoria deletada com sucesso!' });

        } catch (error) {
            next(error);
        }
    },
updateCategoryById: async (req, res, next) => {
        try {

            const [updatedCategories] = await categoriesService.updateCategoryById(req.params.id, req.body);
            
            res.status(200).json(updatedCategories);

        } catch (error) {
            next(error);
        }       
    },

};

export { categoriesController };