import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Flame } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
  const links: NavLinkProps[] = [{ label: "Dashboard", href: "/dashboard" }];

  return (
    <header className="sticky top-0 z-10 py-2 border-b bg-background">
      <nav className="container flex items-center gap-5 mx-auto h-10">
        {/* leave like this for now maybe use an svg icon later on */}
        <NavLogo />
        <NavLinks links={links} />
        <NavSearchBar />
        <NavUserDetails />
      </nav>
    </header>
  );
}

function NavLogo() {
  return (
    <h1 className="text-xl font-semibold text-nowrap">
      <span className="text-primary">{"</>"}</span> PeerPrep
    </h1>
  );
}

interface NavLinkProps {
  href: string;
  label: string;
}

function NavLink({ href, label }: NavLinkProps) {
  return (
    <Link className="text-base text-primary" href={href}>
      {label}
    </Link>
  );
}

interface NavLinksProps {
  links: NavLinkProps[];
}

function NavLinks({ links }: NavLinksProps) {
  return (
    <div className="flex gap-1">
      {links.map((link, i) => (
        <NavLink key={i} href={link.href} label={link.label} />
      ))}
    </div>
  );
}

function NavSearchBar() {
  return (
    <form className="grow">
      <Input placeholder="Search for a question or username" />
    </form>
  );
}

function NavUserDetails() {
  const noOfStreakDays = 1;
  return (
    <div className="flex items-center gap-3">
      <Flame
        className={noOfStreakDays > 0 ? "stroke-primary" : "stroke-muted"}
        size={20}
      />
      <small className="whitespace-nowrap">10 days</small>
      <UserAvatar src={"https://nonexistent-link"} name="Jm San Diego" />
      <LogoutButton />
    </div>
  );
}
