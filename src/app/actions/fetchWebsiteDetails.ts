"use server";

export async function fetchWebsiteDetails(formData: FormData) {
  const url = formData.get("url") as string;
  if (!url) {
    return { error: "URL is required" };
  }

  try {
    const response = await fetch(url);
    const text = await response.text();
    const titleMatch = text.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : "No Title Found";
    console.log(title)
    return { title };
  } catch(error) {
    return { error:"Failed to fetch website details" };
  }

}
