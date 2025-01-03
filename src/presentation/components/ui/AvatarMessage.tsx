interface Props {
  label: string;
  bgColor: string;
}

export const AvatarMessage = ({ label, bgColor }: Props) => {
  return (
    <div
      className={`flex items-center justify-center h-10 w-10 rounded-full  flex-shrink-0 ${bgColor}`}
    >
      {label}
    </div>
  );
};
