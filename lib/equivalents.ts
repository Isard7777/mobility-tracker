// Approximate communication equivalents for the wall display, not calculation inputs.
const KG_CO2_PER_TREE_PER_YEAR = 25;
const CAR_SOLO_FACTOR_KG_PER_KM = 0.218;
const LIEGE_BRUSSELS_ROUND_TRIP_KM = 200;
const LIEGE_PARIS_ROUND_TRIP_KM = 600;
const KG_CO2_PER_FLIGHT_HOUR = 100;
const KG_CO2_PER_HOT_SHOWER = 10;
const KG_CO2_PER_BEEF_STEAK = 1;

export type Equivalents = {
    treeYears: number;
    liegeBrusselsCarRoundTrips: number;
    liegeParisCarRoundTrips: number;
    flightHours: number;
    smartphoneChargeYears: number;
    hotShowers: number;
    beefSteaks: number;
};

export function getEquivalents(co2SavedKg: number): Equivalents {
    return {
        treeYears: Number((co2SavedKg / KG_CO2_PER_TREE_PER_YEAR).toFixed(1)),
        liegeBrusselsCarRoundTrips: Number(
            (co2SavedKg / (LIEGE_BRUSSELS_ROUND_TRIP_KM * CAR_SOLO_FACTOR_KG_PER_KM)).toFixed(1)
        ),
        liegeParisCarRoundTrips: Number(
            (co2SavedKg / (LIEGE_PARIS_ROUND_TRIP_KM * CAR_SOLO_FACTOR_KG_PER_KM)).toFixed(1)
        ),
        flightHours: Number((co2SavedKg / KG_CO2_PER_FLIGHT_HOUR).toFixed(1)),
        smartphoneChargeYears: Number(co2SavedKg.toFixed(1)),
        hotShowers: Number((co2SavedKg / KG_CO2_PER_HOT_SHOWER).toFixed(1)),
        beefSteaks: Number((co2SavedKg / KG_CO2_PER_BEEF_STEAK).toFixed(1)),
    };
}
