"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import FormHeader from "./FormHeader";
import FormInput from "./FormInput";
import FormTextarea from "./FormTextarea";
import FormFileUpload from "./FormFileUpload";
import FormTags from "./FormTags";
import SubmitButton from "./SubmitButton";

interface FormData {
  projectName: string;
  slug: string;
  tagline: string;
  description: string;
  webUrl: string;
  image: File | null;
  tags: string[];
}

const SubmitProjectForm = () => {
  const [formData, setFormData] = useState<FormData>({
    projectName: "",
    slug: "",
    tagline: "",
    description: "",
    webUrl: "",
    image: null,
    tags: [],
  });

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your submission logic here
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
              label="Project Name"
              placeholder="My Awesome Project"
              value={formData.projectName}
              onChange={(value) => updateField("projectName", value)}
              delay={0.1}
            />

            <FormInput
              label="Slug"
              placeholder="my-awesome-project"
              value={formData.slug}
              onChange={(value) => updateField("slug", value)}
              helperText="URL friendly version of your project name"
              delay={0.2}
            />

            <FormInput
              label="Tagline"
              placeholder="A brief, catchy description"
              value={formData.tagline}
              onChange={(value) => updateField("tagline", value)}
              delay={0.3}
            />

            <FormTextarea
              label="Description"
              placeholder="Tell us more about your project"
              value={formData.description}
              onChange={(value) => updateField("description", value)}
              delay={0.4}
            />

            <FormInput
              label="Web URL"
              placeholder="https://yourproject.com"
              value={formData.webUrl}
              onChange={(value) => updateField("webUrl", value)}
              helperText="Enter your project's landing page URL"
              delay={0.5}
            />

            <FormFileUpload
              label="Project Image"
              onChange={(file) => updateField("image", file)}
              delay={0.6}
            />

            <FormTags
              label="Tags"
              tags={formData.tags}
              onChange={(tags) => updateField("tags", tags)}
              delay={0.7}
            />
          </div>

          <SubmitButton />
        </form>
      </motion.div>
    </div>
  );
};

export default SubmitProjectForm;