import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import type { Listing } from '../types/listing';
import type { User } from '../types/user';

export const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

export const mock = new AxiosMockAdapter(api, {delayResponse: 500});

export const mockUsers: User[] = [
    {
        id: '1',
        name: 'Gustavo Vieira',
        email:'gustavodáabundinha24@alu.ufc.br',
        role: 'student'
    },
    {
        id: '2',
        name: 'TuaMãe',
        email:'tuamãemama6969@gmail.com',
        role: 'teacher'
    }
]

export const mockListings: Listing[] = [
    {
        id: '1',
        title: 'Calculadora Científica',
        description: 'Calculadora científica usada, em bom estado.',
        price: 50,
        owner: 'Gustavo Vieira',
        type: 'offer',
        imageUrl: "https://d1o6h00a1h5k7q.cloudfront.net/imagens/img_m/41420/20222495.jpg"
    },
    {
        id: '2',
        title: 'Livro de Cálculo',
        description: 'Livro de cálculo diferencial e integral, 7ª edição.',
        price: 20,
        owner: 'TuaMãe',
        type: 'trade',
        imageUrl: "https://www.quarto707.com.br/wp-content/uploads/2024/07/historia-do-calculo-diferencial-e-integral-9-scaled.jpg"
    },
];



mock.onGet('/listings').reply(200, mockListings);

mock.onPost('/listings').reply((config) => {
    const newListing: Listing = {
        id : String(mockListings.length + 1),
        ...JSON.parse(config.data),
    };
    mockListings.push(newListing);
    return [201, newListing];
});

mock.onGet('/users').reply(200, mockUsers);

mock.onGet(/\/user\/\d+/).reply((config) => {
  const id = config.url?.split('/').pop();
  const user = mockUsers.find((u) => u.id === id);
  return user ? [200, user] : [404, { message: "Usuário não encontrado" }];
});
