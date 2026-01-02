import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Upload, X, Image, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FormFileUploadProps {
    name: string;
    label: string;
    onChange: (file: File | null) => void;
    delay?: number;
}

const FormFileUpload = ({
    name,
    label,
    onChange,
    delay = 0,
}: FormFileUploadProps) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    const ACCEPTED_IMAGE_TYPES = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
    ];

    const validateFile = (file: File): string | null => {
        // Check file type
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            return "Invalid file type. Please upload an image file (JPG, PNG, GIF, or WebP).";
        }

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            return `File size exceeds 5MB. Your file is ${(
                file.size /
                (1024 * 1024)
            ).toFixed(2)}MB.`;
        }

        return null;
    };

    const handleFileChange = (file: File | null) => {
        setError(null);

        if (!file) {
            return;
        }

        const validationError = validateFile(file);

        if (validationError) {
            setError(validationError);
            onChange(null);
            return;
        }

        // File is valid, proceed with preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.onerror = () => {
            setError("Failed to read file. Please try again.");
        };

        try {
            reader.readAsDataURL(file);
            setFileName(file.name);
            onChange(file);
        } catch (err) {
            setError("An error occurred while processing the file.");
            onChange(null);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFileChange(file);
    };

    const clearFile = () => {
        setPreview(null);
        setFileName(null);
        setError(null);
        onChange(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay }}
            className="space-y-2"
        >
            <Label className="text-xs text-zinc-300 tracking-tight font-medium">
                {label}
            </Label>

            {!preview ? (
                <>
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-lg transition-all duration-200 ${
                            isDragging
                                ? "border-zinc-500 bg-zinc-900/50"
                                : error
                                ? "border-red-900 hover:border-red-800"
                                : "border-zinc-800 hover:border-zinc-700"
                        }`}
                    >
                        <input
                            type="file"
                            name={name}
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            onChange={(e) =>
                                handleFileChange(e.target.files?.[0] || null)
                            }
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                            <Upload
                                className={`w-8 h-8 mb-3 ${
                                    error ? "text-red-600" : "text-zinc-600"
                                }`}
                            />
                            <p className="text-sm text-zinc-400 tracking-tight mb-1">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-zinc-600 tracking-tight">
                                PNG, JPG, GIF, WebP up to 5MB
                            </p>
                        </div>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Alert className="bg-red-950/20 border-red-900 text-red-400">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription className="text-xs tracking-tight ml-2">
                                        {error}
                                    </AlertDescription>
                                </Alert>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900"
                >
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Image className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                            <span className="text-xs text-zinc-300 tracking-tight truncate">
                                {fileName}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={clearFile}
                            className="p-1 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors flex-shrink-0 ml-2"
                        >
                            <X className="w-4 h-4 text-zinc-300" />
                        </button>
                    </div>
                </motion.div>
            )}

            <p className="text-xs text-zinc-500 tracking-tight">
                Upload your project image (max 5MB)
            </p>
        </motion.div>
    );
};

export default FormFileUpload;