import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { AiFillCamera, AiFillDelete } from "react-icons/ai";

import { useMutation } from "@tanstack/react-query";

import { uploadProfilePhotoAPI } from "../../reactQuery/user/usersAPI";

const UpdateProfilePicture = () => {
  const [imageError, setImageError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const mutation = useMutation({ mutationFn: uploadProfilePhotoAPI });

  const formik = useFormik({
    initialValues: {
      profilePicture: null,
    },

    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("profilePicture", values.profilePicture);
      mutation.mutate(formData);
    },
  });

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    if (!file) return;

    if (file.size > 1048576) {
      setImageError("File size exceeds 1MB");
      return;
    }

    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setImageError("Invalid File Type");
      return;
    }

    formik.setFieldValue("profilePicture", file);
    setImagePreview(URL.createObjectURL(file));
    setImageError("");
  };

  const removeImage = () => {
    formik.setFieldValue("profilePicture", null);
    setImagePreview(null);
  };
  console.log(mutation);
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 m-4">
        <h2 className="text-2xl font-extrabold text-center text-slate-900 mb-8 tracking-tight">
          <AiFillCamera className="inline-block mr-2 text-indigo-600" /> Update Profile Picture
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Image Upload Input - File input for uploading images */}
          <div className="flex flex-col items-center">
            <label
              htmlFor="images"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
            >
              Upload Image
            </label>
            <input
              id="images"
              type="file"
              name="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-sm"
            />
            {imageError && <p className="text-xs text-rose-600 mt-1 font-medium">{imageError}</p>}
            {imagePreview && (
              <div className="mt-4 relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-full border-2 border-indigo-500 shadow"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-0 bottom-0 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-2 shadow"
                >
                  <AiFillDelete />
                </button>
              </div>
            )}
          </div>

          {/* Submit Button - Button to submit the form */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-600/20 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition duration-150"
          >
            Upload Profile Picture
          </button>
        </form>
      </div>
    </div>

    // ... rest of your code
  );
};

export default UpdateProfilePicture;
