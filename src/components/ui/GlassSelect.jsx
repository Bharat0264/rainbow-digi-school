import { useEffect, useRef, useState } from "react";
import "./GlassSelect.css";

const BADGE_CONFIG = {
  default: {
    theme: "badge-amber",
    type: "icon",
    icon: "grad",
  },
  Nursery: {
    theme: "badge-rose",
    type: "icon",
    icon: "sprout",
  },
  LKG: {
    theme: "badge-mint",
    type: "icon",
    icon: "book",
  },
  UKG: {
    theme: "badge-purple",
    type: "icon",
    icon: "star",
  },
  "Grade 1": {
    theme: "badge-blue",
    type: "num",
    num: "1",
  },
  "Grade 2": {
    theme: "badge-orange",
    type: "num",
    num: "2",
  },
  "Grade 3": {
    theme: "badge-lime",
    type: "num",
    num: "3",
  },
  "Grade 4": {
    theme: "badge-violet",
    type: "num",
    num: "4",
  },
  "Grade 5": {
    theme: "badge-pink",
    type: "num",
    num: "5",
  },
};

function BadgeIcon({ config }) {
  if (config.type === "num") {
    return <span className="badge-num">{config.num}</span>;
  }
  if (config.icon === "grad") {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M12 4.2l8.8 4.2c.4.2.4.8 0 1L12 13.6c-.3.1-.7.1-1 0L2.2 9.4c-.4-.2-.4-.8 0-1L11 4.2c.3-.1.7-.1 1 0z" />
        <path d="M5.5 10.2v4.8c0 .6-.5 1-1 1s-1-.4-1-1v-4.8a.8.8 0 0 1 2 0z" />
        <path d="M20.5 10.2v4.8c0 .6-.5 1-1 1s-1-.4-1-1v-4.8a.8.8 0 0 1 2 0z" />
        <path d="M7 12.8v2.6c0 2.2 2.2 3.9 5 3.9s5-1.7 5-3.9v-2.6l-4.5 2.2c-.3.1-.7.1-1 0L7 12.8z" />
      </svg>
    );
  }
  if (config.icon === "sprout") {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <rect x="10.8" y="13.2" width="2.4" height="6.6" rx="1.2" />
        <path d="M11.2 13.6C10.2 11.5 7.6 9 4.6 7.8c-1.8-.7-3.4.1-3.6 1.4-.2 1.3.8 3.2 2.8 4.5 2.5 1.6 5.8 1.4 7.4-.1z" />
        <path d="M12.8 13.6c1-2.1 3.6-4.6 6.6-5.8 1.8-.7 3.4.1 3.6 1.4.2 1.3-.8 3.2-2.8 4.5-2.5 1.6-5.8 1.4-7.4-.1z" />
      </svg>
    );
  }
  if (config.icon === "book") {
    return (
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3.8 6.6C5.5 5.8 8 5.6 11.2 6.8v11.8c-3.2-1.1-5.7-.9-7.4-.1V6.6z" />
        <path d="M20.2 6.6C18.5 5.8 16 5.6 12.8 6.8v11.8c3.2-1.1 5.7-.9 7.4-.1V6.6z" />
      </svg>
    );
  }
  if (config.icon === "star") {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M12 3.2c.4 0 .8.2 1 .6l2.1 4.7 5.1.5c.5.1.8.5.8 1 0 .3-.1.6-.3.8l-3.9 3.4 1.1 5.1c.1.5-.2.9-.6 1.1-.3.2-.7.2-1 0L12 17.8l-4.3 2.6c-.4.2-.8.2-1.1 0-.4-.2-.7-.6-.6-1.1l1.1-5.1-3.9-3.4c-.4-.3-.5-.8-.3-1.2.2-.4.6-.7 1-.7l5.1-.5 2.1-4.7c.2-.4.6-.6 1-.6z" />
      </svg>
    );
  }
  return null;
}

export default function GlassSelect({
  id,
  name = "program",
  value,
  defaultValue = "",
  options = [],
  placeholder = "Select a class",
  required = false,
  disabled = false,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedby,
  onChange,
}) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const selectedValue = isControlled ? value : internalValue;

  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const nativeSelectRef = useRef(null);
  const optionsListRef = useRef(null);

  // All choices including default placeholder row
  const items = [
    { value: "", label: placeholder, isPlaceholder: true },
    ...options.map((opt) => ({ value: opt, label: opt, isPlaceholder: false })),
  ];

  const currentBadgeConfig =
    BADGE_CONFIG[selectedValue] || BADGE_CONFIG.default;
  const currentLabel = selectedValue || placeholder;

  function selectOption(val) {
    if (!isControlled) {
      setInternalValue(val);
    }
    if (nativeSelectRef.current) {
      nativeSelectRef.current.value = val;
      nativeSelectRef.current.dispatchEvent(
        new Event("change", { bubbles: true }),
      );
      nativeSelectRef.current.dispatchEvent(
        new Event("input", { bubbles: true }),
      );
    }
    onChange?.(val);
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  // Handle native select changes (e.g. programmatic tests)
  function handleNativeChange(e) {
    const val = e.target.value;
    if (!isControlled) {
      setInternalValue(val);
    }
    onChange?.(val);
  }

  // Synchronize form reset
  useEffect(() => {
    const nativeEl = nativeSelectRef.current;
    if (!nativeEl) return;
    const form = nativeEl.closest("form");
    if (!form) return;
    const onReset = () => {
      if (!isControlled) {
        setInternalValue(defaultValue || "");
      }
    };
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, [defaultValue, isControlled]);

  // Forward focus from native select to custom trigger
  useEffect(() => {
    const nativeEl = nativeSelectRef.current;
    if (!nativeEl) return;
    const onFocus = () => {
      triggerRef.current?.focus();
    };
    nativeEl.addEventListener("focus", onFocus);
    return () => nativeEl.removeEventListener("focus", onFocus);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation on trigger
  function handleTriggerKeyDown(e) {
    if (disabled) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setIsOpen(true);
      const currIndex = items.findIndex((item) => item.value === selectedValue);
      setFocusedIndex(currIndex >= 0 ? currIndex : 0);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
      const currIndex = items.findIndex((item) => item.value === selectedValue);
      setFocusedIndex(currIndex >= 0 ? currIndex : 0);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  // Keyboard navigation inside dropdown list
  function handleListKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < items.length) {
        selectOption(items[focusedIndex].value);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === "Tab") {
      setIsOpen(false);
    }
  }

  return (
    <div
      ref={containerRef}
      className={`glass-select-container ${isOpen ? "is-open" : ""}`}
    >
      {/* Hidden native select for form submissions, standard FormData & Playwright */}
      <select
        ref={nativeSelectRef}
        id={id}
        name={name}
        value={selectedValue}
        required={required}
        disabled={disabled}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedby}
        onChange={handleNativeChange}
        className="glass-select-native"
        tabIndex={-1}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {/* 3D Glass Trigger Capsule */}
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={id ? `${id}-listbox` : "glass-select-listbox"}
        aria-label={
          selectedValue ? `Class of interest: ${selectedValue}` : placeholder
        }
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedby}
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen((prev) => !prev);
            const currIndex = items.findIndex(
              (item) => item.value === selectedValue,
            );
            setFocusedIndex(currIndex >= 0 ? currIndex : 0);
          }
        }}
        onKeyDown={handleTriggerKeyDown}
        className="glass-select-trigger"
      >
        <div className="glass-trigger-left">
          <div className={`glass-badge ${currentBadgeConfig.theme}`}>
            <BadgeIcon config={currentBadgeConfig} />
          </div>
          <span className="glass-trigger-label">{currentLabel}</span>
        </div>
        <div className="glass-chevron-circle" aria-hidden="true">
          <svg className="glass-chevron-icon" viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* 3D Glass Dropdown Panel */}
      {isOpen && (
        <ul
          ref={optionsListRef}
          id={id ? `${id}-listbox` : "glass-select-listbox"}
          role="listbox"
          tabIndex={-1}
          onKeyDown={handleListKeyDown}
          className="glass-select-dropdown"
        >
          {items.map((item, idx) => {
            const badgeCfg = BADGE_CONFIG[item.value] || BADGE_CONFIG.default;
            const isSelected = selectedValue === item.value;
            const isFocused = focusedIndex === idx;

            return (
              <li
                key={item.value || "__default__"}
                role="option"
                aria-selected={isSelected}
                tabIndex={-1}
                className={`glass-option-item ${isSelected ? "is-selected" : ""} ${
                  isFocused ? "is-focused" : ""
                }`}
                onClick={() => selectOption(item.value)}
                onMouseEnter={() => setFocusedIndex(idx)}
              >
                <div className={`glass-badge ${badgeCfg.theme}`}>
                  <BadgeIcon config={badgeCfg} />
                </div>
                <span className="glass-option-label">{item.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
