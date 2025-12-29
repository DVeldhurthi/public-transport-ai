const API_URL = "http://localhost:8000";

export async function getAiRoute(payload) {
  const res = await fetch(`${API_URL}/predict-route`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("AI route prediction failed");
  }

  return await res.json();
}
