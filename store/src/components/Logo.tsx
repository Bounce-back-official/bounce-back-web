import Image from "next/image";

// โลโก้จริง Bounce Back (ปีก B + wordmark) — สัดส่วน 1058 x 652
const RATIO = 1058 / 652;

export function Logo({
  height = 40,
  variant = "white",
  priority = false,
}: {
  height?: number;
  variant?: "white" | "black";
  priority?: boolean;
}) {
  return (
    <Image
      src={variant === "white" ? "/logo-white.png" : "/logo-black.png"}
      alt="Bounce Back"
      width={Math.round(height * RATIO)}
      height={height}
      priority={priority}
    />
  );
}
