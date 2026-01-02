"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import FormHeader from "./FormHeader";
import FormInput from "./FormInput";
import FormTextarea from "./FormTextarea";
import FormFileUpload from "./FormFileUpload";
import FormTags from "./FormTags";
import SubmitButton from "./SubmitButton";
import { addProduct } from "@/lib/products/product-actions";

interface FormData {
    name: string;
    slug: string;
    tagline: string;
    description: string;
    webUrl: string;
    image: File | null;
    tags: string[];
}

const SubmitProjectForm = () => {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        slug: "",
        tagline: "",
        description: "",
        webUrl: "",
        image: null,
        tags: [],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateField = (field: keyof FormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            toast.error("Project name is required");
            return false;
        }
        if (!formData.slug.trim()) {
            toast.error("Slug is required");
            return false;
        }
        if (!formData.tagline.trim()) {
            toast.error("Tagline is required");
            return false;
        }
        if (!formData.description.trim()) {
            toast.error("Description is required");
            return false;
        }
        if (!formData.webUrl.trim()) {
            toast.error("Web URL is required");
            return false;
        }
        if (!formData.image) {
            toast.error("Project image is required");
            return false;
        }
        if (formData.tags.length === 0) {
            toast.error("At least one tag is required");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        // Show loading toast
        const loadingToast = toast.loading("Submitting your project...");

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("slug", formData.slug);
            formDataToSend.append("tagline", formData.tagline);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("webUrl", formData.webUrl);

            if (formData.image) {
                formDataToSend.append("image", formData.image);
            }

            formDataToSend.append("tags", JSON.stringify(formData.tags));

            const result = await addProduct(formDataToSend);

            // Dismiss loading toast
            toast.dismiss(loadingToast);

            if (result.success) {
                // Show success toast
                toast.success("Success!", {
                    description: "Your project has been submitted successfully.",
                    duration: 5000,
                });

                // Reset form after successful submission
                setFormData({
                    name: "",
                    slug: "",
                    tagline: "",
                    description: "",
                    webUrl: "",
                    image: null,
                    tags: [],
                });
            } else {
                // Show error toast
                toast.error("Submission Failed", {
                    description: result.message || "Failed to submit project. Please try again.",
                    duration: 5000,
                });
            }
        } catch (error) {
            // Dismiss loading toast
            toast.dismiss(loadingToast);

            // Show error toast
            toast.error("An Error Occurred", {
                description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
                duration: 5000,
            });

            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen mt-20 mb-80 bg-black flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl"
            >
                <form onSubmit={handleSubmit} className="space-y-8">
                    <FormHeader />

                    <div className="space-y-6">
                        <FormInput
                            name="name"
                            label="Project Name"
                            placeholder="My Awesome Project"
                            value={formData.name}
                            onChange={(value) =>
                                updateField("name", value)
                            }
                            delay={0.1}
                        />

                        <FormInput
                            name="slug"
                            label="Slug"
                            placeholder="my-awesome-project"
                            value={formData.slug}
                            onChange={(value) => updateField("slug", value)}
                            helperText="URL friendly version of your project name"
                            delay={0.2}
                        />

                        <FormInput
                            name="tagline"
                            label="Tagline"
                            placeholder="A brief, catchy description"
                            value={formData.tagline}
                            onChange={(value) => updateField("tagline", value)}
                            delay={0.3}
                        />

                        <FormTextarea
                            name="description"
                            label="Description"
                            placeholder="Tell us more about your project"
                            value={formData.description}
                            onChange={(value) =>
                                updateField("description", value)
                            }
                            delay={0.4}
                        />

                        <FormInput
                            name="webUrl"
                            label="Web URL"
                            placeholder="https://yourproject.com"
                            value={formData.webUrl}
                            onChange={(value) => updateField("webUrl", value)}
                            delay={0.5}
                        />

                        <FormFileUpload
                            name="image"
                            label="Project Image"
                            onChange={(file) => updateField("image", file)}
                            delay={0.6}
                        />

                        <FormTags
                            name="tags"
                            label="Tags"
                            tags={formData.tags}
                            onChange={(tags) => updateField("tags", tags)}
                            delay={0.7}
                        />
                    </div>

                    <SubmitButton isSubmitting={isSubmitting} />
                </form>
            </motion.div>
        </div>
    );
};

export default SubmitProjectForm;