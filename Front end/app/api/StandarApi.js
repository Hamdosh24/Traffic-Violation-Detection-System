export class StandardApi {
  static BASE_URL = "http://localhost:8000/api";
  static STREAM_URL = "http://localhost:8002/api";

  // get all notifications
  static async fetchAllAccidents() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return {
          success: false,
          error: "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى",
        };
      }

      const response = await fetch(`${this.BASE_URL}/admin/accidents/all`, {
        method: "GET",
        headers: {
          Accept: "application/json",
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
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || "فشل في جلب الحوادث",
        };
      }

      const data = await response.json();

      // التصحيح: إرجاع كامل بيانات التقسيم
      return {
        success: true,
        data: data, // إرجاع الكائن كاملاً وليس data.data فقط
      };
    } catch (err) {
      console.error("API Error [fetchAllAccidents]:", err);
      return {
        success: false,
        error: err.message || "حدث خطأ أثناء جلب الحوادث",
      };
    }
  }

  // 2. التعرف على حادث (صحيح)
  static async markAccidentAsViewed(accident_id) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return {
          success: false,
          error: "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى",
        };
      }

      const response = await fetch(
        `${this.BASE_URL}/admin/accidents/${accident_id}/acknowledge`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
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

      if (response.status === 404) {
        return {
          success: false,
          error: "الحادث غير موجود",
        };
      }

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || "فشل في تحديث حالة الحادث",
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
      };
    } catch (err) {
      console.error("API Error [markAccidentAsViewed]:", err);
      return {
        success: false,
        error: err.message || "حدث خطأ أثناء تحديث حالة الحادث",
      };
    }
  }

  static async setupAccidentSSE(callback) {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found for SSE connection");
      return null;
    }

    try {
      const eventSource = new EventSource(
        `${this.STREAM_URL}/admin/accidents/stream?token=${encodeURIComponent(
          token
        )}`
      );

      // التصحيح: استخدام addEventListener بدلاً من onmessage
      eventSource.addEventListener("new-accident", (event) => {
        try {
          const data = JSON.parse(event.data);
          callback(data);
        } catch (err) {
          console.error("Error parsing accident data:", err);
        }
      });

      eventSource.onerror = (err) => {
        console.error("SSE Error:", err);
        eventSource.close();
        setTimeout(() => this.setupAccidentSSE(callback), 5000);
      };

      return eventSource;
    } catch (err) {
      console.error("Failed to establish SSE connection:", err);
      setTimeout(() => this.setupAccidentSSE(callback), 5000);
    }
  }

  static setupNotificationCountSSE(callback) {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found for SSE connection");
      return null;
    }

    const eventSource = new EventSource(
      `${this.BASE_URL}/admin/notifications/count?token=${encodeURIComponent(
        token
      )}`
    );

    eventSource.addEventListener("count-update", (event) => {
      try {
        const data = JSON.parse(event.data);
        callback(data.change || 1);
      } catch (err) {
        console.error("Error parsing count data:", err);
      }
    });

    eventSource.onerror = (err) => {
      console.error("Count SSE Error:", err);
      eventSource.close();
      setTimeout(() => this.setupNotificationCountSSE(callback), 5000);
    };

    return eventSource;
  }

  // region filter
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
  // featch car by the plate
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
        data: data, // التأكد من أن البيانات تحتوي على driver_info و sightings
      };
    } catch (err) {
      console.error("API Error [searchVehicleSightings]:", err);
      return {
        success: false,
        error: err.message || "حدث خطأ أثناء البحث عن المركبة",
      };
    }
  }
  // Activity Log Filter
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

  // Filter of Activity Log
  static async filterActivities(filterParams) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return {
          success: false,
          error: "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى",
        };
      }

      // تحضير الجسم مع إزالة القيم الفارغة أو غير المحددة
      const requestBody = {};

      if (filterParams.username && filterParams.username !== "كل المستخدمين") {
        requestBody.username = filterParams.username;
      }

      if (filterParams.action && filterParams.action !== "كل الاحداث") {
        requestBody.action = filterParams.action;
      }

      if (filterParams.from_time) {
        requestBody.from_time = filterParams.from_time;
      }

      if (filterParams.to_time) {
        requestBody.to_time = filterParams.to_time;
      }

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

  // Fetch Camera when first render
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

  // Featch Camera details
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

  static async fetchViolationData() {
    setIsLoading(true);
    setError(null);

    try {
      // هنا التعديل الرئيسي - نرسل إما "حوادث" أو نوع المخالفة المحدد
      const violationTypeToSend =
        reportType === "حوادث" ? "حوادث" : selectedType;

      const params = {
        type_name: violationTypeToSend, // لن نرسل كلمة "مخالفات" أبداً
        governorate: selectedGovernorate,
        from_date: formatDate(startDate),
        to_date: formatDate(endDate),
      };

      // إزالة أي بارامترات غير محددة
      Object.keys(params).forEach((key) => {
        if (params[key] === undefined || params[key] === "") {
          delete params[key];
        }
      });

      const { success, data, error } =
        await StandardApi.fetchViolationsByRegionWithDetails(params);

      if (!success) {
        throw new Error(error || "فشل في جلب البيانات");
      }

      setViolationData(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء جلب البيانات");
      console.error("تفاصيل الخطأ:", err);
    } finally {
      setIsLoading(false);
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
