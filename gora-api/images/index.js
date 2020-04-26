const path = require("path");
const express = require("express");
const { cacheResponse } = require("gora-utils");
const { composeImage } = require("gora-utils");
const config = require("config")();
function validURL(str) {
    var pattern = new RegExp(
        /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    ); // fragment locator
    return !!pattern.test(str);
}

const imagesApi = (app) => {
    const router = express.Router();
    app.use("/api/images", router);

    router.get("/generate", async (req, res, next) => {
        cacheResponse(res, config.maxTimeInSeconds);
        const { image = "" } = req.query;
        const { bgColor } = req.query;
        const { size } = req.query;
        const { ppi } = req.query;
        const { mated } = req.query;
        const { frame = "" } = req.query;
        const { wFrame } = req.query;
        const urlIamge = validURL(image)
            ? image
            : path.join(__dirname, "../../uploads/", image);
        const urlFrame = validURL(frame)
            ? frame
            : path.join(__dirname, "../../uploads/", frame);
        try {
            console.log({ urlFrame, urlIamge });
            const image = await composeImage({
                wFrame,
                bgColor,
                urlIamge,
                urlFrame,
                size,
                ppi,
                mated,
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

    // res.send(`<img src="${image}"/>`);
    // const imagesServices = new imagesServices();

    /*router.get("/:messageId", async (req, res, next) => {
        cacheResponse(res, config.maxTimeInSeconds);
        const { messageId: id } = req.params;
        try {
            const message = await imagesServices.getOne({ id });

            res.status(200).json({
                data: message,
                message: "Message recived",
            });
        } catch (err) {
            next(err);
        }
        res.status(200).json({});
    });*/

    router.post("/", async (req, res, next) => {
        /*const { body: data } = req;
        try {
            const createdMessageId = await imagesServices.create({ data });

            res.status(201).json({
                data: createdMessageId,
                message: "Message created",
            });
        } catch (err) {
            next(err);
        }*/
        res.status(200).json({});
    });

    router.put("/:messageId", async (req, res, next) => {
        /*const { body: data } = req;
        const { messageId: id } = req.params;
        try {
            const updatedMessageId = await imagesServices.update({
                id,
                data,
            });

            res.status(200).json({
                data: updatedMessageId,
                message: "Message updated",
            });
        } catch (err) {
            next(err);
        }*/
        res.status(200).json({});
    });

    router.delete("/:messageId", async (req, res, next) => {
        /*const { messageId: id } = req.params;
        try {
            const deletedMessageId = await imagesServices.delete({ id });

            res.status(200).json({
                data: deletedMessageId,
                message: "Message deleted",
            });
        } catch (err) {
            next(err);
        }*/
        res.status(200).json({});
    });
};

module.exports = imagesApi;
