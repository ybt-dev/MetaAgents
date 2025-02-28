export const safeJsonParse = <Data>(json: string): Data | null => {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
};
