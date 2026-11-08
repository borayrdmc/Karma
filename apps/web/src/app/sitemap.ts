import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap{
    const baseUrl=process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";

    return[
        {
            url:baseUrl,
            lastModified:new Date(),
            changeFrequency:"daily",
            priority:1.0,
        },
        {
            url:`${baseUrl}/signin`,
            lastModified:new Date(),
            changeFrequency:"monthly",
            priority:0.6,
        },
        {
            url:`${baseUrl}/signup`,
            lastModified:new Date(),
            changeFrequency:"monthly",
            priority:0.8,
        },
    ];
}
