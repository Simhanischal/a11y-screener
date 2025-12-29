import { PrismaClient, Prisma } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const userData: Prisma.UserCreateInput[] = [
  {
    name: "Nis",
    email: "nis@gmail.com",
    results: {
      create: [
        {
          siteUrl: "https://google.com",
          timestamp: 1766849817,
          violations: {
            create: [
              {
                severity: "critical",
                title: "Buttons must have discernible text",
                wcag: ["wcag2a", "wcag412"],
                description: "aria-label attribute does not exist or is empty",
                affectedNodes: [
                  '<button id="prev-tab" class="nav-button">',
                  '<button id="next-tab" class="nav-button">',
                ],
              },
              {
                severity: "serious",
                title: "Links must have discernible text",
                wcag: ["wcag2a", "wcag244", "wcag412"],
                description: "aria-label attribute does not exist or is empty",
                affectedNodes: [
                  '<a target="_blank" href="https://www.facebook.com/accessibe">',
                  '<a target="_blank" href="https://www.instagram.com/accessibe_community">',
                ],
              },
            ],
          },
        },
      ],
    },
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
}

main();