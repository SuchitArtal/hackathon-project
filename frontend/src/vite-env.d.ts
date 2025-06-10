interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_AI_SERVICE_URL: string; // Added declaration for AI service URL
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}