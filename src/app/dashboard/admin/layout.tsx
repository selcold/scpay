import { Metadata } from "next";
import { ScPayAdminProvider } from "@/hooks/useScPayUser";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      template: `%s | Admin - ScPay`,
      default: `Dashboard`,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ScPayAdminProvider noAdmin="/dashboard">{children}</ScPayAdminProvider>
  );
}
