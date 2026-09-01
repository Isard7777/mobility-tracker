// Rough, illustrative equivalents to make a CO2 figure tangible on the display screen.
// Sources (order-of-magnitude approximations, not scientific references):
// - a mature tree absorbs roughly 25 kg of CO2 per year (ADEME / common forestry estimates).
// - a solo car round trip Brussels-Paris (~620 km) emits roughly 135 kg of CO2
//   at the same 0.218 kg CO2e/km average car factor used in lib/co2.ts.
const KG_CO2_PER_TREE_PER_YEAR = 25;
const BRUSSELS_PARIS_ROUND_TRIP_KM = 620;
const CAR_SOLO_FACTOR_KG_PER_KM = 0.218;
const KG_CO2_PER_BRUSSELS_PARIS_TRIP =
    BRUSSELS_PARIS_ROUND_TRIP_KM * CAR_SOLO_FACTOR_KG_PER_KM;

export type Equivalents = {
    treeYears: number;
    carTripsBrusselsParis: number;
};

export function getEquivalents(co2SavedKg: number): Equivalents {
    return {
        treeYears: Number((co2SavedKg / KG_CO2_PER_TREE_PER_YEAR).toFixed(1)),
        carTripsBrusselsParis: Number(
            (co2SavedKg / KG_CO2_PER_BRUSSELS_PARIS_TRIP).toFixed(1),
        ),
    };
}
