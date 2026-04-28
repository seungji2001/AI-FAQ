export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "피드", href: "/" },
  { label: "탐색", href: "/explore" },
  { label: "발행", href: "/write" },
  { label: "마이페이지", href: "/mypage" },
];
