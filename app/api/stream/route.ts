import { showIndividualWeeklyCo2 } from "@/lib/feature-flags";
import { subscribeToEntries } from "@/lib/sse";
import { getTotals } from "@/lib/totals";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEARTBEAT_MS = 20_000;

export async function GET(request: Request) {
    const includeIndividualWeeklyCo2 =
        showIndividualWeeklyCo2 && new URL(request.url).searchParams.get("includeIndividualWeeklyCo2") === "true";
    const initialTotals = await getTotals({ includeIndividualWeeklyCo2 });
    const encoder = new TextEncoder();
    let cleanup = () => {};

    const stream = new ReadableStream({
        start(controller) {
            const send = (event: string, data: unknown) => {
                controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
            };
            const heartbeat = setInterval(() => controller.enqueue(encoder.encode(":ping\n\n")), HEARTBEAT_MS);
            const unsubscribe = subscribeToEntries(async (entry) => {
                const totals = await getTotals({ includeIndividualWeeklyCo2 });
                send("update", { entry, totals });
            });

            cleanup = () => {
                clearInterval(heartbeat);
                unsubscribe();
            };
            request.signal.addEventListener("abort", cleanup, { once: true });
            send("totals", { totals: initialTotals });
        },
        cancel() {
            cleanup();
        },
    });

    return new Response(stream, {
        headers: {
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "Content-Type": "text/event-stream; charset=utf-8",
            "X-Accel-Buffering": "no",
        },
    });
}
