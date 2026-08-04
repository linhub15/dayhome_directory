const THEME_STORAGE_KEY = "dayhome-theme";

type ThemePreference = "dark" | "light" | "system";

const themeScript = `(() => {
  try {
    const preference = localStorage.getItem("${THEME_STORAGE_KEY}") || "system";
    const isDark = preference === "dark" ||
      (preference === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  } catch {}
})();`;

function setThemePreference(preference: ThemePreference) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  const isDark =
    preference === "dark" ||
    (preference === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
}

/** Applies the saved light, dark, or system preference before the UI paints. */
function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}

export {
  setThemePreference,
  THEME_STORAGE_KEY,
  ThemeScript,
  type ThemePreference,
};
