interface ThemeDisplayProps {
    theme: any
}

export const ThemeDisplay = ({theme}: ThemeDisplayProps) => {
    return (
        <div>
            {`Today's theme: ${theme}`}
        </div>
    )
}