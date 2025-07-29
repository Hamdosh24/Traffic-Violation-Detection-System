// utils/StandardApi.js
export class StandardApi {
  static BASE_URL = "http://127.0.0.1:8000/api";

  static async get(endpoint, options = {}) {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };

      const response = await fetch(`${this.BASE_URL}${endpoint}`, {
        method: "GET",
        headers,
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        error: err.message || "An error occurred",
      };
    }
  }

  static async post(endpoint, body, options = {}) {
    try {
      const response = await fetch(`${this.BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: JSON.stringify(body),
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        error: err.message || "An error occurred",
      };
    }
  }
  static async put(endpoint, body, options = {}) {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };

      const response = await fetch(`${this.BASE_URL}${endpoint}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        error: err.message || "An error occurred",
      };
    }
  }
  static async delete(endpoint, options = {}) {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };

      const response = await fetch(`${this.BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers,
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      return {
        success: true,
        data,
        message: data.message || "Deleted successfully",
      };
    } catch (err) {
      return {
        success: false,
        error: err.message || "An error occurred during deletion",
      };
    }
  }
}
