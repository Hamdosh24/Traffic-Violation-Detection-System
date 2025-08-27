import { NextResponse } from "next/server";
import { callWithErrorHandling } from "../../../lib/callWithErrorHandling";

export async function POST(request) {
  await callWithErrorHandling({
    callback: async () => {
      const { title, link, imageUrl } = await request.json();
      const newBanner = { title, link, imageUrl };
      console.log(newBanner);
      return NextResponse.json(newBanner);
    },
    errorMessage: "Failed to create Banner",
  });
}
