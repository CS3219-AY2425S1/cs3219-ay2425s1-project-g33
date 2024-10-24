import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Flame } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import React from "react";
import { twMerge } from "tailwind-merge";
import LogoutButton from "./LogoutButton";
import { getCurrentUser } from "@/services/userService";
import { redirect } from "next/navigation";

interface NavbarProps {
  isMinimal?: boolean;
  className?: string;
}

export default function Navbar({ isMinimal = false, className }: NavbarProps) {
  const links: NavLinkProps[] = [{ label: "Dashboard", href: "/dashboard" }];

  return (
    <header
      className={twMerge(
        `sticky top-0 z-10 py-2 border-b bg-background`,
        className
      )}
    >
      <nav className="container flex items-center h-10 gap-5 mx-auto">
        {/* leave like this for now maybe use an svg icon later on */}
        <NavLogo />
        {!isMinimal && (
          <>
            <NavLinks links={links} />
            <NavSearchBar />
            <NavUserDetails />
          </>
        )}
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

async function NavUserDetails() {
  const userProfileResponse = await getCurrentUser();

  if (userProfileResponse.statusCode === 401) {
    redirect("/auth/signin");
  }

  if (!userProfileResponse.data) {
    return <div>{userProfileResponse.message}</div>;
  }

  const noOfStreakDays = 1;

  return (
    <div className="flex items-center gap-3">
      <Flame
        className={noOfStreakDays > 0 ? "stroke-primary" : "stroke-muted"}
        size={20}
      />
      <small className="whitespace-nowrap">{10} day(s)</small>
      <UserAvatar userProfile={userProfileResponse.data} />
      <LogoutButton />
    </div>
  );
}
