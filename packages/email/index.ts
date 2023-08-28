import { Resend } from "resend";

export default new Resend("re_Sw6rdktq_5bD7wzeJFVobQM5n2tfeL5SZ");

import WelcomeEmail from "./emails/welcome-en";
import WelcomeEmailTr from "./emails/welcome-en";

export const GetEmailTemplate = ({ type, language = "en", props }: { type: "welcome"; language: string; props: object }) => {
  if (type === "welcome" && language === "en") return WelcomeEmail(props);
  if (type === "welcome" && language === "tr") return WelcomeEmailTr(props);
};

export { render } from "@react-email/render";
