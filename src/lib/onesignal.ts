import OneSignal from "react-onesignal";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./supabase";

const APP_ID = "9672dfaa-b64a-4b09-9eea-6a70e8915f37";

let initialized = false;

export async function initOneSignal(userCode: string, userType: "joueur" | "coach") {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  await OneSignal.init({
    appId: APP_ID,
    allowLocalhostAsSecureOrigin: true,
    notifyButton: { enable: false },
  });

  await OneSignal.login(userCode);
  await OneSignal.User.addTag("type", userType);
  await OneSignal.User.addTag("code", userCode);

  await OneSignal.Notifications.requestPermission();
}

export async function sendOneSignalNotif({
  title,
  body,
  target,
  userCode,
}: {
  title: string;
  body: string;
  target: "all" | "joueurs" | "coach" | "joueur";
  userCode?: string;
}) {
  await fetch(`${SUPABASE_URL}/functions/v1/smart-service`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ title, body, target, user_code: userCode }),
  });
}
