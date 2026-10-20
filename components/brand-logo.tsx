import Image from "next/image";

export function BrandLogo({ className = "", priority = false }: { className?: string; priority?: boolean }) {
  return <Image src="/images/rdk-logo.png" alt="RDK Financial Services" width={1632} height={964} className={className} priority={priority} />;
}
