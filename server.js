const jsonServer = require("json-server");
const express = require("express");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3001;

server.use(middlewares);

// Serve images statically from the 'images' directory
server.use("/images", express.static(path.join(__dirname, "images")));

server.use((req, res, next) => {
  // Modify image paths to use the "/images" route
  if (req.method === "GET" && req.path === "/products") {
    const products = router.db.get("products").value();
    products.forEach((product) => {
      product.images = product.images.map((image) => `/images${image}`);
    });
    res.jsonp({ products });
  } else {
    next();
  }
});

server.use(router);

server.listen(port);
