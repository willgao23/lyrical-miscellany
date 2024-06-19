import { Logo } from "./Logo"
import { ThemeDisplay } from "./ThemeDisplay"

interface HeaderProps {
    theme: any
}

export const Header = ({theme}: HeaderProps) => {
    return (
        <div className="header">
            <Logo />
            <ThemeDisplay theme={theme}/>
        </div>
    )
}