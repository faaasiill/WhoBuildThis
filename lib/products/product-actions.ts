"use server";

export const addProduct = async (formData: FormData) => {
  const image = formData.get("image") as File | null;

  console.log("Is File:", image instanceof File);
  console.log("Name:", image?.name);
  console.log("Size:", image?.size);
  console.log("Type:", image?.type);
};
