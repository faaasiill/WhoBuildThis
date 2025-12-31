import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  delay?: number;
}

const FormInput = ({
  label,
  placeholder,
  value,
  onChange,
  helperText,
  delay = 0,
}: FormInputProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className="space-y-2"
    >
      <Label
        htmlFor={label}
        className="text-xs text-zinc-300 tracking-tight font-medium"
      >
        {label}
      </Label>
      <Input
        id={label}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 text-sm tracking-tight focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-all duration-200 hover:border-zinc-700"
      />
      {helperText && (
        <p className="text-xs text-zinc-500 tracking-tight">{helperText}</p>
      )}
    </motion.div>
  );
};

export default FormInput;