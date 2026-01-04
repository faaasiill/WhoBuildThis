import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting?: boolean;
}

const SubmitButton = ({ isSubmitting = false }: SubmitButtonProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="pt-4"
    >
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-white text-black hover:bg-zinc-200 transition-all duration-200 text-sm tracking-tight font-medium py-6 group disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <span className="flex items-center justify-center gap-2">
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit Project
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </>
          )}
        </span>
      </Button>
    </motion.div>
  );
};

export default SubmitButton;
