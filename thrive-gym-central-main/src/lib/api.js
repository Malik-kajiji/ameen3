const BASE_URL = "http://localhost:5000/api";

export async function loginAdmin(data) {
  const res = await fetch(`${BASE_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("فشل تسجيل الدخول");
  return await res.json();
}
