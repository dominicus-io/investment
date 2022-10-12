import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();

async function main() {
  for (let i = 0; i < 10; ++i) {
    await client.investment.create({
      data: {
        name: `Investment ${i+1}`,
        return: (Math.round(Math.random() * 100) % 20) + 1,
        fundingCapital:
          (Math.round(Math.random() * 10_000_000) % 1_000_000) + 100_000,
        investmentTerm: (Math.round(Math.random() * 100) % 48) + 12,
        fundingEnd: new Date(),
      },
    });
  }
}

let EXIT = 0;

main()
  .catch(async (e) => {
    console.error(e);
    EXIT = 1;
  })
  .finally(async () => {
    await client.$disconnect();
    process.exit(EXIT);
  });
