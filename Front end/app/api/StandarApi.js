export class StandardApi {
  static BASE_URL = "http://127.0.0.1:8000/api";

  static async fetchAllCameras() {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const response = await fetch(`${this.BASE_URL}/cameras`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");

      if (!response.ok) {
        const errorData = isJson
          ? await response.json()
          : await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${JSON.stringify(
            errorData
          )}`
        );
      }

      if (!isJson) {
        throw new Error(`Expected JSON response, got: ${contentType}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
      };
    } catch (err) {
      console.error("API Error [fetchAllCameras]:", err);
      return {
        success: false,
        error: err.message || "An error occurred while fetching cameras",
      };
    }
  }

  static async fetchCameraById(cameraId) {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const response = await fetch(`${this.BASE_URL}/cameras/${cameraId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");

      if (response.status === 404) {
        throw new Error("Camera not found");
      }

      if (!response.ok) {
        const errorData = isJson
          ? await response.json()
          : await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${JSON.stringify(
            errorData
          )}`
        );
      }

      if (!isJson) {
        throw new Error(`Expected JSON response, got: ${contentType}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data,
      };
    } catch (err) {
      console.error("API Error [fetchCameraById]:", err);
      return {
        success: false,
        error: err.message || "An error occurred while fetching camera details",
      };
    }
  }
  static async fetchViolationFilters() {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const response = await fetch(
        `${this.BASE_URL}/violations/filters/by-region`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(
          `Expected JSON response, got: ${contentType}. Response: ${text.substring(
            0,
            100
          )}...`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Request failed with status ${response.status}`
        );
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (err) {
      console.error("API Error [fetchViolationFilters]:", err);
      return {
        success: false,
        error:
          err.message || "An error occurred while fetching violation filters",
      };
    }
  }

  static async fetchViolationsByHour(params) {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const response = await fetch(`${this.BASE_URL}/violations/hourly`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(
          `Expected JSON response, got: ${contentType}. Response: ${text.substring(
            0,
            100
          )}...`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Request failed with status ${response.status}`
        );
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (err) {
      console.error("API Error [fetchViolationsByHour]:", err);
      return {
        success: false,
        error:
          err.message ||
          "An error occurred while fetching hourly violations data",
      };
    }
  }

  static async fetchViolationsByRegion(params) {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const response = await fetch(`${this.BASE_URL}/violations/by-region`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
      });

      // التحقق من نوع المحتوى
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(
          `Expected JSON response, got: ${contentType}. Response: ${text.substring(
            0,
            100
          )}...`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Request failed with status ${response.status}`
        );
      }

      return {
        success: true,
        data: data.data || data, // دعم لكلا الهيكليتين
      };
    } catch (err) {
      console.error("API Error [fetchViolationsByRegion]:", err);
      return {
        success: false,
        error:
          err.message || "An error occurred while fetching violations data",
      };
    }
  }

  static async logout() {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(`${this.BASE_URL}/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Logout failed");
      }

      return { success: true, data };
    } catch (err) {
      return {
        success: false,
        error: err.message || "An error occurred during logout",
      };
    }
  }

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
