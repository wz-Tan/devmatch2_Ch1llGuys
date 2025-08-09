import { FC } from "react";
import { LucideIcon } from "lucide-react"; // for icon typing

interface Step {
  icon: LucideIcon; // expects a lucide-react icon component
  title: string;
  desc: string;
}

interface StepCardProps {
  step: Step;
}

const StepCard: FC<StepCardProps> = ({ step }) => {
  const Icon = step.icon; // assign to a capitalized variable for JSX
  return (
    <div className="bg-[rgb(15,15,15)] p-5 rounded-md">
      <div className="w-16 h-16 bg-[rgb(20,20,20)] rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-orange-500" />
      </div>
      <h3 className="font-bold mb-3">{step.title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
    </div>
  );
};

export default StepCard;