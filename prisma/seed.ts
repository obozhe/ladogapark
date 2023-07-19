import prisma from '../src/lib/prisma';
import bcrypt from 'bcrypt';

async function main() {
  const salt = await bcrypt.genSalt();
  const password = await bcrypt.hash('password', salt);

  await prisma.user.upsert({
    where: { login: 'admin' },
    update: {},
    create: {
      name: 'Admin Adminovich',
      login: 'admin',
      role: 'admin',
      password,
      salt,
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
