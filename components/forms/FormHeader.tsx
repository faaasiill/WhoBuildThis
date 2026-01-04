import { motion } from "framer-motion";

const FormHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center space-y-3"
    >
      <h1 className="text-5xl sm:text-5xlxl md:text-5xl font-bold text-white tracking-tighter">
        Share Your Project
      </h1>
      <p className="text-sm text-zinc-400 tracking-tighter max-w-md mx-auto">
        Share your creation with our community. Your submission will be reviewed
        before going live.
      </p>
    </motion.div>
  );
};

export default FormHeader;
