require('dotenv').config();
const prisma = require('../src/utils/prisma');
const bcrypt = require('bcryptjs');

async function main() {
  console.log('🌱 Starting seeding...');

  // Cleanup existing data (optional, be careful in production if you only want to add missing data)
  // For safety in this "initial data" context, we will use upserts or check if exists.
  // But to guarantee a clean slate for "practicing CI/CD", let's delete strictly for this demo scope if we assume dev/demo env.
  // Actually, let's use upsert to be safe and idempotent.

  const password = await bcrypt.hash('password123', 8);

  // 1. Create Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@flowtask.com' },
    update: {},
    create: {
      email: 'admin@flowtask.com',
      name: 'Admin FlowTask',
      password,
      roles: ['admin', 'user'],
      isActive: true,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'demo@flowtask.com' },
    update: {},
    create: {
      email: 'demo@flowtask.com',
      name: 'Demo User',
      password,
      roles: ['user'],
      isActive: true,
    },
  });

  console.log(`👤 Created users: ${admin.name}, ${user.name}`);

  // 2. Create Categories for Admin
  const workCategory = await prisma.category.upsert({
    where: {
      name_userId: {
        name: 'Work',
        userId: admin.id,
      },
    },
    update: {},
    create: {
      name: 'Work',
      userId: admin.id,
    },
  });

  // 3. Create Categories for Demo User
  const personalCategory = await prisma.category.upsert({
    where: {
      name_userId: {
        name: 'Personal',
        userId: user.id,
      },
    },
    update: {},
    create: {
      name: 'Personal',
      userId: user.id,
    },
  });

  const learningCategory = await prisma.category.upsert({
    where: {
      name_userId: {
        name: 'Learning',
        userId: user.id,
      },
    },
    update: {},
    create: {
      name: 'Learning',
      userId: user.id,
    },
  });

  console.log(`fyp Created categories`);

  // 4. Create Todos
  await prisma.todo.createMany({
    data: [
      {
        title: 'Review production logs',
        description: 'Check for any anomalies in the last deploy',
        isCompleted: false,
        userId: admin.id,
        categoryId: workCategory.id,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
      },
      {
        title: 'Buy groceries',
        description: 'Milk, Eggs, Bread, Coffee',
        isCompleted: false,
        userId: user.id,
        categoryId: personalCategory.id,
        dueDate: new Date(), // Today
      },
      {
        title: 'Master CI/CD',
        description: 'Complete the FlowTask pipeline setup',
        isCompleted: true,
        userId: user.id,
        categoryId: learningCategory.id,
        dueDate: new Date(new Date().setDate(new Date().getDate() - 1)), // Yesterday
      },
    ],
    skipDuplicates: true, 
  });

  console.log('✅ Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });