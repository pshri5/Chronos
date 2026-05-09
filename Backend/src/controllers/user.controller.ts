import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Generate access and refresh tokens
const generateAccessAndRefreshTokens = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const accessToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        name: user.name
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m"
      }
    );

    const refreshToken = jwt.sign(
      {
        _id: user._id
      },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d"
      }
    );

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Something went wrong while generating tokens");
  }
};

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json(new apiResponse(400, null, "All fields are required"));
  }

  // Check if user already exists
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    return res.status(409).json(new apiResponse(409, null, "User already exists with this email"));
  }

  // Hash password
  // Password is hashed automatically by the User model's pre-save hook

  // Create user
  const user = await User.create({
    name,
    email,
    password
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    return res.status(500).json(new apiResponse(500, null, "Something went wrong while registering the user"));
  }

  return res
    .status(201)
    .json(new apiResponse(201, createdUser, "User registered successfully"));
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json(new apiResponse(400, null, "Email and password are required"));
  }

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json(new apiResponse(404, null, "User does not exist"));
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json(new apiResponse(401, null, "Invalid password"));
  }

  // Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id.toString());

  // Logged in user
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  // Set refresh token in cookie (httpOnly, secure in production)
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(200, 
        { 
          user: loggedInUser, 
          accessToken, 
          refreshToken 
        }, 
        "User logged in successfully")
    );
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  // Clear refresh token from user in DB
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1 // removes the refreshToken field
      }
    },
    {
      new: true
    }
  );

  // Clear cookie
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  };

  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, null, "User logged out successfully"));
});

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  return res
    .status(200)
    .json(new apiResponse(200, req.user, "Current user fetched successfully"));
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const userId = req.user?._id;

  // Validation
  if (!name && !email) {
    return res.status(400).json(new apiResponse(400, null, "At least one field (name or email) is required to update"));
  }

  // If email is being updated, check if it's already taken
  if (email) {
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(409).json(new apiResponse(409, null, "Email already exists"));
    }
  }

  // Update user
  const updateData: any = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    updateData,
    { new: true }
  ).select("-password -refreshToken");

  if (!updatedUser) {
    return res.status(500).json(new apiResponse(500, null, "Failed to update user"));
  }

  return res
    .status(200)
    .json(new apiResponse(200, updatedUser, "User updated successfully"));
});