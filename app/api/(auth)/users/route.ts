import connect from "@/lib/db";
import User from "@/lib/modals/users.modals";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

const ObjectId = require("mongoose").Types.ObjectId;

//Check Users
export const GET = async (request: Request) => {
  try {
    await connect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error in fetching Users" + error.message, {
      status: 500,
    });
  }
};

//Create User

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    await connect();
    const newUser = new User(body);
    await newUser.save();
    return new NextResponse(
      JSON.stringify({ message: "User is created", user: newUser }),
      { status: 201 }
    );
  } catch (error) {
    return new NextResponse("Error in creating User" + error, { status: 500 });
  }
};

//Update User
export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    const { userId, newUsername } = body;
    await connect();
    if (!userId || !newUsername) {
      return new NextResponse(
        JSON.stringify({ message: "ID or New Username not found" }),
        { status: 400 }
      );
    }
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid UserID" }), {
        status: 400,
      });
    }
    const updateUser = await User.findByIdAndUpdate(
      {
        _id: new ObjectId(userId),
      },
      { username: newUsername },
      { new: true }
    );
    if (!updateUser) {
      return new NextResponse(
        JSON.stringify({ message: "User is not found in database" }),
        { status: 400 }
      );
    }
    return new NextResponse(
      JSON.stringify({ message: "User is Updated", user: updateUser }),
      {
        status: 400,
      }
    );
  } catch (error: any) {
    return new NextResponse("Error in updating User" + error.message, {
      status: 500,
    });
  }
};

//Delete User
export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse(JSON.stringify({ message: "ID  not found" }), {
        status: 400,
      });
    }
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid UserID" }), {
        status: 400,
      });
    }
    await connect();
    const deleteUser = await User.findByIdAndDelete(new Types.ObjectId(userId));
    if (!deleteUser) {
      return new NextResponse(
        JSON.stringify({ message: "User is not found in database" }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "User is Deleted", user: deleteUser }),
      {
        status: 200,
      }
    );
  } catch (error: any) {}
};
