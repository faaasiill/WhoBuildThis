import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface FormTextareaProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  delay?: number;
}

const FormTextarea = ({
  label,
  placeholder,
  value,
  onChange,
  delay = 0,
}: FormTextareaProps) => {
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
      <Textarea
        id={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 text-sm tracking-tight focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-all duration-200 hover:border-zinc-700 resize-none"
      />
    </motion.div>
  );
};

export default FormTextarea;