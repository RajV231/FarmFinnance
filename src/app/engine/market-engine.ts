export interface Mandi {
    id: string;
    name: string;
    priceMultiplier: number;
    transportCostPerAcre: number;
    description: string;
}

export const generateMarketOptions = (): Mandi[] => {
    return [
        {
            id: 'local',
            name: 'Local Village APMC',
            priceMultiplier: 0.85 + Math.random() * 0.15, // 0.85x to 1.0x Base Price
            transportCostPerAcre: 0,
            description: 'Sell immediately in your village. Lower prices, but zero transport costs.'
        },
        {
            id: 'district',
            name: 'District Main Mandi',
            priceMultiplier: 1.05 + Math.random() * 0.20, // 1.05x to 1.25x Base Price
            transportCostPerAcre: 2000,
            description: 'Rent a small truck to the district. Good balance of price and transport cost.'
        },
        {
            id: 'state',
            name: 'State Agricultural Market',
            priceMultiplier: 1.30 + Math.random() * 0.30, // 1.30x to 1.60x Base Price
            transportCostPerAcre: 6000, // Very expensive transport
            description: 'Hire heavy transport to the big city. Highest market prices, but very high fees.'
        }
    ];
};