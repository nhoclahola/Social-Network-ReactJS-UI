import axios from "axios";

console.log(process.env.REACT_APP_API_BASE_URL);

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const jwt = localStorage.getItem("jwt");

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Authorization": `Bearer ${jwt}`,
    "Content-Type": "application/json",
  }
})