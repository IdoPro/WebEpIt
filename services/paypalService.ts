export interface PayPalClientConfig {
  clientId: string;
  currency: string;
  price: number;
  intent: 'capture';
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  error?: string;
  details?: string;
  code?: string;
  debugId?: string;
  recoverable?: boolean;
}

export class PayPalRequestError extends Error {
  code?: string;
  debugId?: string;
  recoverable: boolean;

  constructor(message: string, options?: { code?: string; debugId?: string; recoverable?: boolean }) {
    super(message);
    this.name = 'PayPalRequestError';
    this.code = options?.code;
    this.debugId = options?.debugId;
    this.recoverable = options?.recoverable ?? false;
  }
}

const parseApiError = async (response: Response, fallback: string): Promise<PayPalRequestError> => {
  try {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const payload = (await response.json()) as ApiErrorResponse;
      const message = payload?.message || payload?.error || payload?.details || fallback;
      return new PayPalRequestError(message, {
        code: payload?.code,
        debugId: payload?.debugId,
        recoverable: payload?.recoverable,
      });
    } else {
      const text = (await response.text()).trim();
      if (text) {
        return new PayPalRequestError(text);
      }
    }
  } catch {
  }

  return new PayPalRequestError(`${fallback}: ${response.status} ${response.statusText}`.trim());
};

export const getPayPalClientConfig = async (): Promise<PayPalClientConfig> => {
  const response = await fetch('/api/payments/paypal/config');

  if (!response.ok) {
    throw await parseApiError(response, 'Failed to fetch PayPal config');
  }

  const payload = (await response.json()) as ApiResponse<PayPalClientConfig>;
  return payload.data;
};

export const createPayPalOrder = async (description: string): Promise<string> => {
  const response = await fetch('/api/payments/paypal/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description }),
  });

  if (!response.ok) {
    throw await parseApiError(response, 'Failed to create PayPal order');
  }

  const payload = (await response.json()) as ApiResponse<{ orderId: string }>;
  return payload.data.orderId;
};

export const capturePayPalOrder = async (orderId: string) => {
  const response = await fetch(`/api/payments/paypal/order/${orderId}/capture`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw await parseApiError(response, 'Failed to capture PayPal order');
  }

  const payload = (await response.json()) as ApiResponse<any>;
  return payload.data;
};

export const getPayPalOrder = async (orderId: string) => {
  const response = await fetch(`/api/payments/paypal/order/${orderId}`);

  if (!response.ok) {
    throw await parseApiError(response, 'Failed to fetch PayPal order');
  }

  const payload = (await response.json()) as ApiResponse<any>;
  return payload.data;
};
