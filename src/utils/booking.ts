import { encryptWithPublicKey } from "@/lib/helper";
import { bookingRequest } from "@/types/booking";
import { AuthService } from "./auth";
import { apiClient } from "./api";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BE}/api/v1/booking`;

class BookingService {
  async bookSlot(data: bookingRequest) {
    const encrypt = await encryptWithPublicKey(data);
    const session = await AuthService.getSession();

    const finalPayload = {
      data: encrypt,
    };

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`;
    }

    const response = await fetch(`${API_BASE_URL}/book-schedule`, {
      method: "POST",
      headers,
      body: JSON.stringify(finalPayload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Booking failed");
    }

    return result.data;
  }

  async previewPayment(id: string) {
    const data = {
      id,
    };
    const response = await fetch(`${API_BASE_URL}/image`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Something went wrong!");
    }

    return result.data;
  }

  async bookingHistoryUser() {
    const response = await apiClient.get(`/api/v1/booking/history/user`);
    return response.data;
  }
}

export const bookingService = new BookingService();
