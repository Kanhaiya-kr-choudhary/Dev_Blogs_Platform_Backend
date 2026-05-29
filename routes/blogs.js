import express from "express";
import Blog from "../models/Blogs.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Get all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "username email")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get single blog
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "username email",
    );
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Create blog (protected)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content, tags, coverImage } = req.body;
    const blog = await Blog.create({
      title,
      content,
      tags,
      coverImage,
      author: req.user.id,
    });
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update blog (protected)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Only author can update
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete blog (protected)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Only author can delete
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted ✅" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
