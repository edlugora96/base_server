const path = require("path");
const fs = require("fs");
const express = require("express");
const { cacheResponse } = require("gora-utils");
const { composeImage } = require("gora-utils");
const config = require("config")();
function validURL(str) {
  var pattern = new RegExp(
    /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  );
  return !!pattern.test(str);
}

const imagesApi = (app) => {
  const router = express.Router();
  app.use("/api/images", router);

  router.get("/generate", async (req, res, next) => {
    cacheResponse(res, config.maxTimeInSeconds);
    const { image = false } = req.query;
    const { bgColor } = req.query;
    const { size } = req.query;
    const { ppi } = req.query;
    const { mated } = req.query;
    const { frame = false } = req.query;
    const { wFrame } = req.query;
    const { qty } = req.query;
    const urlIamge = validURL(image)
      ? image
      : image
      ? path.join(__dirname, "../../uploads/", image)
      : "";
    const urlFrame = validURL(frame)
      ? frame
      : frame
      ? path.join(__dirname, "../../uploads/", frame)
      : "";
    try {
      const image = await composeImage({
        wFrame,
        bgColor,
        urlIamge,
        urlFrame,
        size,
        ppi,
        mated,
        qty,
      });
      const im = image.split(",")[1];
      const img = Buffer.from(im, "base64");
      res.writeHead(200, {
        "Content-Type": "image/jpeg",
        "Content-Length": img.length,
      });
      res.end(img);
    } catch (err) {
      next(err);
    }
  });
};

module.exports = imagesApi;
