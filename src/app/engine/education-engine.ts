export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    reward: number;
    explanation: string;
}

export const QUIZZES: QuizQuestion[] = [
    {
        id: 'q_kcc',
        question: "What is the primary benefit of the Kisan Credit Card (KCC)?",
        options: ["Free tractor subsidies", "Low-interest farming loans", "Free weather updates", "Guaranteed market prices"],
        correctIndex: 1,
        reward: 500,
        explanation: "KCC provides farmers with timely and adequate credit at very low interest rates (around 7%) compared to moneylenders."
    },
    {
        id: 'q_pmfby',
        question: "What does the PMFBY (Pradhan Mantri Fasal Bima Yojana) scheme protect you against?",
        options: ["Theft of farm equipment", "Crop loss due to natural calamities", "Medical emergencies", "Market price drops"],
        correctIndex: 1,
        reward: 500,
        explanation: "PMFBY is the government's flagship crop insurance scheme that financially protects farmers if crops are destroyed by weather or pests."
    },
    {
        id: 'q_compound',
        question: "Why is a local Moneylender's 36% interest rate extremely dangerous?",
        options: ["They require too much paperwork", "Debt grows exponentially faster, leading to a debt trap", "They give loans in cash only", "There is no difference from a bank"],
        correctIndex: 1,
        reward: 1000,
        explanation: "High-interest loans compound rapidly. A ₹10,000 loan at 36% becomes unpayable much faster than a standard 7% bank loan, often trapping farmers in permanent debt."
    },
    {
        id: 'q_diversify',
        question: "What is 'Crop Diversification' in financial terms?",
        options: ["Planting only one high-value crop every year", "Growing different types of crops to spread out risk", "Selling crops to different mandis", "Using multiple types of chemical fertilizers"],
        correctIndex: 1,
        reward: 500,
        explanation: "Growing different crops ensures that if one fails due to disease or weather, the others might still survive. It is the farming equivalent of 'don't put all your eggs in one basket'."
    },
    {
        id: 'q_inflation',
        question: "Why is keeping all your savings as cash in a box at home a bad idea?",
        options: ["Cash loses value over time due to inflation", "The bank will charge you a fee", "You cannot use cash to buy seeds", "It is bad luck"],
        correctIndex: 0,
        reward: 800,
        explanation: "Inflation means things get more expensive over time. ₹1,000 today buys less than it did 5 years ago. Putting money in a Fixed Deposit (FD) helps it grow to beat inflation."
    }
];

export const getRandomQuiz = (completedIds: string[]): QuizQuestion | null => {
    const available = QUIZZES.filter(q => !completedIds.includes(q.id));
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
};