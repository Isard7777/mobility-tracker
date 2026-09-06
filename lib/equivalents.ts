import { CAR_SOLO_FACTOR_KG_PER_KM, MODE_FACTORS_KG_PER_KM } from "./co2";

// Transport-only display comparisons use the same ADEME/Impact CO2 dataset as lib/co2.ts.
const LIEGE_BRUSSELS_ROUND_TRIP_KM = 200;
const LIEGE_PARIS_ROUND_TRIP_KM = 600;
const SHORT_HAUL_FLIGHT_KG_CO2_PER_KM = 0.224572;
// Communication estimates with the assumptions repeated in the display labels.
const KG_CO2_PER_TREE_PER_YEAR = 25;
const KG_CO2_PER_BEEF_STEAK = 4.2;
const KG_CO2_PER_HOT_SHOWER = 0.4;
const KG_CO2_PER_SMARTPHONE_CHARGING_YEAR = 0.7;

export type Equivalents = {
    liegeBrusselsCarRoundTrips: number;
    liegeParisCarRoundTrips: number;
    intercityTrainKm: number;
    shortHaulFlightKm: number;
    treeYears: number;
    beefSteaks: number;
    hotShowers: number;
    smartphoneChargingYears: number;
};

export function getEquivalents(co2SavedKg: number): Equivalents {
    return {
        liegeBrusselsCarRoundTrips: Number(
            (co2SavedKg / (LIEGE_BRUSSELS_ROUND_TRIP_KM * CAR_SOLO_FACTOR_KG_PER_KM)).toFixed(1)
        ),
        liegeParisCarRoundTrips: Number(
            (co2SavedKg / (LIEGE_PARIS_ROUND_TRIP_KM * CAR_SOLO_FACTOR_KG_PER_KM)).toFixed(1)
        ),
        intercityTrainKm: Number((co2SavedKg / MODE_FACTORS_KG_PER_KM.train).toFixed(1)),
        shortHaulFlightKm: Number((co2SavedKg / SHORT_HAUL_FLIGHT_KG_CO2_PER_KM).toFixed(1)),
        treeYears: Number((co2SavedKg / KG_CO2_PER_TREE_PER_YEAR).toFixed(1)),
        beefSteaks: Number((co2SavedKg / KG_CO2_PER_BEEF_STEAK).toFixed(1)),
        hotShowers: Number((co2SavedKg / KG_CO2_PER_HOT_SHOWER).toFixed(1)),
        smartphoneChargingYears: Number((co2SavedKg / KG_CO2_PER_SMARTPHONE_CHARGING_YEAR).toFixed(1)),
    };
}
