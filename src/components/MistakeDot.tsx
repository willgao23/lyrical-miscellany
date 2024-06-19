interface MistakeDotProps {
  isFilled: string
}

export const MistakeDot = ({isFilled}: MistakeDotProps) => {
    return (
      <div className={`mistakeDot ${isFilled}`}></div>
    )
  }