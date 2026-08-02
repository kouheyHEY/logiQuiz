export type Hand = "グー" | "チョキ" | "パー";

export const hands: Hand[] = ["グー", "チョキ", "パー"];

export type Deck = Record<Hand, number>;

export const initialDeck: Deck = {
    グー: Number.POSITIVE_INFINITY,
    チョキ: Number.POSITIVE_INFINITY,
    パー: Number.POSITIVE_INFINITY,
};

export function normalizeDeck(deck: Deck): Deck {
    return {
        グー: deck.グー > 0 ? Number.POSITIVE_INFINITY : 0,
        チョキ: deck.チョキ > 0 ? Number.POSITIVE_INFINITY : 0,
        パー: deck.パー > 0 ? Number.POSITIVE_INFINITY : 0,
    };
}

export function randomHand(): Hand {
    const index = Math.floor(Math.random() * hands.length);
    return hands[index];
}

export function mapNumberToHand(value: number): Hand {
    const index = (value - 1) % 3;
    return hands[index];
}

export type JudgeResult = "win" | "lose" | "draw";

export const INITIAL_LIFE = 2;

const lifeDamage: Record<JudgeResult, number> = {
    win: 0,
    draw: 0.5,
    lose: 1,
};

export function calculateRemainingLife(
    currentLife: number,
    result: JudgeResult,
): number {
    return Math.max(0, currentLife - lifeDamage[result]);
}

const winsAgainst: Record<Hand, Hand> = {
    グー: "チョキ",
    チョキ: "パー",
    パー: "グー",
};

export function judgeResult(player: Hand, opponent: Hand): JudgeResult {
    if (player === opponent) {
        return "draw";
    }
    return winsAgainst[player] === opponent ? "win" : "lose";
}

