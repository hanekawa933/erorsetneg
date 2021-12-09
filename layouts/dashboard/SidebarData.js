import { Icon } from "@iconify/react";

const dashboard = "majesticons:dashboard";
const profile = "vs:profile";
const account = "bx:bxs-user-account";
const category = "ic:outline-category";
const reportIcon = "carbon:report";
const history = "bx:bx-history";
const faq = "eva:question-mark-circle-fill";
const getIcon = (icon) => <Icon icon={icon} width={22} height={22} />;

const general = [
  {
    text: "beranda",
    icon: getIcon(dashboard),
    to: "/home",
  },
  {
    text: "profil",
    icon: getIcon(profile),
    to: "/profile",
  },
];

const user = [
  {
    text: "riwayat",
    to: "/history",
    icon: getIcon(history),
  },
  {
    text: "faq",
    to: "/faq",
    icon: getIcon(faq),
  },
];

export { general, user };
