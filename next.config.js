const isProd = process.env.NODE_ENV === "production";

module.exports = {
  assetPrefix: isProd ? "https://jjam.co/wallstore/" : "",
  // basePath: "/wallstore",
  images: {
    domains: ["localhost"],
  },
};
