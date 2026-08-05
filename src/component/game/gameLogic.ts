export type Hand = "グー" | "チョキ" | "パー";
export type PlayerHand = Hand | "グチョパ";

export const hands: Hand[] = ["グー", "チョキ", "パー"];

export type Deck = Record<Hand, number>;
export type PlayerDeck = Deck & Record<"グチョパ", number>;

export const initialDeck: PlayerDeck = {
    グー: Number.POSITIVE_INFINITY,
    チョキ: Number.POSITIVE_INFINITY,
    パー: Number.POSITIVE_INFINITY,
    グチョパ: 0,
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

export function calculateRecoveredLife(
    currentLife: number,
    recovery: number,
): number {
    if (currentLife <= 0 || recovery <= 0) {
        return Math.max(0, currentLife);
    }

    return Math.min(INITIAL_LIFE, currentLife + recovery);
}

const winsAgainst: Record<Hand, Hand> = {
    グー: "チョキ",
    チョキ: "パー",
    パー: "グー",
};

export function judgeResult(player: PlayerHand, opponent: Hand): JudgeResult {
    if (player === "グチョパ") {
        return "win";
    }
    if (player === opponent) {
        return "draw";
    }
    return winsAgainst[player] === opponent ? "win" : "lose";
}

