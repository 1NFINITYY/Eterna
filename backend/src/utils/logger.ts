function timestamp() {
  return new Date().toISOString();
}

export const logger = {
  info: (msg: string) => {
    console.log(`🟢 [INFO] ${timestamp()} - ${msg}`);
  },
  warn: (msg: string) => {
    console.warn(`🟡 [WARN] ${timestamp()} - ${msg}`);
  },
  error: (msg: string, err?: any) => {
    console.error(`🔴 [ERROR] ${timestamp()} - ${msg}`);
    if (err) console.error(err);
  }
};
