import bcrypt from 'bcrypt';

const bcrypt = require('bcrypt');

const saltRounds = 8; 

const hash = {
    hashPassword: async (plainPassword) => {
        try {
            const hash = await bcrypt.hash(plainPassword, saltRounds);
            return hash;
        } catch (error) {
            throw new Error('Erro ao criptografar senha');
        }
    },


    comparePassword: async (plainPassword, hashedPassword) => {
        try {
            const match = await bcrypt.compare(plainPassword, hashedPassword);
            return match;
        } catch (error) {
            throw new Error('Erro ao comparar senhas');
        }
}


};

export {hash};