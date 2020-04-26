const path = require("path");
const Jimp = require("jimp/es").default;

const urlAngle =
  "https://res.cloudinary.com/dacdvngec/image/upload/v1587907666/angle_ut2dq2.png"; //path.join(__dirname, "../../uploads/", "angle.png");

const composeImage = async ({
  urlIamge,
  size = 4,
  ppi = 300,
  mated,
  bgColor = "#fff",
  urlFrame,
  wFrame = 0.1,
}) => {
  try {
    const image = await Jimp.read(urlIamge);
    const frameHorizontal = urlFrame && (await Jimp.read(urlFrame));
    const frameVertical = urlFrame && (await Jimp.read(urlFrame));
    const frameAngle = urlFrame && (await Jimp.read(urlAngle));
    const wFrameN = wFrame * ppi;
    // const finalSize = size ? size.split(/[x|X]/gim) : [];

    let imageWidth = image.bitmap.width;
    let imageHeight = image.bitmap.height;

    // const vertical = image.bitmap.height > image.bitmap.width
    const horizontal = imageWidth > imageHeight;
    const ratio = horizontal
      ? (imageHeight / imageWidth) * 1
      : imageWidth / imageHeight;

    imageWidth = size * ppi;
    imageHeight = imageWidth * ratio;

    let matWidth = imageWidth;
    let matHeight = imageHeight;

    if (mated) {
      matWidth = size * ppi;
      matHeight = matWidth * ratio;

      imageWidth = matWidth * 0.74366;
      imageHeight = imageWidth * ratio;
    }
    /* if (finalSize.length > 0) {
      imageWidth = finalSize[0] * 1;
      imageHeight = finalSize[1] * 1;
      image.resize(imageWidth, imageHeight);
    }*/

    image.resize(imageWidth, imageHeight);
    const background = new Jimp(matWidth, matHeight, bgColor);
    const x = (matWidth - imageWidth) / 2;
    const y = (matHeight - imageHeight) * 0.382;

    background.composite(image, x, y, {
      mode: Jimp.BLEND_SOURCE_OVER,
    });

    if (urlFrame) {
      frameHorizontal.resize(matWidth, wFrameN + 4);
      frameAngle.resize(wFrameN + 8, wFrameN + 4);
      frameVertical.resize(matHeight, wFrameN + 4).rotate(90);

      background.composite(frameHorizontal, 0, -2, {
        mode: Jimp.BLEND_SOURCE_OVER,
      });
      background.composite(
        frameHorizontal.flip(false, true),
        0,
        matHeight - wFrameN - 2,
        {
          mode: Jimp.BLEND_SOURCE_OVER,
        }
      );
      frameVertical.mask(frameAngle.flip(true, true), 0, 0);
      frameVertical.mask(frameAngle.flip(false, true), 0, matHeight - wFrameN);

      background.composite(frameVertical, -2, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
      });
      background.composite(
        frameVertical.flip(true, false),
        matWidth - wFrameN - 2,
        0,
        {
          mode: Jimp.BLEND_SOURCE_OVER,
        }
      );
    }
    background.quality(100);

    return await background.getBase64Async(Jimp.MIME_JPEG);
  } catch (e) {
    throw e;
  }
};

module.exports = {
  composeImage,
};
