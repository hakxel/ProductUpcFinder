export interface UpcProduct {
  upc: string;
  title: string;
  description?: string;
  brand?: string;
  category?: string;
  size?: string;
  image?: string;
}

export interface UpcSearchResponse {
  products: UpcProduct[];
  total: number;
}

export class UpcApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'UpcApiError';
  }
}

export async function searchProducts(query: string): Promise<UpcSearchResponse> {
  try {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new UpcApiError(
        errorData.message || `Search failed with status ${response.status}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof UpcApiError) {
      throw error;
    }
    
    throw new UpcApiError(
      error instanceof Error ? error.message : 'An unexpected error occurred'
    );
  }
}
