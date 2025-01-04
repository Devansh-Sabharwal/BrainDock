import { FC } from "react";

interface ButtonProps {
  variant:"primary"|"secondary";
  size:"sm"|"md"|"lg";
  text?: string;
  icon?: FC; // Functional Component type
  color: "white"|"black";
  onClick:()=>void;
}
const buttonVariant={
  "primary": " h-fit w-fit text-inter font-medium cursor-pointer rounded-lg hover:duration-75",
  "secondary":"h-fit w-fit text-inter font-normal flex gap-2 cursor-pointer rounded-lg hover:duration-75 items-center",
}
const buttonSize={
  "lg":"text-xl px-8 py-2 pb-3",
  "md":"text-sm px-3 py-2",
  "sm":"text-sm px-1 py-1"
}
const buttonColor={
  white:"bg-white text-black hover:bg-gray-300",
  black:"bg-black text-white hover:bg-gray-1000 border-2 border-gray-1000",
}
export function Button({ variant,size,text,color, icon: Icon,onClick }: ButtonProps) {
  const variantCss = buttonVariant[variant];
  const sizeCss = buttonSize[size];
  const colorCss = buttonColor[color];

  const className = `${variantCss} ${sizeCss} ${colorCss}`;
  return (
    <div onClick={onClick} className={className}>
      {Icon&&<Icon /> }
      {text&&<span>{text}</span>}
    </div>
  );
}
interface RoundeProps{
  icon: FC;
  onClick:()=>void;
}
export function RoundedButton({icon: Icon,onClick}:RoundeProps){
  return <div onClick={onClick} className="my-6 mx-4 rounded-full h-12 w-12 bg-gray-100 flex items-center justify-center">
    <Icon/>
  </div>

}
