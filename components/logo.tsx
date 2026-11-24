import Image from "next/image";

export function Logo({ format = "xl" }: { format?: "sm" | "xl" }) {
  if (format == "sm")
    return <Image src="/logo.svg" width={50} height={50} alt="Logo" />;

  return (
    <div className="flex items-center gap-4 select-none">
      <Image src="/logo.svg" width={50} height={50} alt="Logo" />
      <div className="flex flex-col">
        <span className="text-sm text-neutral-950 font-medium">
          Google Developer Groups
        </span>
        <span className="text-xs text-neutral-600">
          Politechnika Warszawska
        </span>
      </div>
    </div>
  );
}
