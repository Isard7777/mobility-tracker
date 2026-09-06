export const DEFAULT_TREE_GROWTH_MAX_KM = 10_000;

export function parseTreeGrowthMaxKm(value: string | undefined): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TREE_GROWTH_MAX_KM;
}

export const TREE_GROWTH = {
    maxKm: parseTreeGrowthMaxKm(process.env.NEXT_PUBLIC_TREE_GROWTH_MAX_KM),
    steps: 20,
};

export function getTreeGrowthStep(totalKm: number): number {
    const sanitizedKm = Math.max(0, totalKm);
    return Math.min(TREE_GROWTH.steps, Math.ceil((sanitizedKm / TREE_GROWTH.maxKm) * TREE_GROWTH.steps));
}

export function getTreeGrowthProgress(totalKm: number): number {
    return getTreeGrowthStep(totalKm) / TREE_GROWTH.steps;
}
