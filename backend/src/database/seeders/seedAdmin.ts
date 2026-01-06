import "dotenv/config";
import bcrypt from "bcrypt";
import { sequelize } from "@/libs/sequelize.js";
import { User } from "@/modules/users/models/user.model.js";

const defaults = {
  admin: {
    name: "Admin",
    email: "admin@email.com",
    password: "12345",
  },
  coach: {
    name: "Coach",
    email: "coach@email.com",
    password: "12345",
  },
  student: {
    name: "Aluno",
    email: "aluno@email.com",
    password: "12345",
  },
};

async function seedUser(role: "admin" | "coach" | "student") {
  const { name, email, password } = defaults[role];
  const [user, created] = await User.findOrCreate({
    where: { email },
    defaults: {
      name,
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role,
      tokenVersion: 0,
    },
  });
  console.log(
    created ? `✅ ${role} criado: ${email}` : `ℹ️ ${role} já existia: ${email}`
  );
}

async function main() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: false }); // ou migrações em prod

  await seedUser("admin");
  await seedUser("coach");
  await seedUser("student");
}

main()
  .catch((err) => {
    console.error("❌ Seed falhou:", err);
    process.exit(1);
  })
  .finally(() => sequelize.close());
