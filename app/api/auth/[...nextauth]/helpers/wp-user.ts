/* eslint-disable */


// helpers/wp-user.ts
import qs from "querystring";
import { WpUserMeta } from "./types";


const WP_URL = process.env.WC_API_URL!;
const WC_KEY = process.env.WC_CONSUMER_KEY!;
const WC_SECRET = process.env.WC_CONSUMER_SECRET!;
const WP_USERNAME = process.env.WP_USERNAME!;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD!;


export async function checkUserExists(email?: string): Promise<boolean> {
if (!email) return false;
const response = await fetch(`${WP_URL}wp-json/wp/v2/users?search=${encodeURIComponent(email)}`, {
method: "GET",
headers: { "Content-Type": "application/json" },
});
const users = await response.json();
return Array.isArray(users) && users.length > 0;
}


export async function createUserInWordPress(email: string, name: string): Promise<any> {
const nameParts = name.split(" ");
const firstName = nameParts[0];
const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";


const payload = {
email,
first_name: firstName,
last_name: lastName,
username: email.split("@")[0],
password: process.env.WP_DEFAULT_APP_PASSWORD!,
};


const query = qs.stringify({ consumer_key: WC_KEY, consumer_secret: WC_SECRET });
const res = await fetch(`${WP_URL}wp-json/wc/v3/customers?${query}`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(payload),
});


if (!res.ok) {
const body = await res.text();
if (body.includes("registration-error-email-exists")) {
console.log(`User already exists: ${email}`);
return null;
}
throw new Error(`Failed to create customer: ${res.status} ${body}`);
}

const data = await res.json()
console.log("this is the user for id ggoel: ", data)
return await res.json();
}


export async function getWpUserByEmail(email: string): Promise<WpUserMeta | null> {
  const auth = Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString("base64");

  const response = await fetch(
    `${WP_URL}wp-json/wp/v2/users?search=${encodeURIComponent(email)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
    }
  )

  const users = await response.json();
  console.log("\n\n\n\n\n\n\nWP users fetched:", users);

  if (!Array.isArray(users) || users.length === 0) return null;

  return { id: users[0].id, slug: users[0].slug, email } as WpUserMeta;

}
