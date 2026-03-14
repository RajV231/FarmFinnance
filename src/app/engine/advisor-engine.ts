import { GameState } from "../context/game-context";

export interface AdvisorTip {
    key: string;
    val?: number;
}

export const getAdvisorTip = (state: GameState): AdvisorTip => {
    const { savings, debt, totalAcres, activeSchemes, bankBalance, creditScore, ownedAssets, isPovertySpiral } = state;

    const urgentTips: AdvisorTip[] = [];
    const actionableTips: AdvisorTip[] = [];

    if (debt > savings * 2 && debt > 10000) urgentTips.push({ key: "adv_urgent_debt" });
    if (isPovertySpiral) urgentTips.push({ key: "adv_poverty_spiral" });
    if (debt > 50000 && activeSchemes.includes('miss') && creditScore >= 600) urgentTips.push({ key: "adv_use_score" });

    if (totalAcres <= 5.0 && !activeSchemes.includes('pm_kisan')) actionableTips.push({ key: "adv_pm_kisan" });
    if (savings > 50000 && bankBalance.fixedDeposit === 0) actionableTips.push({ key: "adv_fd_idle", val: savings });
    if (!activeSchemes.includes('soil_health')) actionableTips.push({ key: "adv_soil_health" });
    if (!activeSchemes.includes('pmfby')) actionableTips.push({ key: "adv_pmfby" });
    if (creditScore < 650 && debt > 0) actionableTips.push({ key: "adv_improve_credit" });
    if (savings >= 60000 && !ownedAssets.includes('solar_pump') && !activeSchemes.includes('pm_kusum')) actionableTips.push({ key: "adv_solar_kusum" });
    if (totalAcres < 5 && savings >= 40000) actionableTips.push({ key: "adv_expand_land" });
    if (bankBalance.goldGrams === 0 && savings > 30000) actionableTips.push({ key: "adv_buy_gold" });

    const generalTips: AdvisorTip[] = [
        { key: "adv_gen_moneylender" },
        { key: "adv_gen_diversify" },
        { key: "adv_gen_drip" },
        { key: "adv_gen_transport" },
        { key: "adv_gen_praise" }
    ];

    let pool = [];
    if (urgentTips.length > 0) pool = urgentTips;
    else if (actionableTips.length > 0) pool = actionableTips;
    else pool = generalTips;

    return pool[Math.floor(Math.random() * pool.length)];
};