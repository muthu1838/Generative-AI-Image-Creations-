
export async function generateAd(prompt, tone) {
  const res = await fetch("http://localhost:5000/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      tone,
      quality: "hd"   
    })
  });

  if (!res.ok) throw new Error("API failed");
  return res.json();
}
