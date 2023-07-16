import prisma from '../src/lib/prisma';
import bcrypt from 'bcrypt';

async function main() {
  await prisma.user.upsert({
    where: { login: 'admin' },
    update: {},
    create: {
      name: 'Admin Adminovich',
      login: 'admin',
      password: await bcrypt.hash('password', 13),
      role: 'admin',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
