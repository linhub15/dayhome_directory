const THEME_STORAGE_KEY = "dayhome-theme";

type ThemePreference = "dark" | "light" | "system";

const themeScript = `(() => {
  try {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const getPreference = () => {
      const storedPreference = localStorage.getItem("${THEME_STORAGE_KEY}");
      return storedPreference === "light" || storedPreference === "dark"
        ? storedPreference
        : "system";
    };
    const applyTheme = () => {
      const preference = getPreference();
      const isDark = preference === "dark" ||
        (preference === "system" && mediaQuery.matches);
      document.documentElement.classList.toggle("dark", isDark);
      document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    };

    applyTheme();
    mediaQuery.addEventListener("change", applyTheme);
    window.addEventListener("storage", (event) => {
      if (event.key === "${THEME_STORAGE_KEY}") applyTheme();
    });
  } catch {}
})();`;

function setThemePreference(preference: ThemePreference) {
  if (typeof window === "undefined") return;

  if (preference === "system") {
    window.localStorage.removeItem(THEME_STORAGE_KEY);
  } else {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  }
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
