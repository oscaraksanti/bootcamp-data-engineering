import { ModuleForm } from "@/components/admin/ModuleForm";

export default function NewModulePage() {
  return (
    <div className="max-w-[1180px] mx-auto px-6 py-8">
      <h1 className="font-display font-bold text-2xl text-ink mb-6">Nouveau module</h1>
      <ModuleForm />
    </div>
  );
}
