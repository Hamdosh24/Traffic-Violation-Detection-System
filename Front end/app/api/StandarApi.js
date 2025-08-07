export class StandardApi {
  static BASE_URL = "http://localhost:8000/api";

  static async fetchAllActivities() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return {
          success: false,
          error: "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى",
        };
      }

      const response = await fetch(`${this.BASE_URL}/activity-logs`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        return {
          success: false,
          error: "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى",
        };
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        return {
          success: false,
          error: "فشل في جلب سجل الأنشطة",
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
      };
    } catch (err) {
      console.error("Fetch Error:", err);
      return {
        success: false,
        error: "حدث خطأ في الاتصال بالخادم",
      };
    }
  }

  static async filterActivities(filterParams) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return {
          success: false,
          error: "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى",
        };
      }

      // تحويل الإجراء إلى التنسيق المطلوب من API
      const formattedAction = `o1.taa "${filterParams.action}"`;

      const requestBody = {
        action: formattedAction,
        username: filterParams.username,
        from_time: filterParams.from_time,
        to_time: filterParams.to_time,
      };

      const response = await fetch(`${this.BASE_URL}/activity-logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        return {
          success: false,
          error: "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى",
        };
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        return {
          success: false,
          error: "فشل في تصفية الأنشطة",
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
      };
    } catch (err) {
      console.error("API Error [filterActivities]:", err);
      return {
        success: false,
        error: "حدث خطأ أثناء تصفية الأنشطة",
      };
    }
  }

  static async searchVehicleSightings(plateNumber) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return {
          success: false,
          error: "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى",
        };
      }

      const response = await fetch(
        `${this.BASE_URL}/admin/passing-cars/search/${encodeURIComponent(
          plateNumber
        )}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        return {
          success: false,
          error: "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى",
        };
      }

      if (response.status === 404) {
        return {
          success: false,
          error: "لم يتم العثور على أي مشاهدات لهذه المركبة",
        };
      }

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || "فشل في جلب بيانات المركبة",
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
      };
    } catch (err) {
      console.error("API Error [searchVehicleSightings]:", err);
      return {
        success: false,
        error: err.message || "حدث خطأ أثناء البحث عن المركبة",
      };
    }
  }

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
      if (!token) {
        return {
          success: false,
          error: "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى",
        };
      }

      const response = await fetch(`${this.BASE_URL}/camera/${cameraId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        return {
          success: false,
          error: "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى",
        };
      }

      if (response.status === 404) {
        return {
          success: false,
          error: "الكاميرا غير موجودة في النظام",
        };
      }

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || "فشل جلب بيانات الكاميرا",
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data || data, // تأكد من بنية الاستجابة
      };
    } catch (err) {
      console.error("API Error [fetchCameraById]:", err);
      return {
        success: false,
        error: err.message || "حدث خطأ أثناء جلب بيانات الكاميرا",
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

  static async fetchViolationFiltersByRegion() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return {
          success: false,
          error: "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى",
        };
      }

      const response = await fetch(
        `${this.BASE_URL}/violations/filters/by-region`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        return {
          success: false,
          error: "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى",
        };
      }

      // التحقق من نوع المحتوى
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Expected JSON response, got:", contentType, text);
        return {
          success: false,
          error: "تنسيق الاستجابة غير متوقع من الخادم",
        };
      }

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "فشل في جلب فلاتر المخالفات حسب المنطقة",
        };
      }

      return {
        success: true,
        data: {
          governorates: data.governorates || [],
          violation_types: data.violation_types || [],
        },
      };
    } catch (err) {
      console.error("API Error [fetchViolationFiltersByRegion]:", err);
      return {
        success: false,
        error: err.message || "حدث خطأ أثناء جلب فلاتر المخالفات حسب المنطقة",
      };
    }
  }

  static async fetchViolationsByRegionWithDetails(params) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return {
          success: false,
          error: "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى",
        };
      }

      const response = await fetch(`${this.BASE_URL}/violations/by-region`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        return {
          success: false,
          error: "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى",
        };
      }

      // التحقق من نوع المحتوى
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Expected JSON response, got:", contentType, text);
        return {
          success: false,
          error: "تنسيق الاستجابة غير متوقع من الخادم",
        };
      }

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "فشل في جلب بيانات المخالفات حسب المنطقة",
        };
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (err) {
      console.error("API Error [fetchViolationsByRegionWithDetails]:", err);
      return {
        success: false,
        error: err.message || "حدث خطأ أثناء جلب بيانات المخالفات حسب المنطقة",
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
