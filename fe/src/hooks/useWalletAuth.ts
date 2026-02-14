import { useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAuth } from "@/contexts/AuthContext";

export function useWalletAuth() {
  const { publicKey, connected, signMessage } = useWallet();
  const { login } = useAuth();

  const hasAuthenticated = useRef(false); // ⭐ prevents loops
  console.log("AUTH STARTED", publicKey?.toBase58())

  useEffect(() => {
    if (!connected || !publicKey || !signMessage) return;

    if (hasAuthenticated.current) return; // ⭐ CRITICAL

    hasAuthenticated.current = true;

    const authenticate = async () => {
      try {
        
        const message = "Sign in to Smooth AI";
        console.log("SIGNED MESSAGE:", message)

        const encoded = new TextEncoder().encode(message);

        const signature = await signMessage(encoded);

        const sigBase64 = Buffer.from(signature).toString("base64");

        await login(publicKey.toBase58(), sigBase64, message);
      } catch (err) {
        console.error("Wallet auth failed", err);
        hasAuthenticated.current = false; // allow retry if needed
      }
    };

    authenticate();
  }, [connected, publicKey, signMessage, login]);
}

