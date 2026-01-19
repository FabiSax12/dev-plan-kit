import { Moon, Sun, Monitor } from "lucide-react";
import { UserTheme, useTheme } from "../lib/ThemeProvider";
import { Button } from "./ui/button";

const themeConfig: Record<UserTheme, { Icon: React.ElementType; label: string }> = {
    light: { Icon: Sun, label: "Light" },
    dark: { Icon: Moon, label: "Dark" },
    system: { Icon: Monitor, label: "System" },
};

export const ThemeToggle = () => {
    const { userTheme, setTheme } = useTheme();

    const getNextTheme = () => {
        const themes = Object.keys(themeConfig) as UserTheme[];
        const currentIndex = themes.indexOf(userTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        return themes[nextIndex];
    };

    return (
        <Button onClick={() => setTheme(getNextTheme())} className="w-28">
            <span className="not-system:light:flex hidden items-center gap-2">
                <span className="ml-1">{<themeConfig.light.Icon />}</span>
                {themeConfig.light.label}
            </span>
            <span className="not-system:dark:flex hidden items-center gap-2">
                <span className="ml-1">{<themeConfig.dark.Icon />}</span>
                {themeConfig.dark.label}
            </span>
            <span className="system:flex hidden items-center gap-2">
                <span className="ml-1">{<themeConfig.system.Icon />}</span>
                {themeConfig.system.label}
            </span>
        </Button>
    );
};