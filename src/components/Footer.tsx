import { InfoButton } from "./InfoButton"
import { MistakeTracker } from "./MistakeTracker"

interface FooterProps {
  mistakeCount: number
}

export const Footer = ({mistakeCount}: FooterProps) => {
    return (
      <div className='footer'>
        <InfoButton/>
        <MistakeTracker mistakeCount={mistakeCount}/>
      </div>
    )
  }