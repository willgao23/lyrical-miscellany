interface AlertProps {
    text: string;
}

export const Alert = ({text}: AlertProps) => {
  return <div className="alert">{text}</div>;
};
