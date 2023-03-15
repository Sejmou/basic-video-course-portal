import { useEffect } from "react";

/**
 * Enables use of provided keyboard shortcuts defined via
 * array of tuples (keyCombo keys + handler function).
 *
 * The handler functions also receive the keyboard event in case they
 * need to do additional handling, e. g. calling preventDefault().
 *
 * Shortcuts are enabled on whole page (while component using this hook is mounted).
 */
export function useKeyboardShortcuts(
  keyBindings: [
    keyCombo: KeyComboKeys,
    handler: (event: KeyboardEvent) => void
  ][],
  element: HTMLElement = document.body,
  preventDefault = true
) {
  useEffect(() => {
    const keyBindingKeysAndVals: [string, (event: KeyboardEvent) => void][] =
      keyBindings.map(([c, h]) => [createKeybindingMapKey(c), h]);
    const keyBindingsMap = new Map<string, (event: KeyboardEvent) => void>(
      keyBindingKeysAndVals
    );

    const handleKeyDown = (event: KeyboardEvent) => {
      const mapKey = createKeybindingMapKey(event);
      keyBindingsMap.get(mapKey)?.(event);
      if (preventDefault) {
        event.preventDefault();
      }
    };

    element.addEventListener("keydown", handleKeyDown, true);

    // remove listener on component unmount
    return () => {
      element.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [keyBindings, element, preventDefault]);
}

type KeyComboKeys = Pick<KeyboardEvent, "key"> &
  Partial<Pick<KeyboardEvent, "altKey" | "ctrlKey" | "metaKey" | "shiftKey">>;

function createKeybindingMapKey(keyComboKeys: KeyComboKeys) {
  const { key, altKey, ctrlKey, metaKey, shiftKey } = keyComboKeys;
  return [key, !!altKey, !!ctrlKey, !!metaKey, !!shiftKey].join();
}
