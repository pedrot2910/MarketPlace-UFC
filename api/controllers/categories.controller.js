import { categoriesService } from "../services/categories.service.js";

const categoriesController = {

createCategory: async (req, res) => { 
        try { 
            const { namecategories, icon } = req.body; 

            const [newCategorie] = await categoriesService.createCategory({ 
                namecategories, icon
            });

            // Success
            res.status(201).json(newCategorie); 
        } catch (error) { 
            // Internal Error
            res.status(500).json({ error: error.message }); 
        }
    },
findAllCategories: async (req, res) => {
    try {
        const Categories = await categoriesService.getAllCategories();
        res.status(200).json(Categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

},

findCategoryById: async (req, res) => {
        try {
            const { id } = req.params;
            
            const Categories = await categoriesService.getCategoryById(id);
            res.status(200).json(Categories);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
deleteCategoryById: async (req, res) => {
        try {
            const { id } = req.params;

            await categoriesService.deleteCategorieById(id);
            res.status(200).json({ message: 'Categoria deletada com sucesso!' });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
updateCategoryById: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedData = req.body;

            const [updatedCategories] = await categoriesService.updateCategoryById(id, updatedData);
            
            res.status(200).json(updatedCategories);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }       
    },

};

export { categoriesController };