import TitleGenerator from "@/components/title/TitleGenerator";

export default function TitlePage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background py-8 px-2">
      <div className="w-full max-w-3xl mx-auto">
        <TitleGenerator />
      </div>
    </div>
  );
}
