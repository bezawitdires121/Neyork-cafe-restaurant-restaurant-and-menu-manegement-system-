"use server";

import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { v4 as uuid } from "uuid";


export async function uploadGalleryImage(formData: FormData) {

  try {

    const file = formData.get("image") as File;

    if (!file || file.size === 0) {
      return {
        success: false,
        error: "Please select an image."
      };
    }


    if (!file.type.startsWith("image/")) {
      return {
        success: false,
        error: "File must be an image."
      };
    }


    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: "Image must be under 5MB."
      };
    }


    const ext = file.name.split(".").pop();

    const fileName = `${uuid()}.${ext}`;


    const buffer = Buffer.from(
      await file.arrayBuffer()
    );


    const { error: uploadError } =
      await supabaseAdmin.storage
        .from("gallery-images")
        .upload(
          fileName,
          buffer,
          {
            contentType: file.type
          }
        );


    if (uploadError) {

      console.error(uploadError);

      return {
        success:false,
        error:"Image upload failed."
      };

    }


    const { data } =
      supabaseAdmin.storage
      .from("gallery-images")
      .getPublicUrl(fileName);



    await prisma.galleryImage.create({

      data: {

        imageUrl:data.publicUrl,

        caption:
          String(formData.get("caption") || ""),

        category:
          String(formData.get("category") || "")

      }

    });


    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");


    return {
      success:true
    };


  } catch(error){

    console.error(
      "GALLERY UPLOAD ERROR",
      error
    );


    return {
      success:false,
      error:"Something went wrong. Please try again soon."
    };

  }

}



export async function toggleGalleryFeatured(id: string, isFeatured: boolean) {
  await prisma.galleryImage.update({ where: { id }, data: { isFeatured } });
  revalidatePath("/admin/gallery");
  return { success: true };
}

export async function deleteGalleryImage(id: string) {
  await prisma.galleryImage.delete({ where: { id } });
  revalidatePath("/admin/gallery");
  return { success: true };
}