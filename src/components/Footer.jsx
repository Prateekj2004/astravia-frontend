export default function Footer() {
  return (
    <footer className="border-t bg-white/70 backdrop-blur mt-10">
      <div className="max-w-5xl mx-auto px-4 py-4 text-xs text-gray-500 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Astravia · All rights reserved.</span>
        <span>Reports are for guidance & entertainment purposes only.</span>
      </div>
    </footer>
  );
}
