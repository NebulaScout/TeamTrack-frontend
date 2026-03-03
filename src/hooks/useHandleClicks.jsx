import { useEffect } from "react";

export function useCloseOnOutsideClick(refs, onClose) {
  useEffect(() => {
    const handleClickOutside = (e) => {
      const isOutside = refs.every(
        (ref) => !ref.current || !ref.current.contains(e.target),
      );

      if (isOutside) onClose();
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [refs, onClose]);
}
