import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ theme, setTheme }) => (
    <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        aria-label="Toggle theme"
    >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
);

export default ThemeToggle;
