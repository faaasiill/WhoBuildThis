import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

const SubmitButton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="pt-4"
    >
      <Button
        type="submit"
        className="w-full bg-white text-black hover:bg-zinc-200 transition-all duration-200 text-sm tracking-tight font-medium py-6 group"
      >
        <span className="flex items-center justify-center gap-2">
          Submit Project
          <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </span>
      </Button>
    </motion.div>
  );
};

export default SubmitButton;