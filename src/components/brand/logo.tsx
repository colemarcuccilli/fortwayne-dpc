import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** px height at which to render the logo image */
  height?: number;
}

/**
 * Real Fort Wayne DPC logo. The provided PNG has a lot of internal
 * whitespace, so we render it at a larger height than the nominal bar
 * height would suggest.
 */
export function Logo({ className, height = 56 }: LogoProps) {
  return (
    <span
      className={cn("inline-flex items-center", className)}
      aria-label="Fort Wayne Direct Primary Care"
    >
      <Image
        src="/assets/FortWayneDPCLogoPNG.png"
        alt="Fort Wayne Direct Primary Care"
        width={Math.round(height * 3.2)}
        height={height}
        priority
        className="object-contain"
        style={{ height, width: "auto" }}
      />
    </span>
  );
}
