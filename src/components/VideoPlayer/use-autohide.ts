import { useEffect, useRef } from "react";

export function useAutohide(
  element: HTMLElement | null,
  active = true,
  timeout = 3000
) {
  useEffect(() => {
    let lastMouseMove = Date.now();
    if (!element) return;
    const opacityStyle = element.style.opacity;
    const cursorStyle = element.style.cursor;
    console.log({ element, opacityStyle, cursorStyle });

    const hide = () => {
      element.style.opacity = "0";
      element.style.cursor = "none";
    };

    const show = () => {
      if (!opacityStyle) {
        element.style.removeProperty("opacity");
      } else {
        element.style.opacity = opacityStyle;
      }

      if (!cursorStyle) {
        element.style.removeProperty("cursor");
      } else {
        element.style.cursor = cursorStyle;
      }
    };

    if (!active) {
      show();
      return;
    }

    const handleMouseMove = () => {
      lastMouseMove = Date.now();
      show();
      console.log("mousemove", lastMouseMove);
    };

    const timer = setInterval(() => {
      const now = Date.now();
      if (now - lastMouseMove > timeout) hide();
    }, timeout);
    document.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", hide);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", hide);
      clearInterval(timer);
    };
  }, [element, active]);
}
