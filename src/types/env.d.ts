// biome-ignore lint/style/noNamespace: needed for global types
namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
    APP_PORT: string;
    APP_TOKEN: string;
    BOARD_ID: string;
    WEBHOOK_URL: string;
  }
}
