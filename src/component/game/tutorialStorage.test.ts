import {
    completeTutorial,
    hasCompletedTutorial,
    TUTORIAL_COMPLETED_KEY,
} from "./tutorialStorage";

describe("tutorialStorage", () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    it("完了履歴がない場合は未完了として扱う", () => {
        expect(hasCompletedTutorial()).toBe(false);
    });

    it("完了履歴を保存すると次回から完了として扱う", () => {
        completeTutorial();
        expect(window.localStorage.getItem(TUTORIAL_COMPLETED_KEY)).toBe(
            "true",
        );
        expect(hasCompletedTutorial()).toBe(true);
    });

    it("ストレージが利用できなくても例外にしない", () => {
        const unavailableStorage = {
            getItem: () => {
                throw new Error("unavailable");
            },
            setItem: () => {
                throw new Error("unavailable");
            },
        };

        expect(hasCompletedTutorial(unavailableStorage)).toBe(false);
        expect(() => completeTutorial(unavailableStorage)).not.toThrow();
    });
});
