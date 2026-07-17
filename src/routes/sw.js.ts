import { createServerFileRoute } from "@tanstack/react-start/server";

const SW_CODE = `
self.addEventListener("push", (event) => {
  if (!event.data) return;
  let data = {};
  try { data = event.data.json(); } catch { data = { title: "DHB Prépa", body: event.data.text() }; }
  event.waitUntil(
    self.registration.showNotification(data.title || "DHB Prépa", {
      body: data.body || "",
      icon: "/icon-512.png",
      badge: "/icon-192.png",
      vibrate: [200, 100, 200],
      data: { url: data.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(url));
});
`;

export const ServerRoute = createServerFileRoute("/sw.js").methods({
  GET: async () => {
    return new Response(SW_CODE, {
      headers: {
        "Content-Type": "application/javascript",
        "Service-Worker-Allowed": "/",
        "Cache-Control": "no-cache",
      },
    });
  },
});
