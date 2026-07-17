// Clé publique VAPID
export const VAPID_PUBLIC_KEY = "BDDR7ERRm2Zxoslb-5lAL9UAcQ0RdU_yXok9bXwdwaqljTYsbeaQWgAQ2Y0UPIQ5OBpzVFeBQJFOOHTdH-_sWKA";

// URL Edge Function
const PUSH_FUNCTION_URL = "https://ylukjecryawgktojufxt.supabase.co/functions/v1/smart-service";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export async function subscribeToPush(
  userCode: string,
  userType: "joueur" | "coach"
): Promise<boolean> {
  try {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return false;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return false;

    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }

    const json = sub.toJSON();
    const { supabase } = await import("./supabase");
    await supabase.from("push_subscriptions").upsert({
      user_code: userCode,
      user_type: userType,
      endpoint: json.endpoint,
      p256dh: json.keys?.p256dh,
      auth: json.keys?.auth,
    }, { onConflict: "endpoint" });

    return true;
  } catch (e) {
    console.error("Push subscribe error:", e);
    return false;
  }
}

export async function sendPushNotification({
  title,
  body,
  target,
  user_code,
}: {
  title: string;
  body: string;
  target: "all" | "joueurs" | "coach" | "joueur";
  user_code?: string;
}): Promise<void> {
  try {
    await fetch(PUSH_FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body, target, user_code }),
    });
  } catch (e) {
    console.error("Push send error:", e);
  }
}
