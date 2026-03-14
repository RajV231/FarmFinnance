export interface Mandi {
    id: string;
    nameKey: string; // Changed
    priceMultiplier: number;
    transportCostPerAcre: number;
    descKey: string; // Changed
}

export const generateMarketOptions = (): Mandi[] => {
    return [
        { id: 'local', nameKey: 'mandi_local', priceMultiplier: 0.85 + Math.random() * 0.15, transportCostPerAcre: 0, descKey: 'mandi_local_desc' },
        { id: 'district', nameKey: 'mandi_district', priceMultiplier: 1.05 + Math.random() * 0.20, transportCostPerAcre: 2000, descKey: 'mandi_district_desc' },
        { id: 'state', nameKey: 'mandi_state', priceMultiplier: 1.30 + Math.random() * 0.30, transportCostPerAcre: 6000, descKey: 'mandi_state_desc' }
    ];
};