import './TypingLoader.css';

interface Props {
  className?: string;
}

export const TypingLoader = ({ className }: Props) => {
  return (
    <div className={`typing ${className}`}>
      <span className='circle scalling'></span>
      <span className='circle scalling'></span>
      <span className='circle scalling'></span>
    </div>
  );
};
