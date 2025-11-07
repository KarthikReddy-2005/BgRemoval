import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import userModel from "../models/userModel.js";

const removeBgImage = async (req, res) => {
  try {
    // clerkId is attached by auth middleware as a string on req.clerkId
    const clerkId = req.clerkId;
    const user = await userModel.findOne({ clerkId });
    if (!user) {
      return res.json({ success: false, message: "User not Found" });
    }
    if (user.creditBalance === 0) {
      return res.json({
        success: false,
        message: "You have 0 credits,Buy Some",
        creditBalance: user.creditBalance,
      });
    }

    if (!req.file) {
      return res.json({ success: false, message: "No image uploaded" });
    }

    const imagePath = req.file.path;
    const imageFile = fs.createReadStream(imagePath);
    const formdata = new FormData();
    formdata.append("image_file", imageFile);

    console.log("Using CLIPDROP_API key:", process.env.CLIPDROP_API);
    const { data } = await axios.post(
      "https://clipdrop-api.co/remove-background/v1",
      formdata,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API,
          ...formdata.getHeaders(),
        },
        responseType: "arraybuffer",
      }
    );
    if (!data || data.length === 0) {
      console.error("Clipdrop API returned empty response");
      return res.json({ success: false, message: "Failed to process image" });
    }

    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:${req.file.mimetype};base64,${base64Image}`;
    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1,
    });
    res.json({
      success: true,
      resultImage,
      creditBalance: user.creditBalance - 1,
      message: "Background removed",
    });
  } catch (error) {
    console.error("Error in removeBgImage function:", error.message); // Use console.error for errors

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx (e.g., 400, 401, 500)
      console.error("Clipdrop API Response Status:", error.response.status);
      console.error("Clipdrop API Response Headers:", error.response.headers);
      // Attempt to parse the response data, which might contain a specific error message
      try {
        const errorMessageFromClipdrop = Buffer.from(
          error.response.data
        ).toString("utf8");
        console.error(
          "Clipdrop API Specific Error Message:",
          errorMessageFromClipdrop
        );
        res.json({
          success: false,
          message: `Clipdrop API Error: ${errorMessageFromClipdrop}`,
        });
      } catch (parseError) {
        console.error(
          "Could not parse Clipdrop API response data:",
          parseError.message
        );
        res.json({
          success: false,
          message: `Clipdrop API Error (status ${error.response.status}): ${error.message}`,
        });
      }
    } else if (error.request) {
      // The request was made but no response was received (e.g., network error)
      console.error("No response received from Clipdrop API:", error.request);
      res.json({
        success: false,
        message: "No response from Clipdrop API. Check network.",
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up Clipdrop API request:", error.message);
      res.json({
        success: false,
        message: `Internal Server Error: ${error.message}`,
      });
    }
  }
};

export { removeBgImage };
