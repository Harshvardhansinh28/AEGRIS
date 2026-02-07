import Image from "next/image";

export default function Header() {
  return (
    <header className="flex items-center gap-4 px-6 py-4 border-b border-white/10 bg-black/70 backdrop-blur">
      <Image
        src="/aegris-logo.png"
        alt="AEGRIS RL"
        width={140}
        height={40}
        priority
        className="object-contain"
      />

      <div className="flex flex-col leading-tight">
        <span className="text-lg font-semibold tracking-wide text-white">
          AEGRIS<span className="text-purple-500">RL</span>
        </span>
        <span className="text-xs text-gray-400">
          Strategize Your Future
        </span>
      </div>
    </header>
  );
}
