import { GameState } from "../context/game-context";

export const getAdvisorTip = (state: GameState): string => {
    const { savings, debt, totalAcres, activeSchemes, bankBalance, creditScore, ownedAssets, isPovertySpiral } = state;

    const urgentTips: string[] = [];
    const actionableTips: string[] = [];

    // 1. URGENT TIPS (These take top priority if true)
    if (debt > savings * 2 && debt > 10000) {
        urgentTips.push("⚠️ Urgent: Your debt is growing dangerously high. Focus on repaying loans before you expand your farm!");
    }
    if (isPovertySpiral) {
        urgentTips.push("🚨 Warning: You are in a poverty spiral! Do not take any more loans from the Moneylender, seek Co-op or Bank loans.");
    }
    if (debt > 50000 && activeSchemes.includes('miss') && creditScore >= 600) {
        urgentTips.push("💡 Use your Credit Score! You applied for MISS, so prioritize getting the 4% KCC loan over expensive alternatives.");
    }

    // 2. ACTIONABLE TIPS (Things the player can literally go do right now)
    if (totalAcres <= 5.0 && !activeSchemes.includes('pm_kisan')) {
        actionableTips.push("💡 Tip: You own 5 acres or less! Visit Govt Schemes to claim your ₹2,000 PM-KISAN benefit every season.");
    }
    if (savings > 50000 && bankBalance.fixedDeposit === 0) {
        actionableTips.push(`📈 Tip: You have ₹${savings.toLocaleString()} sitting idle. Put some in a Fixed Deposit to beat inflation!`);
    }
    if (!activeSchemes.includes('soil_health')) {
        actionableTips.push("🌱 Tip: Apply for the Soil Health Card scheme to permanently reduce your fertilizer and seed costs by 10%.");
    }
    if (!activeSchemes.includes('pmfby')) {
        actionableTips.push("🛡️ Tip: Farming is risky. Enroll in the PMFBY scheme to get a 50% subsidy on your crop insurance.");
    }
    if (creditScore < 650 && debt > 0) {
        actionableTips.push("🏦 Tip: Repay your loans fully to improve your Credit Score. It unlocks the cheaper KCC loan from the bank.");
    }
    if (savings >= 60000 && !ownedAssets.includes('solar_pump') && !activeSchemes.includes('pm_kusum')) {
        actionableTips.push("☀️ Tip: You have enough savings to invest in a Solar Pump. Apply for PM-KUSUM first to get 50% off in the shop!");
    }
    if (totalAcres < 5 && savings >= 40000) {
         actionableTips.push("🚜 Tip: You have enough for a down payment on new land. Expanding your farm increases your earning potential.");
    }
    if (bankBalance.goldGrams === 0 && savings > 30000) {
        actionableTips.push("🪙 Tip: Diversify your wealth! You can buy Digital Gold in the Bank as a safe store of value.");
    }

    // 3. EDUCATIONAL / PRAISE (Fallback tips if player is doing everything perfectly)
    const generalTips = [
        "Remember: A moneylender's 36% interest rate can quickly lead to a debt trap.",
        "Crop diversification is the best natural insurance against pests and unpredictable weather.",
        "Buying assets like Drip Irrigation reduces your vulnerability to droughts.",
        "Always check the market transport costs. Sometimes selling locally is more profitable than paying for a truck.",
        "🌟 Excellent work! Your farm is financially healthy. Don't forget to save up for your Life Goals!"
    ];

    // SELECT THE BEST TIP POOL
    let pool = [];
    if (urgentTips.length > 0) {
        pool = urgentTips;
    } else if (actionableTips.length > 0) {
        pool = actionableTips;
    } else {
        pool = generalTips;
    }

    // RANDOMLY SELECT FROM THE POOL
    // This guarantees the tip changes every time the Dashboard re-renders, even if the state hasn't changed!
    return pool[Math.floor(Math.random() * pool.length)];
};