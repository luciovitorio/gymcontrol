import { RefreshToken } from "@/modules/auth/models/refreshToken.model.js";
import { User } from "@/modules/users/models/user.model.js";

export async function logoutService(refreshToken: string) {
  const token = await RefreshToken.findOne({ where: { token: refreshToken } });
  if (!token) return;
  await RefreshToken.destroy({ where: { token: refreshToken } });
  await User.increment({ tokenVersion: 1 }, { where: { id: token.userId } });
}
