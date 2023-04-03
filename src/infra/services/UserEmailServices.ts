import { User } from "@entities/User.entity";

export class UserEmailServices implements UserNS.EmailServices {
  async sendEmailConfirmationCode(user: User, code: string) {
    console.log("Verification Code:", code)
  };
}