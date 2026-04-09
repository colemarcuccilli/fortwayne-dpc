import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** px height at which to render the logo image */
  height?: number;
}

/**
 * Real Fort Wayne DPC logo. The file lives at /public/assets and is
 * rendered as a fixed-height image — width auto-scales by intrinsic ratio.
 */
export function Logo({ className, height = 40 }: LogoProps) {
  return (
    <span
      className={cn("inline-flex items-center", className)}
      aria-label="Fort Wayne Direct Primary Care"
    >
      <Image
        src="/assets/FortWayneDPCLogoPNG.png"
        alt="Fort Wayne Direct Primary Care"
        width={Math.round(height * 2.8)}
        height={height}
        priority
        className="h-auto w-auto object-contain"
        style={{ height, width: "auto" }}
      />
    </span>
  );
}
