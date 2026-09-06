import { LockKeyhole } from "lucide-react";
import { AdminAccess } from "@/components/admin/AdminAccess";

export default function AdminPage() {
    return (
        <main className="relative min-h-dvh overflow-hidden px-6 py-12 text-emerald-950 sm:px-10 lg:px-16">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/kanenori-sunset-7133867.jpg')" }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[#eaf6e5]/80"
            />
            <div className="relative mx-auto max-w-5xl">
                <div className="flex items-start gap-4 border-b border-emerald-950/20 pb-8">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-emerald-800 text-white">
                        <LockKeyhole
                            aria-hidden="true"
                            size={24}
                        />
                    </span>
                    <div>
                        <p className="text-sm font-semibold tracking-[0.16em] text-emerald-700 uppercase">
                            Mobility Tracker
                        </p>
                        <h1 className="mt-1 text-4xl font-bold">Administration</h1>
                        <p className="mt-2 text-lg text-emerald-950/70">
                            Protected exports, participant roster management, and journey-data controls.
                        </p>
                    </div>
                </div>
                <AdminAccess />
            </div>
        </main>
    );
}
