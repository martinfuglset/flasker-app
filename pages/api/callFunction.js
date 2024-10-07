// pages/api/callFunction.js
export default async function handler(req, res) {
    const functionUrl = "https://ssrflaskerb0689-42lrkhhsbq-ew.a.run.app"; // The function URL you showed
  
    try {
      const response = await fetch(functionUrl);
      const data = await response.json(); // Assuming the response is in JSON format
      res.status(200).json(data);
    } catch (error) {
      console.error("Error calling Cloud Function:", error);
      res.status(500).json({ error: "Failed to call Cloud Function" });
    }
  }
  