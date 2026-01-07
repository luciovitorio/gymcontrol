import "dotenv/config";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import morgan from "morgan";
import { asyncHandler } from "./middlewares/assyncHandler.middleware.js";
import { NotFoundException } from "./utils/appError.js";
import { HTTPSTATUS } from "./configs/http.config.js";
import { ErrorCodeEnum } from "./enums/errorCode.enum.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { config } from "./configs/app.config.js";
import { sequelize } from "./libs/sequelize.js";
import cookieParser from "cookie-parser";

// === ROTAS ===
import { authRoutes } from "./modules/auth/routes/auth.routes.js";
import { userRoutes } from "./modules/users/routes/user.routes.js";
import { planRoutes } from "./modules/plans/routes/plan.routes.js";
import { userPlanRoutes } from "./modules/plans/routes/userPlan.routes.js";
import { classRoutes } from "./modules/classes/routes/class.routes.js";
import { enrollmentRoutes } from "./modules/classes/routes/enrollment.routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("trust proxy", 1); // se estiver atrás de proxy (NGINX/Heroku/etc)
app.use(cookieParser());
app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.use(morgan("dev"));

app.get(
  `/`,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    throw new NotFoundException(
      "This is a bad request",
      ErrorCodeEnum.AUTH_USER_NOT_FOUND
    );
    return res.status(HTTPSTATUS.OK).json({
      message: "Hello Subscribe to the channel & share",
    });
  })
);

// === REGISTRO DAS ROTAS ===
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/plans", planRoutes);
app.use(userPlanRoutes);
app.use("/classes", classRoutes);
app.use(enrollmentRoutes);

// Rota 404 — tem que ser o ÚLTIMO middleware antes do errorHandler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(
    new NotFoundException(
      `Rota ${req.originalUrl} não encontrada`,
      ErrorCodeEnum.RESOURCE_NOT_FOUND
    )
  );
});

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(`✅ Server rodando na porta ${config.PORT}`);
  console.log(`✅ Modo: ${config.NODE_ENV}`);
  console.log(`✅ Frontend permitido: ${config.FRONTEND_ORIGIN}`);
  console.log(`✅ Acesse: http://localhost:${config.PORT}`);
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado ao PostgreSQL");
  } catch (err) {
    console.error("❌ Erro ao conectar ao PostgreSQL:", err);
  }
});
