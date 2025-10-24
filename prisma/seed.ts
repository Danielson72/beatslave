import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const artist1 = await prisma.artist.upsert({
    where: { slug: "the-tru-witnesses" },
    update: {},
    create: {
      name: "The Tru Witnesses",
      slug: "the-tru-witnesses",
      bio: "Gospel Hip Hop collective spreading truth through beats",
      coverUrl: "/uploads/covers/tru-witnesses.jpg",
    },
  });

  const artist2 = await prisma.artist.upsert({
    where: { slug: "aaliyah-infinite" },
    update: {},
    create: {
      name: "Aaliyah Infinite",
      slug: "aaliyah-infinite",
      bio: "Contemporary Gospel & R&B artist with a message of hope",
      coverUrl: "/uploads/covers/aaliyah-infinite.jpg",
    },
  });

  const artist3 = await prisma.artist.upsert({
    where: { slug: "daniel-in-the-lions-den" },
    update: {},
    create: {
      name: "Daniel In The Lions Den",
      slug: "daniel-in-the-lions-den",
      bio: "Faith-driven trap producer with heavenly vibes",
      coverUrl: "/uploads/covers/daniel.jpg",
    },
  });

  const release1 = await prisma.release.upsert({
    where: { slug: "tru-witness-vol-1" },
    update: {},
    create: {
      title: "Tru Witness Vol. 1",
      slug: "tru-witness-vol-1",
      artistId: artist1.id,
      coverUrl: "/uploads/covers/tru-witness-vol-1.jpg",
      releaseDate: new Date("2024-01-15"),
      description: "Debut collection of hard-hitting gospel hip hop beats",
    },
  });

  const release2 = await prisma.release.upsert({
    where: { slug: "infinite-praise" },
    update: {},
    create: {
      title: "Infinite Praise",
      slug: "infinite-praise",
      artistId: artist2.id,
      coverUrl: "/uploads/covers/infinite-praise.jpg",
      releaseDate: new Date("2024-02-10"),
      description: "Soulful worship instrumentals for modern believers",
    },
  });

  const release3 = await prisma.release.upsert({
    where: { slug: "heavenly-trap" },
    update: {},
    create: {
      title: "Heavenly Trap",
      slug: "heavenly-trap",
      artistId: artist3.id,
      coverUrl: "/uploads/covers/heavenly-trap.jpg",
      releaseDate: new Date("2024-03-01"),
      description: "High-energy trap beats with spiritual undertones",
    },
  });

  await prisma.track.upsert({
    where: { slug: "kronological" },
    update: {},
    create: {
      title: "Kronological",
      slug: "kronological",
      releaseId: release1.id,
      audioUrl: "/uploads/tracks/kronological.wav",
      previewUrl: "/uploads/previews/kronological-preview.mp3",
      duration: 180,
      bpm: 85,
      key: "G Minor",
      genre: "Hip Hop",
      mood: "Dark",
      tags: ["Gospel", "Boom Bap", "Underground", "Storytelling"],
      standardPriceCents: 99,
      premiumPriceCents: 499,
      exclusivePriceCents: 4999,
      isActive: true,
    },
  });

  await prisma.track.upsert({
    where: { slug: "in-the-shadows" },
    update: {},
    create: {
      title: "In The Shadows",
      slug: "in-the-shadows",
      releaseId: release1.id,
      audioUrl: "/uploads/tracks/in-the-shadows.wav",
      previewUrl: "/uploads/previews/in-the-shadows-preview.mp3",
      duration: 195,
      bpm: 90,
      key: "A Minor",
      genre: "Hip Hop",
      mood: "Mysterious",
      tags: ["Gospel", "Dark", "Cinematic", "Intense"],
      standardPriceCents: 99,
      premiumPriceCents: 499,
      exclusivePriceCents: 4999,
      isActive: true,
    },
  });

  await prisma.track.upsert({
    where: { slug: "your-word-cuts-deep" },
    update: {},
    create: {
      title: "Your Word Cuts Deep",
      slug: "your-word-cuts-deep",
      releaseId: release2.id,
      audioUrl: "/uploads/tracks/your-word-cuts-deep.wav",
      previewUrl: "/uploads/previews/your-word-cuts-deep-preview.mp3",
      duration: 210,
      bpm: 72,
      key: "E Major",
      genre: "Gospel/R&B",
      mood: "Emotional",
      tags: ["Worship", "Soulful", "Contemporary", "Heartfelt"],
      standardPriceCents: 99,
      premiumPriceCents: 499,
      exclusivePriceCents: 4999,
      isActive: true,
    },
  });

  await prisma.track.upsert({
    where: { slug: "beauty-in-the-suffering" },
    update: {},
    create: {
      title: "Beauty in the Suffering",
      slug: "beauty-in-the-suffering",
      releaseId: release2.id,
      audioUrl: "/uploads/tracks/beauty-in-the-suffering.wav",
      previewUrl: "/uploads/previews/beauty-in-the-suffering-preview.mp3",
      duration: 240,
      bpm: 68,
      key: "C Major",
      genre: "Gospel",
      mood: "Uplifting",
      tags: ["Inspirational", "Hope", "Worship", "Peaceful"],
      standardPriceCents: 99,
      premiumPriceCents: 499,
      exclusivePriceCents: 4999,
      isActive: true,
    },
  });

  await prisma.track.upsert({
    where: { slug: "heavenly-vibin" },
    update: {},
    create: {
      title: "Heavenly Vibin",
      slug: "heavenly-vibin",
      releaseId: release3.id,
      audioUrl: "/uploads/tracks/heavenly-vibin.wav",
      previewUrl: "/uploads/previews/heavenly-vibin-preview.mp3",
      duration: 165,
      bpm: 140,
      key: "D Minor",
      genre: "Trap",
      mood: "Energetic",
      tags: ["808s", "Hard", "Modern", "Faith"],
      standardPriceCents: 99,
      premiumPriceCents: 499,
      exclusivePriceCents: 4999,
      isActive: true,
    },
  });

  console.log("✅ Database seeded successfully");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
