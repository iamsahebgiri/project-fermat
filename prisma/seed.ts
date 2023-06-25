import { PrismaClient, Prisma } from "@prisma/client";
import problems from "./problems.json";
const prisma = new PrismaClient();

const badges: Prisma.BadgeCreateInput[] = [
  { name: "Intern", description: "Solve first problem", url: "level-1.svg" },
  { name: "Master", description: "Solve 5 problems", url: "level-2.svg" },
  { name: "Ninja", description: "Solve 10 problems", url: "level-3.svg" },
  { name: "Guru", description: "Solve 20 problems", url: "level-4.svg" },
  { name: "Unstoppable", description: "Solve 30 problems", url: "level-5.svg" },
  { name: "Unbeatable", description: "Solve 50 problems", url: "level-6.svg" },
  { name: "Epic", description: "Solve 100 problems", url: "level-7.svg" },
  { name: "Respect", description: "Solve 120 problems", url: "level-8.svg" },
];

async function main() {
  // await prisma.problem.deleteMany();
  console.log(`Start seeding ...`);
  for (const problem of problems) {
    const p = await prisma.problem.create({
      data: problem,
    });
    console.log(`Created problem with id: ${p.id}`);
  }
  // await prisma.badge.deleteMany();
  for (const badge of badges) {
    const b = await prisma.badge.create({
      data: badge,
    });
    console.log(`Created badge with id: ${b.id}`);
  }
  console.log(`Seeding finished.`);
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
