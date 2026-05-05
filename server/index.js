import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


let posts = [];

// test route
app.get("/", (req, res) => {
  res.send("Blog API is running 🚀");
});

// ✅ GET posts
app.get("/api/posts", (req, res) => {
  console.log("GET /api/posts hit");
  res.json(posts);
});

// ✅ POST new post
app.post("/api/posts", (req, res) => {
  console.log("POST /api/posts hit");

  const { title, excerpt, category, author, image_url, published_at } = req.body;

  if (!title || !excerpt) {
    return res.status(400).json({ message: "Title & excerpt required" });
  }

  const newPost = {
    id: Date.now().toString(),
    title,
    excerpt,
    category: category || "Personal",
    author: author || "SruthySravanan",
    image_url,
    published_at,
  };

  posts.unshift(newPost); // ✅ add to array

  res.status(201).json(newPost);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});