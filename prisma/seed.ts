import { objectGroups } from './consts';
import prisma from '../src/core/prisma';
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
      role: 'Admin',
      password,
      salt,
    },
  });

  objectGroups.forEach(
    async (group) =>
      await prisma.objectGroup.upsert({
        where: { alias: group.alias },
        update: {},
        create: group,
      })
  );
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
