import "dotenv/config";
import bcrypt from "bcrypt";
import { sequelize } from "@/libs/sequelize.js";
import { User } from "@/modules/users/models/user.model.js";

const ADMIN_NAME = process.env.SEED_ADMIN_NAME ?? "Admin";
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@admin.com";
const ADMIN_PASS = process.env.SEED_ADMIN_PASSWORD ?? "12345";

async function main() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: false }); // garanta que as migrações rodaram antes em prod

  const passwordHash = await bcrypt.hash(ADMIN_PASS, 12);

  const [user, created] = await User.findOrCreate({
    where: { email: ADMIN_EMAIL },
    defaults: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      passwordHash,
      role: "admin",
    },
  });

  if (created) {
    console.log(`✅ Admin criado: ${ADMIN_EMAIL}`);
  } else {
    console.log(`ℹ️ Admin já existia: ${ADMIN_EMAIL}`);
  }
}

main()
  .catch((err) => {
    console.error("❌ Seed falhou:", err);
    process.exit(1);
  })
  .finally(() => sequelize.close());
