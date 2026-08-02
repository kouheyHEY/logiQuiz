export const TUTORIAL_COMPLETED_KEY = "logiquiz:tutorial-completed";

function getLocalStorage(): Storage | null {
    try {
        return typeof window === "undefined" ? null : window.localStorage;
    } catch {
        return null;
    }
}

export function hasCompletedTutorial(
    storage: Pick<Storage, "getItem"> | null = getLocalStorage(),
): boolean {
    try {
        return storage?.getItem(TUTORIAL_COMPLETED_KEY) === "true";
    } catch {
        return false;
    }
}

export function completeTutorial(
    storage: Pick<Storage, "setItem"> | null = getLocalStorage(),
): void {
    try {
        storage?.setItem(TUTORIAL_COMPLETED_KEY, "true");
    } catch {
        // 保存できない環境でもゲームの進行は継続する。
    }
}
