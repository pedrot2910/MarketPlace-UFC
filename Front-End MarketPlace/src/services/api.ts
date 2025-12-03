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
        email:'gustavodaabundinha24@alu.ufc.br',
        password: '123456',
        role: 'estudante',
        photoUrl: 'https://i.pinimg.com/736x/fc/e9/f5/fce9f51832af549137a90b98d741d522.jpg'
    },
    {
        id: '2',
        name: 'Sarah Piaui',
        email:'tuamaemama6969@gmail.com',
        password: '12345678',
        role: 'Docente'
    },
    {
        id: '3',
        name: 'Davy Alves',
        email:'davyalvesteste@gmail.com',
        password: 'davyalves123',
        role: 'estudante',
        photoUrl: 'https://i.pinimg.com/236x/41/a3/04/41a304b960013dd34c8a653ca8247d14.jpg'
    },
    {
        id: '4',
        name: 'Heitor Alves',
        email: 'heitorzaoduhgrau@gmail.com',
        password: 'macaco123',
        role: 'estudante',
        photoUrl: 'https://tse3.mm.bing.net/th/id/OIP.XUkfmfh7cOReMXwR5QsyfgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3'
    }
]

export const mockListings: Listing[] = [
    {
        id: '1',
        title: 'Calculadora Científica',
        description: 'Calculadora científica usada, em bom estado.',
        price: 50,
        ownerName: 'Gustavo Vieira',
        type: 'offer',
        imageUrl: "https://d1o6h00a1h5k7q.cloudfront.net/imagens/img_m/41420/20222495.jpg",
        ownerId: 1
    },
    {
        id: '2',
        title: 'Livro de Cálculo',
        description: 'Livro de cálculo diferencial e integral, 7ª edição.',
        price: 20,
        ownerName: 'Sarah Piaui',
        type: 'trade',
        imageUrl: "https://www.quarto707.com.br/wp-content/uploads/2024/07/historia-do-calculo-diferencial-e-integral-9-scaled.jpg",
        ownerId: 2
    },
    {
        id: '3',
        title: 'Caderno de Anotações',
        description: 'Caderno universitário preto com folhas pautadas.',
        ownerName: 'Davy Alves',
        price: 10,
        type: 'offer',
        imageUrl: "https://www.cadernosfilosoficos.com.br/cdn/shop/files/06_Preto-LosAngeles-min.jpg?v=1715019439&width=823",
        ownerId: 3
    },
    {
        id: '4',
        title: 'Notebook ASUS Vivobook 15',
        description: 'Notebook ASUS Vivobook 15 com 8GB de RAM e 512GB de SSD em bom estado.',
        ownerName: 'Sarah Piaui',
        price: 5000,
        type: 'trade',
        imageUrl: "https://m.media-amazon.com/images/I/41iFGla9E5L._AC_SX679_.jpg",
        ownerId: 2
    },
    {
        id: '5',
        title: 'oakley de vilaaum',
        description: 'oakley de vilaaum usado, em bom estado.',
        price: 150,
        ownerName: 'Heitor Alves',
        type: 'offer',
        imageUrl: "data:image/jpeg;base64,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",
        ownerId: 4
    }
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

mock.onGet(/\/listings\/\d+/).reply((config) => {
    const id = config.url?.split('/').pop();
    const listing = mockListings.find((l) => l.id === id);
    return listing ? [200, listing] : [404, { message: "Anúncio não encontrado" }];
});

export function getUserById(id: Number){
    return mockUsers.find((u) => Number(u.id) === id) || null;
}
