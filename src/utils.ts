// i.e. 0-255 -> '00'-'ff'
const dec2hex = (dec: number): string => dec.toString(16).padStart(2, "0");

const generateId = (len: number): string => {
  const arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join("");
};

export const generateRequestId = (): string => {
  if (typeof window !== "undefined") {
    return generateId(10);
  }

  return new Date().getTime().toString(36);
};

export async function pollWithRetries<T>(
  fn: () => Promise<T | null>, // Function that returns a promise
  isSuccessful: (result: T | null) => boolean, // Condition to stop polling
  getResultValue: (result: T | null) => string | null, // Extract value if successful
  maxAttempts = 20,
  interval = 5000
): Promise<string> {
  let attempts = 0;

  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        console.log(`Polling attempt ${attempts + 1}`);

        const result = await fn();

        if (!result) {
          console.warn(`No valid result found on attempt ${attempts + 1}`);
        } else if (isSuccessful(result)) {
          const value = getResultValue(result);
          if (value) {
            console.log(`Polling successful, result: ${value}`);
            resolve(value);
            return;
          }
        }

        attempts++;
        if (attempts >= maxAttempts) {
          console.error("Polling timeout exceeded");
          reject(new Error("Polling timeout exceeded"));
          return;
        }

        setTimeout(poll, interval);
      } catch (error) {
        console.error(`Error in polling attempt ${attempts + 1}:`, error);
        attempts++;
        if (attempts >= maxAttempts) {
          console.error("Polling timeout exceeded");
          reject(new Error("Polling timeout exceeded"));
          return;
        }
        setTimeout(poll, interval);
      }
    };

    poll();
  });
}
