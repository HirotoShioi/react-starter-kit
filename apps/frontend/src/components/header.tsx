"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { AuthUser, signOut } from "aws-amplify/auth";
import { Link, useNavigate } from "react-router-dom";

export function HeaderMenuItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <DropdownMenuItem className="cursor-pointer" asChild>
      <Link to={href}>{children}</Link>
    </DropdownMenuItem>
  );
}
export function SignOutItem({ user }: { user: AuthUser | null }) {
  const navigate = useNavigate();
  if (!user) {
    return null;
  }
  return (
    <DropdownMenuItem
      onClick={() => signOut().then(() => navigate("/"))}
      className="cursor-pointer"
    >
      Sign Out
    </DropdownMenuItem>
  );
}

function HeaderActions({ user }: { user: AuthUser | null }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Menu size={24} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {user ? (
          <>
            <HeaderMenuItem href="/todos">Todos</HeaderMenuItem>
            <HeaderMenuItem href="/chat">Chat</HeaderMenuItem>
            <HeaderMenuItem href="/nft">NFT Generator</HeaderMenuItem>
            <SignOutItem user={user} />
          </>
        ) : (
          <HeaderMenuItem href="/sign-in">Sign In</HeaderMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default function Header() {
  const { user } = useAuthenticator((c) => [c.user]);
  return (
    <header className="bg-primary text-primary-foreground py-4 px-8 border-b">
      <div className="mx-auto flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link
            to={user ? "/todos" : "/"}
            className="flex gap-2 items-center text-xl"
          >
            <h1 className="text-2xl">My App</h1>
          </Link>
        </div>
        <div className="flex items-center">
          <HeaderActions user={user} />
        </div>
      </div>
    </header>
  );
}
