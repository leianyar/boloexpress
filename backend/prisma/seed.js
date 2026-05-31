const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("A criar dados iniciais...");

  const passwordHash = await bcrypt.hash("123456", 10);

  await prisma.user.upsert({
    where: {
      email: "admin@boloexpress.com"
    },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@boloexpress.com",
      phone: "840000000",
      password: passwordHash,
      role: "ADMIN"
    }
  });

  const cakes = [
    {
      name: "Bolo de Aniversário",
      description: "Bolo personalizado com creme, chocolate e mensagem especial para aniversários.",
      price: 2500,
      imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80",
      category: "Aniversário",
      available: true
    },
    {
      name: "Bolo de Casamento",
      description: "Bolo elegante e decorado para cerimónias de casamento e festas especiais.",
      price: 8500,
      imageUrl: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=900&q=80",
      category: "Casamento",
      available: true
    },
    {
      name: "Bolo de Graduação",
      description: "Bolo temático para celebrar conquistas académicas e formaturas.",
      price: 4000,
      imageUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=80",
      category: "Graduação",
      available: true
    },
    {
      name: "Bolo Infantil",
      description: "Bolo colorido e divertido para festas infantis.",
      price: 3200,
      imageUrl: "https://images.unsplash.com/photo-1605807646983-377bc5a76493?auto=format&fit=crop&w=900&q=80",
      category: "Infantil",
      available: true
    },
    {
      name: "Bolo de Chocolate",
      description: "Bolo de chocolate cremoso, ideal para festas e celebrações.",
      price: 2800,
      imageUrl: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=900&q=80",
      category: "Chocolate",
      available: true
    },
    {
      name: "Bolo Simples Decorado",
      description: "Bolo simples, bonito e económico para pequenos eventos.",
      price: 1800,
      imageUrl: "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=900&q=80",
      category: "Simples",
      available: true
    }
  ];

  for (const cake of cakes) {
    const exists = await prisma.cake.findFirst({
      where: {
        name: cake.name
      }
    });

    if (!exists) {
      await prisma.cake.create({
        data: cake
      });
    }
  }

  console.log("Dados iniciais criados com sucesso!");
  console.log("Admin:");
  console.log("Email: admin@boloexpress.com");
  console.log("Senha: 123456");
}

main()
  .catch((error) => {
    console.error("Erro ao criar dados iniciais:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });