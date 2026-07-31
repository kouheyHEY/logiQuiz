import { useCallback, useEffect, useRef, useState } from "react";
import type {
    Hand,
    JudgeResult,
} from "../component/game/gameLogic";

export type BattlePhase = "dealing" | "revealing" | "resolved";

export type BattleSequence = {
    playerHand: Hand;
    opponentHand: Hand;
    result: JudgeResult;
    phase: BattlePhase;
};

export type BattlePayload = Omit<BattleSequence, "phase">;

const normalDurations = {
    dealing: 420,
    revealing: 620,
    resolved: 900,
    drawResolved: 1650,
};

const reducedMotionDurations = {
    dealing: 30,
    revealing: 30,
    resolved: 120,
    drawResolved: 180,
};

export function useBattleSequence(
    onResolve: (battle: BattlePayload) => void,
) {
    const [sequence, setSequence] = useState<BattleSequence | null>(null);
    const onResolveRef = useRef(onResolve);

    useEffect(() => {
        onResolveRef.current = onResolve;
    }, [onResolve]);

    const start = useCallback((battle: BattlePayload) => {
        setSequence((current) =>
            current ? current : { ...battle, phase: "dealing" },
        );
    }, []);

    useEffect(() => {
        if (!sequence) {
            return;
        }

        const prefersReducedMotion =
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ??
            false;
        const durations = prefersReducedMotion
            ? reducedMotionDurations
            : normalDurations;

        if (sequence.phase === "dealing") {
            const timeoutId = window.setTimeout(() => {
                setSequence((current) =>
                    current ? { ...current, phase: "revealing" } : null,
                );
            }, durations.dealing);
            return () => window.clearTimeout(timeoutId);
        }

        if (sequence.phase === "revealing") {
            const timeoutId = window.setTimeout(() => {
                onResolveRef.current({
                    playerHand: sequence.playerHand,
                    opponentHand: sequence.opponentHand,
                    result: sequence.result,
                });
                setSequence((current) =>
                    current ? { ...current, phase: "resolved" } : null,
                );
            }, durations.revealing);
            return () => window.clearTimeout(timeoutId);
        }

        const resolvedDuration =
            sequence.result === "draw"
                ? durations.drawResolved
                : durations.resolved;
        const timeoutId = window.setTimeout(() => {
            setSequence(null);
        }, resolvedDuration);
        return () => window.clearTimeout(timeoutId);
    }, [sequence]);

    return {
        sequence,
        isPlaying: sequence !== null,
        start,
    };
}
