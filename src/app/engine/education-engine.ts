export interface QuizQuestion {
    id: string;
    questionKey: string;
    optionsKeys: string[];
    correctIndex: number;
    reward: number;
    explanationKey: string;
}

export const QUIZZES: QuizQuestion[] = [
    {
        id: 'q_kcc',
        questionKey: "quiz_kcc_q",
        optionsKeys: ["quiz_kcc_o1", "quiz_kcc_o2", "quiz_kcc_o3", "quiz_kcc_o4"],
        correctIndex: 1,
        reward: 500,
        explanationKey: "quiz_kcc_exp"
    },
    {
        id: 'q_pmfby',
        questionKey: "quiz_pmfby_q",
        optionsKeys: ["quiz_pmfby_o1", "quiz_pmfby_o2", "quiz_pmfby_o3", "quiz_pmfby_o4"],
        correctIndex: 1,
        reward: 500,
        explanationKey: "quiz_pmfby_exp"
    },
    {
        id: 'q_compound',
        questionKey: "quiz_compound_q",
        optionsKeys: ["quiz_compound_o1", "quiz_compound_o2", "quiz_compound_o3", "quiz_compound_o4"],
        correctIndex: 1,
        reward: 1000,
        explanationKey: "quiz_compound_exp"
    },
    {
        id: 'q_diversify',
        questionKey: "quiz_div_q",
        optionsKeys: ["quiz_div_o1", "quiz_div_o2", "quiz_div_o3", "quiz_div_o4"],
        correctIndex: 1,
        reward: 500,
        explanationKey: "quiz_div_exp"
    },
    {
        id: 'q_inflation',
        questionKey: "quiz_inf_q",
        optionsKeys: ["quiz_inf_o1", "quiz_inf_o2", "quiz_inf_o3", "quiz_inf_o4"],
        correctIndex: 0,
        reward: 800,
        explanationKey: "quiz_inf_exp"
    }
];

export const getRandomQuiz = (completedIds: string[]): QuizQuestion | null => {
    const available = QUIZZES.filter(q => !completedIds.includes(q.id));
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
};