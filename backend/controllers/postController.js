import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
export const createPost = async (req, res) => {
  const { postedBy, text } = req.body;
  let img = req.body.img;
  console.log(req.body);
  try {
    if (!postedBy || !text) {
      return res.status(400).json({ error: "Please fill all the fields" });
    }
    const user = await User.findById(postedBy);
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const maxLength = 500;
    if (text.length > maxLength) {
      return res.status(400).json({ error: "Text is too long" });
    }
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }
    const newPost = new Post({
      postedBy,
      text,
      img,
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

export const getPost = async (req, res) => {
  console.log(req.params.id);
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(post);
  } catch (e) {
    res.status(500).json({ error: e.message });
    console.log(e);
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (post.img) {
      const result = await cloudinary.uploader.destroy(
        post.img.split("/").pop().split(".")[0]
      );
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
    console.log(e);
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const userLikedPost = post.likes.includes(userId);
    if (userLikedPost) {
      //unlikepost
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      //likepost
      post.likes.push(userId);
      await post.save();
      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
    console.log(e);
  }
};

export const replyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;
    if (!text) {
      return res.status(400).json({ error: "Коммент отсутствует" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Пост не найден" });
    }
    const reply = {
      userId,
      text,
      userProfilePic,
      username,
    };
    post.replies.push(reply);
    await post.save();
    res.status(200).json(post);
  } catch (e) {
    res.status(500).json({ error: e.message });
    console.log(e);
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const following = user.following;
    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });

    res.status(200).json(feedPosts);
  } catch (e) {
    res.status(500).json({ error: e.message });
    console.log(e);
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const userPosts = await Post.find({ postedBy: user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(userPosts);
  } catch (e) {
    res.status(500).json({ error: e.message });
    console.log(e);
  }
};
