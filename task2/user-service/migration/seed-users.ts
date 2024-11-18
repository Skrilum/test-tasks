import { DataSource } from 'typeorm';
import { User } from '../src/users/user.entity';

// Настройка подключения
const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'qwerty1234567',
  database: 'user_service',
  entities: [User],
  synchronize: false,
});

async function seed() {
  await dataSource.initialize();
  const userRepository = dataSource.getRepository(User);

  console.log('Start seeding...');

  // Конфигурация чанков
  const chunkSize = 10000;

  // Генерация данных
  const users = Array.from({ length: 1_000_000 }, (_, i) => ({
    firstName: `User${i}`, 
    lastName: `Last${i}`,  
    age: Math.floor(Math.random() * 60) + 18, // Возраст от 18 до 77
    gender: (i % 2 === 0 ? 'male' : 'female') as 'male' | 'female', 
    hasProblems: Math.random() < 0.3, // 30% пользователей имеют проблемы
  }));

  // Разделение на чанки и сохранение
  for (let i = 0; i < users.length; i += chunkSize) {
    const chunk = users.slice(i, i + chunkSize); 
    console.log('Chunk example:', chunk[0]);
    await userRepository.save(chunk); 
    console.log(`Inserted ${i + chunk.length} users...`);
  }

  console.log('Seed completed!');
  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('Error during seeding:', error);
  process.exit(1);
});


// Добавление одного пользователя
// async function addSingleUser() {
//   await dataSource.initialize(); 
//   const userRepository = dataSource.getRepository(User);

//   const user = userRepository.create({
//     firstName: 'John',
//     lastName: 'Doe',
//     age: 30,
//     gender: 'male',
//     hasProblems: false,
//   });

//   await userRepository.save(user);
//   console.log('User added:', user);

//   await dataSource.destroy();
// }

// addSingleUser().catch(console.error);
