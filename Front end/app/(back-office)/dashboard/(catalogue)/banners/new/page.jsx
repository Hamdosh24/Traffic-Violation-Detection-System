"use client";
import React, { useState } from "react";
import FormHeader from "@/components/backoffice/FormHeader";
import TextInput from "@/components/FormInputs/TextInput";
import TextAreaInput from "@/components/FormInputs/TextAreaInput";
import SubmitButton from "@/components/FormInputs/SubmitButton";
import { useForm } from "react-hook-form";
// import "@/lib/generateSlug";
// import generateSlug from "@/lib/generateSlug";
import ImageInput from "@/components/FormInputs/imageinput";
import { makePostRequest } from "@/lib/apiRequest";

export default function NewBanner() {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    {
      /*
      -id => auto()
      -title
       link
      -image
      */
    }
    // const slug = generateSlug(data.title);
    // data.slug = slug;
    data.imageUrl = imageUrl;
    console.log(data);
    makePostRequest(setLoading, "api/banners", data, "Banner", reset);
    setImageUrl("");
  }
  return (
    <div>
      <FormHeader title="New Banner" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3"
      >
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <TextInput
            label="Banner Title"
            errors={errors}
            name="title"
            register={register}
          />
          <TextAreaInput
            label="Banner Link"
            name="link"
            type="url"
            register={register}
            errors={errors}
          />
          {/* Configuer this endpoint in the core js */}
          <ImageInput
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            endpoint="BannerImageUploader"
            label="Banner Image"
          />
        </div>
        <SubmitButton
          isLoading={loading}
          buttonTitle="Create Banner"
          LoadingButtonTitle="Creating Banner please wait..."
        />
      </form>
    </div>
  );
}
