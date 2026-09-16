import type { MetadataRoute } from "next";
import {
  APP_NAME,
  BRAND_COLOR,
  ICON_192_PATH,
  ICON_512_PATH,
} from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: APP_NAME,
    description:
      "Wedding dress hire, custom bridal gowns, and event planning in Malawi.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f6",
    theme_color: BRAND_COLOR,
    icons: [
      {
        src: ICON_192_PATH,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: ICON_512_PATH,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
