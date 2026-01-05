import { RefreshToken } from "@/modules/auth/models/refreshToken.model.js";

export async function logoutService(refreshToken: string) {
  await RefreshToken.destroy({ where: { token: refreshToken } });
}
