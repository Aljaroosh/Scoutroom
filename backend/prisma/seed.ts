import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // Remove old test data
  await prisma.player.deleteMany();
  await prisma.club.deleteMany();

  const clubs = await Promise.all([
    prisma.club.create({
      data: {
        name: "Arsenal",
        country: "England",
      },
    }),
    prisma.club.create({
      data: {
        name: "Liverpool",
        country: "England",
      },
    }),
    prisma.club.create({
      data: {
        name: "Manchester City",
        country: "England",
      },
    }),
    prisma.club.create({
      data: {
        name: "FC Barcelona",
        country: "Spain",
      },
    }),
    prisma.club.create({
      data: {
        name: "Real Madrid",
        country: "Spain",
      },
    }),
    prisma.club.create({
      data: {
        name: "Atlético Madrid",
        country: "Spain",
      },
    }),
    prisma.club.create({
      data: {
        name: "Juventus",
        country: "Italy",
      },
    }),
    prisma.club.create({
      data: {
        name: "AC Milan",
        country: "Italy",
      },
    }),
    prisma.club.create({
      data: {
        name: "Bayern Munich",
        country: "Germany",
      },
    }),
    prisma.club.create({
      data: {
        name: "Paris Saint-Germain",
        country: "France",
      },
    }),
  ]);

  const [
    arsenal,
    liverpool,
    manCity,
    barcelona,
    realMadrid,
    atletico,
    juventus,
    acMilan,
    bayern,
    psg,
  ] = clubs;

  await prisma.player.createMany({
    data: [
      // Arsenal
      {
        firstName: "Ethan",
        lastName: "Cole",
        position: "Midfielder",
        nationality: "England",
        age: 21,
        clubId: arsenal.id,
      },
      {
        firstName: "Noah",
        lastName: "Andersson",
        position: "Defender",
        nationality: "Sweden",
        age: 22,
        clubId: arsenal.id,
      },
      {
        firstName: "Daniel",
        lastName: "Okafor",
        position: "Forward",
        nationality: "Nigeria",
        age: 20,
        clubId: arsenal.id,
      },

      // Liverpool
      {
        firstName: "Oliver",
        lastName: "Hayes",
        position: "Goalkeeper",
        nationality: "England",
        age: 23,
        clubId: liverpool.id,
      },
      {
        firstName: "Milan",
        lastName: "Petrovic",
        position: "Defender",
        nationality: "Serbia",
        age: 21,
        clubId: liverpool.id,
      },
      {
        firstName: "Samir",
        lastName: "Bennani",
        position: "Forward",
        nationality: "Morocco",
        age: 19,
        clubId: liverpool.id,
      },

      // Manchester City
      {
        firstName: "Leo",
        lastName: "Berg",
        position: "Midfielder",
        nationality: "Norway",
        age: 20,
        clubId: manCity.id,
      },
      {
        firstName: "Tyler",
        lastName: "Brooks",
        position: "Forward",
        nationality: "England",
        age: 22,
        clubId: manCity.id,
      },
      {
        firstName: "Amadou",
        lastName: "Diallo",
        position: "Defender",
        nationality: "Senegal",
        age: 21,
        clubId: manCity.id,
      },

      // Barcelona
      {
        firstName: "Lucas",
        lastName: "Martinez",
        position: "Forward",
        nationality: "Spain",
        age: 20,
        clubId: barcelona.id,
      },
      {
        firstName: "Adrian",
        lastName: "Vega",
        position: "Goalkeeper",
        nationality: "Spain",
        age: 24,
        clubId: barcelona.id,
      },
      {
        firstName: "Thiago",
        lastName: "Costa",
        position: "Midfielder",
        nationality: "Brazil",
        age: 19,
        clubId: barcelona.id,
      },

      // Real Madrid
      {
        firstName: "Mateo",
        lastName: "Navarro",
        position: "Midfielder",
        nationality: "Spain",
        age: 22,
        clubId: realMadrid.id,
      },
      {
        firstName: "Gabriel",
        lastName: "Santos",
        position: "Forward",
        nationality: "Brazil",
        age: 21,
        clubId: realMadrid.id,
      },
      {
        firstName: "Hugo",
        lastName: "Laurent",
        position: "Defender",
        nationality: "France",
        age: 23,
        clubId: realMadrid.id,
      },

      // Atlético Madrid
      {
        firstName: "Diego",
        lastName: "Romero",
        position: "Defender",
        nationality: "Argentina",
        age: 22,
        clubId: atletico.id,
      },
      {
        firstName: "Ivan",
        lastName: "Morales",
        position: "Midfielder",
        nationality: "Spain",
        age: 20,
        clubId: atletico.id,
      },
      {
        firstName: "Emilio",
        lastName: "Torres",
        position: "Forward",
        nationality: "Mexico",
        age: 21,
        clubId: atletico.id,
      },

      // Juventus
      {
        firstName: "Matteo",
        lastName: "Ricci",
        position: "Midfielder",
        nationality: "Italy",
        age: 23,
        clubId: juventus.id,
      },
      {
        firstName: "Luca",
        lastName: "Bianchi",
        position: "Defender",
        nationality: "Italy",
        age: 20,
        clubId: juventus.id,
      },
      {
        firstName: "Niko",
        lastName: "Maric",
        position: "Forward",
        nationality: "Croatia",
        age: 22,
        clubId: juventus.id,
      },

      // AC Milan
      {
        firstName: "Alessio",
        lastName: "Moretti",
        position: "Goalkeeper",
        nationality: "Italy",
        age: 24,
        clubId: acMilan.id,
      },
      {
        firstName: "Rafael",
        lastName: "Mendes",
        position: "Forward",
        nationality: "Portugal",
        age: 21,
        clubId: acMilan.id,
      },
      {
        firstName: "Marco",
        lastName: "Conti",
        position: "Midfielder",
        nationality: "Italy",
        age: 22,
        clubId: acMilan.id,
      },

      // Bayern Munich
      {
        firstName: "Jonas",
        lastName: "Keller",
        position: "Midfielder",
        nationality: "Germany",
        age: 20,
        clubId: bayern.id,
      },
      {
        firstName: "Felix",
        lastName: "Wagner",
        position: "Defender",
        nationality: "Germany",
        age: 23,
        clubId: bayern.id,
      },
      {
        firstName: "Emil",
        lastName: "Lindström",
        position: "Forward",
        nationality: "Sweden",
        age: 21,
        clubId: bayern.id,
      },

      // PSG
      {
        firstName: "Mathis",
        lastName: "Dubois",
        position: "Forward",
        nationality: "France",
        age: 20,
        clubId: psg.id,
      },
      {
        firstName: "Youssef",
        lastName: "Amrani",
        position: "Midfielder",
        nationality: "Morocco",
        age: 22,
        clubId: psg.id,
      },
      {
        firstName: "Ibrahim",
        lastName: "Konate",
        position: "Defender",
        nationality: "France",
        age: 21,
        clubId: psg.id,
      },
    ],
  });

  console.log("Seed complete: 10 clubs and 30 players added");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });