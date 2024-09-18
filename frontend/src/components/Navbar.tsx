import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Flame, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AvatarImage } from "@radix-ui/react-avatar";

export default function Navbar() {
  const links: NavLinkProps[] = [{ label: "Dashboard", href: "/dashboard" }];

  return (
    <header className="sticky top-0 py-2 border-b bg-background">
      <nav className="container mx-auto flex gap-5 items-center">
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
    <h1 className="text-nowrap text-xl font-semibold">
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
        <NavLink href={link.href} label={link.label} />
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
    <div className="flex gap-3 items-center">
      <Flame
        className={noOfStreakDays > 0 ? "stroke-primary" : "stroke-muted"}
        size={20}
      />
      <small className="whitespace-nowrap">10 days</small>
      <Avatar>
      <AvatarImage src="https://nonexistent-link/shadcn.png" alt="@shadcn" />
        <AvatarFallback className="bg-background-100 rounded-full p-1">
          JM
        </AvatarFallback>
      </Avatar>

      <Button variant="ghost" className="p-2">
        <LogOut size={20}/>
      </Button>
    </div>
  );
}
