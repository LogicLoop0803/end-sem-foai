/**
 * Retries an async function with exponential backoff
 */
export const retryWithBackoff = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    // If no retries left, throw the original error
    if (retries <= 0) throw error;
    
    // Specific handling for HuggingFace "loading" state
    const isModelLoading = error.response?.data?.error?.includes('loading');
    
    if (isModelLoading) {
      const waitTime = error.response.data.estimated_time || 20;
      console.log(`AI model is cold-starting. Waiting ${waitTime} seconds...`);
      await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
      // Reset retries for loading state as it's not a "failure" per se
      return retryWithBackoff(fn, retries, delay);
    }

    // For other errors (network, 502, 503, 504), use exponential backoff
    console.warn(`AI request failed. Retrying in ${delay}ms... (${retries} retries left)`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryWithBackoff(fn, retries - 1, delay * 2);
  }
};
