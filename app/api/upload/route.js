// api/product/upload/route.js
import { supabase } from "@/app/lib/supabase";
import { errorToJSON } from "next/dist/server/render";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
      });
    }

    //  Buat path untik (folder/namafile)
    const fileName = `${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });
    if (error) throw error;

    //  Ambil public URL
    const { data: publicurl } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);

    return new Response(
      JSON.stringify({ url: publicurl.publicUrl }, { status: 200 })
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
