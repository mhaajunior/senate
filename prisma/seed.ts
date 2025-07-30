import { PrismaClient } from "@/generated/prisma";
import bcrypt from "bcrypt";
import { STATUS } from "./data/status";
import { OFFICE } from "./data/office";
import { GROUP } from "./data/group";
import { USER } from "./data/user";

const prisma = new PrismaClient();

async function main() {
  // Upsert STATUS
  const roots = STATUS.filter((s) => !s.parentId);
  const children = STATUS.filter((s) => s.parentId);

  for (const s of roots) {
    await prisma.status.upsert({
      where: { id: s.id },
      update: { name: s.name, type: s.type, parentId: null },
      create: { id: s.id, name: s.name, type: s.type, parentId: null },
    });
  }

  for (const s of children) {
    await prisma.status.upsert({
      where: { id: s.id },
      update: { name: s.name, type: s.type, parentId: s.parentId },
      create: { id: s.id, name: s.name, type: s.type, parentId: s.parentId },
    });
  }

  // Upsert OFFICE
  for (const o of OFFICE) {
    await prisma.office.upsert({
      where: { id: o.id },
      update: { name: o.name },
      create: { id: o.id, name: o.name },
    });
  }

  // Upsert GROUP
  for (const g of GROUP) {
    await prisma.group.upsert({
      where: { id: g.id },
      update: { name: g.name, officeId: g.officeId },
      create: { id: g.id, name: g.name, officeId: g.officeId },
    });
  }

  // Upsert USER
  for (const u of USER) {
    const hashedPassword = await bcrypt.hash(u.password, 10);

    await prisma.user.upsert({
      where: { id: u.id },
      update: {
        username: u.username,
        password: hashedPassword,
      },
      create: {
        id: u.id,
        username: u.username,
        password: hashedPassword,
      },
    });
  }
}

main()
  .then(() => {
    console.log("✅ Seed completed");
  })
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
