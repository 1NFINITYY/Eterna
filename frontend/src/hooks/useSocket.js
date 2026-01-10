import { useEffect } from "react";
import { io } from "socket.io-client";

export function useSocket(setTokens) {
  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("price-updates", updates => {
      setTokens(prev =>
        prev.map(token => {
          const update = updates.find(
            u => u.token_address === token.token_address
          );
          return update
            ? {
                ...token,
                price_usd: update.price_usd,
                price_change_1h: update.price_change_1h,
                _flash: true
              }
            : token;
        })
      );
    });

    return () => socket.disconnect();
  }, []);
}
