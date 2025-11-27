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
        role: 'student',
        photoUrl: 'https://i.pinimg.com/736x/fc/e9/f5/fce9f51832af549137a90b98d741d522.jpg'
    },
    {
        id: '2',
        name: 'TuaMãe',
        email:'tuamaemama6969@gmail.com',
        password: '12345678',
        role: 'teacher'
    },
    {
        id: '3',
        name: 'Davy Alves',
        email:'davyalvesteste@gmail.com',
        password: 'davyalves123',
        role: 'student',
        photoUrl: 'https://i.pinimg.com/236x/41/a3/04/41a304b960013dd34c8a653ca8247d14.jpg'
    },
    {
        id: '4',
        name: 'Heitor Alves',
        email: 'heitorzaoduhgrauh@gmail.com',
        password: 'mamacao123',
        role: 'student',
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
        ownerName: 'TuaMãe',
        type: 'trade',
        imageUrl: "https://www.quarto707.com.br/wp-content/uploads/2024/07/historia-do-calculo-diferencial-e-integral-9-scaled.jpg",
        ownerId: 2
    },
    {
        id: '3',
        title: 'Caderno de Anotações',
        description: 'Caderno universitário preto com folhas pautadas.',
        ownerName: 'Marcelo Castro',
        price: 10,
        type: 'offer',
        imageUrl: "https://www.cadernosfilosoficos.com.br/cdn/shop/files/06_Preto-LosAngeles-min.jpg?v=1715019439&width=823",
        ownerId: 3
    },
    {
        id: '4',
        title: 'Notebook ASUS Vivobook 15',
        description: 'Notebook ASUS Vivobook 15 com 8GB de RAM e 512GB de SSD em bom estado.',
        ownerName: 'TuaMãe',
        price: 500,
        type: 'trade',
        imageUrl: "https://m.media-amazon.com/images/I/41iFGla9E5L._AC_SX679_.jpg",
        ownerId: 2
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
