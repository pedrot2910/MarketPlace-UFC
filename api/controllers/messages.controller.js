import { messagesService } from '../services/messages.service.js';

const messagesController = {
    
    createMessage: async (req, res) => { 
        try { 
            const { sender_id, receiver_id, product_id, message, image_url } = req.body; 

            const [newMessage] = await messagesService.createMessage({ 
                sender_id, receiver_id, product_id, message, image_url
            });

            res.status(201).json(newMessage); 

        } catch (error) { 
            res.status(500).json({ error: error.message }); 
        }
    },

    getMessagesByUser: async (req, res) => {
        try {
            const { userId } = req.params; // Pega o ID da URL

            const messages = await messagesService.getMessagesByUser(userId);
            
            res.status(200).json(messages);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    findMessageById: async (req, res) => {
        try {
            const { id } = req.params;
            const message = await messagesService.getMessageById(id);
            res.status(200).json(message);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    
    deleteMessageById: async (req, res) => {
        try {
            const { id } = req.params;
            await messagesService.deleteMessageById(id);
            res.status(200).json({ message: 'Mensagem deletada com sucesso!' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

};

export { messagesController };