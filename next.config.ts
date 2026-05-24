import type { NextConfig } from "next";
import dns from "node:dns";

// Fix Node 18+ IPv6 DNS resolution timeouts globally for all fetch requests
dns.setDefaultResultOrder("ipv4first");

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
