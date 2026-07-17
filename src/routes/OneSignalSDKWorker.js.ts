import { createServerFileRoute } from "@tanstack/react-start/server";

const SW_CODE = `
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
`;

export const ServerRoute = createServerFileRoute("/OneSignalSDKWorker.js").methods({
  GET: async () => {
    return new Response(SW_CODE, {
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Service-Worker-Allowed": "/",
        "Cache-Control": "no-cache",
      },
    });
  },
});
