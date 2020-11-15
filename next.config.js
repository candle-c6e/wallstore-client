const isProd = process.env.NODE_ENV === "production";

module.exports = {
  // assetPrefix: isProd ? "https://jjams.co/wallstore" : "",
  // assetPrefix: "",
  basePath: "/wallstore",
  images: {
    domains: ["localhost"],
  },
};
