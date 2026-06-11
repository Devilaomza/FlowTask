import axios from "axios";

let baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
if (baseURL && !baseURL.includes(".") && !baseURL.startsWith("http://") && !baseURL.startsWith("https://") && baseURL !== "localhost") {
  baseURL = `https://${baseURL}.onrender.com`;
} else if (baseURL && !baseURL.startsWith("http://") && !baseURL.startsWith("https://")) {
  baseURL = `https://${baseURL}`;
}

export const api = axios.create({
  baseURL: baseURL,
});