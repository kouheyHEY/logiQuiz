import { hands, type Deck, type Hand } from "./gameLogic";

export type EnemyProfile = {
    id: string;
    name: string;
    trait: string;
    deck: Deck;
    favoredHand?: Hand;
    favoredHandWeight?: number;
    isStrong?: boolean;
    requiredWins?: number;
    lieChance?: number;
    line: string;
};

export type EnemyBattleState = {
    profile: EnemyProfile;
    deck: Deck;
    plannedHand: Hand;
    line: string;
};

export type EnemyLoopState = {
    normalWins: number;
    normalWinsRequired: number;
};

export const tutorialEnemy: EnemyProfile = {
    id: "tutorial-rock",
    name: "グーだけの練習相手",
    trait: "最初の操作を教える練習相手。グーだけを出す。",
    deck: { グー: Infinity, チョキ: 0, パー: 0 },
    favoredHand: "グー",
    line: "グーを出すぞ。パーなら勝てる！",
};

export const normalEnemies: EnemyProfile[] = [
    {
        id: "rock-man",
        name: "グーを出したい男",
        trait: "拳で語りたがる。グーを出す確率が高い。",
        deck: { グー: Infinity, チョキ: Infinity, パー: 0 },
        favoredHand: "グー",
        favoredHandWeight: 4,
        line: "今日は拳で勝負したい気分だ。",
    },
    {
        id: "scissors-woman",
        name: "チョキが大好きな女",
        trait: "チョキへの愛が強く、チョキを出す確率が高い。",
        deck: { グー: Infinity, チョキ: Infinity, パー: 0 },
        favoredHand: "チョキ",
        favoredHandWeight: 4,
        line: "今日はチョキしか愛せないわ。",
    },
    {
        id: "palm-sekiwake",
        name: "手のひら関",
        trait: "大きな手のひらが自慢。パーを出す確率が高い。",
        deck: { グー: Infinity, チョキ: 0, パー: Infinity },
        favoredHand: "パー",
        favoredHandWeight: 6,
        line: "この手のひらで受け止めてやる。",
    },
];

export const strongEnemies: EnemyProfile[] = [
    {
        id: "usomatsu",
        name: "嘘松",
        trait: "発言の多くが嘘。宣言した手をそのまま信じるのは危険。",
        deck: { グー: Infinity, チョキ: Infinity, パー: Infinity },
        isStrong: true,
        requiredWins: 2,
        lieChance: 0.8,
        line: "",
    },
    {
        id: "resisting-man",
        name: "抵抗する男",
        trait: "すべての手を使えるが、グーを強く好む。勝負前のヒントは一切ない。",
        deck: { グー: Infinity, チョキ: Infinity, パー: Infinity },
        favoredHand: "グー",
        favoredHandWeight: 7,
        isStrong: true,
        requiredWins: 2,
        line: "……",
    },
];

function cloneDeck(deck: Deck): Deck {
    return { ...deck };
}

function selectRandomProfile(
    profiles: EnemyProfile[],
    random: () => number,
    excludedId?: string,
): EnemyProfile {
    const candidates = profiles.filter((profile) => profile.id !== excludedId);
    const selectableProfiles = candidates.length > 0 ? candidates : profiles;
    const index = Math.min(
        selectableProfiles.length - 1,
        Math.floor(random() * selectableProfiles.length),
    );
    return selectableProfiles[index];
}

export function createEnemyLoopState(
    random: () => number = Math.random,
): EnemyLoopState {
    return {
        normalWins: 0,
        normalWinsRequired: 3 + Math.floor(random() * 3),
    };
}

export function getNextEnemyAfterVictory(
    currentEnemy: EnemyProfile,
    loop: EnemyLoopState,
    random: () => number = Math.random,
): { profile: EnemyProfile; loop: EnemyLoopState } {
    if (currentEnemy.id === tutorialEnemy.id) {
        return {
            profile: selectRandomProfile(normalEnemies, random),
            loop,
        };
    }

    if (currentEnemy.isStrong) {
        return {
            profile: selectRandomProfile(normalEnemies, random),
            loop: createEnemyLoopState(random),
        };
    }

    const normalWins = loop.normalWins + 1;
    if (normalWins >= loop.normalWinsRequired) {
        return {
            profile: selectRandomProfile(strongEnemies, random),
            loop: { ...loop, normalWins: 0 },
        };
    }

    return {
        profile: selectRandomProfile(
            normalEnemies,
            random,
            currentEnemy.id,
        ),
        loop: { ...loop, normalWins },
    };
}

export function selectEnemyHand(
    profile: EnemyProfile,
    deck: Deck,
    random: () => number = Math.random,
): Hand {
    const availableDeck =
        hands.some((hand) => deck[hand] > 0) ? deck : profile.deck;
    const weights = hands.map((hand) => {
        const preference =
            profile.favoredHand === hand
                ? (profile.favoredHandWeight ?? 1)
                : 1;
        return (availableDeck[hand] > 0 ? 1 : 0) * preference;
    });
    const totalWeight = weights.reduce((total, weight) => total + weight, 0);
    let target = random() * totalWeight;

    for (let index = 0; index < hands.length; index += 1) {
        target -= weights[index];
        if (target < 0) {
            return hands[index];
        }
    }

    return hands[hands.length - 1];
}

export function createEnemyLine(
    profile: EnemyProfile,
    plannedHand: Hand,
    random: () => number = Math.random,
): string {
    if (profile.lieChance === undefined) {
        return profile.line;
    }

    const willLie = random() < profile.lieChance;
    const alternatives = hands.filter((hand) => hand !== plannedHand);
    const claimedHand = willLie
        ? alternatives[Math.floor(random() * alternatives.length)]
        : plannedHand;

    return `次は${claimedHand}を出す。これは本当だ。`;
}

export function createEnemyBattleState(
    profile: EnemyProfile,
    random: () => number = Math.random,
): EnemyBattleState {
    const deck = cloneDeck(profile.deck);
    const plannedHand = selectEnemyHand(profile, deck, random);

    return {
        profile,
        deck,
        plannedHand,
        line: createEnemyLine(profile, plannedHand, random),
    };
}

export function advanceEnemyTurn(
    state: EnemyBattleState,
    random: () => number = Math.random,
): EnemyBattleState {
    const deck = cloneDeck(state.deck);
    const plannedHand = selectEnemyHand(state.profile, deck, random);

    return {
        ...state,
        deck,
        plannedHand,
        line: createEnemyLine(state.profile, plannedHand, random),
    };
}
