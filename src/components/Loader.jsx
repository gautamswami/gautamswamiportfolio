"use client"

export default function Loader({ visible }) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#242424] transition-opacity duration-700 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!visible}
      role="status"
    >
      <p className="text-[11px] tracking-[0.45em] text-white/80">yooo!</p>
    </div>
  )
}
