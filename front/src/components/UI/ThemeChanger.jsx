import { useEffect, useState } from "react";
import { changeTheme } from "../../utils/api/user";
import { useTheme } from "next-themes";
function DarkModeToggle({ currentTheme, token }) {
  const themes = ["Light", "Dark", "Green", "Blue"];
  const { theme, setTheme } = useTheme(currentTheme);
  async function toggleDarkMode(Theme) {
    const theme = Theme.toLowerCase();
    await changeTheme(token, theme);
    setTheme(theme);
  }
  useEffect(() => setMounted(true), []);
  const [mounted, setMounted] = useState(false);
  if (!mounted) return null;
  return (
    <div className="p-8 flex justify-between items-center font-bold text-xl bg-background-secondary text-primary-text gap-2">
      <span>The current theme is:</span>
      <div>
        <label htmlFor="theme-select" className="sr-only">
          Choose theme:
        </label>
        <select
          name="theme"
          id="theme-select"
          className="bg-white text-gray-800 border-gray-800 border py-1 px-3"
          onChange={(e) => toggleDarkMode(e.currentTarget.value)}
          value={theme}
        >
          <option value="">Select Theme</option>
          {themes.map((t) => (
            <option key={t.toLowerCase()} value={t.toLowerCase()}>
              {t}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default DarkModeToggle;
