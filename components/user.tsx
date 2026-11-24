import Image from "next/image";

export function User({ format = "xl" }: { format?: "sm" | "xl" }) {
  if (format == "sm")
    return (
      <Image
        src="/człowiek.jpg"
        width={50}
        height={50}
        alt="Logo"
        className="rounded-full"
      />
    );

  return (
    <div className="flex items-center gap-4 select-none">
      <div className="flex flex-col items-end">
        <span className="text-sm text-neutral-950 font-medium">
          Arkadiusz Wołk
        </span>
        <span className="text-xs text-neutral-600">Administrator</span>
      </div>
      <Image
        src="/człowiek.jpg"
        width={50}
        height={50}
        alt="Logo"
        className="rounded-full"
      />
    </div>
  );
}
