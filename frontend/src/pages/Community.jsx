import React, { useState } from "react";
import {
  MessageCircle,
  Filter,
  MapPin,
  Users,
  HelpCircle,
  Info,
  BookOpen,
  Plus,
  Search,
  Heart
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import pic from "../assets/hero-crop.jpg"

// PostCard component
const PostCard = ({ id, author, location, timeAgo, category, content, likes, replies, isLiked, isImage, imageUrl, userType }) => {
  return (
    <div className="card-styles bg-primary/50 border border-secondary p-6 rounded-xl space-y-4" key={id}>
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full 
        bg-secondary flex items-center justify-center text-foreground font-bold">
          {author.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
          <div className="flex">
            <h4 className="font-semibold mr-2">{author}</h4>
            <div className="w-fit p-1 bg-secondary rounded-xl text-sm ml-2">{userType}</div>
          </div>
            <span className="text-sm text-secondary-foreground">{timeAgo}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
        </div>
      </div>
      {/* Content */}
      {isImage ? 
      <div className="flex bg-black items-center justify-center w-full rounded-lg">
        <img src={imageUrl ? imageUrl : pic} className="object-cover"/>
      </div>
      : null}
      <p className="text-gray-700">{content}</p>
      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors">
            {isLiked ? (
              <Heart className="h-4 w-4 text-foreground"/>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500"
              >
                <path d="M19.5 13.572 12 20l-7.5-6.428C3.12 12.298 2 10.518 2 8.5c0-2.828 2.37-5.122 5.25-5.122A5.25 5.25 0 0 1 12 6.75a5.25 5.25 0 0 1 4.75-3.372C19.63 3.378 22 5.672 22 8.5c0 2.018-1.12 3.8-2.5 5.072z" />
              </svg>
            )}
            <span>{likes}</span>
          </button>
          <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors">
            <MessageCircle className="h-4 w-4" />
            <span>{replies}</span>
          </button>
        </div>
        <div className="badge-styles">
          {category}
        </div>
      </div>
    </div>
  );
};

// Main Community Component
const Community = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ismobile,setisMobile] = useState(window.innerWidth<768);
  const {login,logout,auth} = useAuth();
  const userName = auth?.userName || 'Souherdya';
  const userRole = auth?.role || 'Worker';
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // preview
    }
  };

    const navigate = useNavigate();

    // Add window resize listener
    useEffect(() => {
        const handleResize = () => {
            setisMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsMenu(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
  const [posts,setPosts] = useState([
    {
      id: "1",
      author: "Ramesh Kumar",
      location: "Mumbai, Maharashtra",
      timeAgo: "2 hours ago",
      category: "Help Request",
      content:
        "Hi everyone! I'm new to Mumbai and looking for affordable accommodation near construction sites in Andheri area. Any suggestions or contacts would be really helpful. My budget is around ₹3000-4000 per month.",
      likes: 12,
      replies: 5,
      isLiked: false,
      isImage: true,
    },
    {
      id: "2",
      author: "Priya Singh",
      location: "Delhi, NCR",
      timeAgo: "4 hours ago",
      category: "Information",
      content:
        "Important update: New labor laws have been implemented from this month. All construction workers are now entitled to minimum wage of ₹18,000 per month in NCR. Make sure your employer is following this.",
      likes: 28,
      replies: 8,
      isLiked: true,
      userType : 'Admin'
    },
    {
      id: "3",
      author: "Mohammed Ali",
      location: "Bangalore, Karnataka",
      timeAgo: "6 hours ago",
      category: "Experience Sharing",
      content:
        "Just wanted to share my success story. Started as a construction helper 2 years ago with ₹12,000 salary. Today I got promoted to site supervisor with ₹25,000 salary! Keep pushing forward brothers and sisters!",
      likes: 45,
      replies: 15,
      isLiked: true,
      userType : 'Worker'
    },
    {
      id: "3",
      author: "Mohammed Ali",
      location: "Bangalore, Karnataka",
      timeAgo: "6 hours ago",
      category: "Experience Sharing",
      content:
        "Just wanted to share my success story. Started as a construction helper 2 years ago with ₹12,000 salary. Today I got promoted to site supervisor with ₹25,000 salary! Keep pushing forward brothers and sisters!",
      likes: 45,
      replies: 15,
      isLiked: true,
      userType : 'Worker'
    },
    {
      id: "4",
      author: "Mohammed Ali",
      location: "Bangalore, Karnataka",
      timeAgo: "6 hours ago",
      category: "Experience Sharing",
      content:
        "Just wanted to share my success story. Started as a construction helper 2 years ago with ₹12,000 salary. Today I got promoted to site supervisor with ₹25,000 salary! Keep pushing forward brothers and sisters!",
      likes: 45,
      replies: 15,
      isLiked: true,
      userType : 'NGO'
    },
    {
      id: "5",
      author: "Mohammed Ali",
      location: "Bangalore, Karnataka",
      timeAgo: "6 hours ago",
      category: "Experience Sharing",
      content:
        "Just wanted to share my success story. Started as a construction helper 2 years ago with ₹12,000 salary. Today I got promoted to site supervisor with ₹25,000 salary! Keep pushing forward brothers and sisters!",
      likes: 45,
      replies: 15,
      isLiked: true,
      isImage: true,
      imageUrl: '',
      userType : 'NGO'
    },
  ]);

  const categories = [
    {
      id: "all",
      label: "All Posts",
      icon: MessageCircle,
      count: posts.length,
    },
    {
      id: "help",
      label: "Help Requests",
      icon: HelpCircle,
      count: posts.filter((p) => p.category === "Help Request").length,
    },
    {
      id: "info",
      label: "Information",
      icon: Info,
      count: posts.filter((p) => p.category === "Information").length,
    },
    {
      id: "experience",
      label: "Experience Sharing",
      icon: BookOpen,
      count: posts.filter((p) => p.category === "Experience Sharing").length,
    },
  ];

  const handlePost = async() => {
    if (!text.trim() && !image) return; // don’t add empty posts
    const id = posts.length + 1;

      const newPost = {
      id: Date.now().toString(), // unique id as string
      author: "You", // replace with logged-in user name
      location: "Unknown", // replace with actual user location
      timeAgo: "Just now",
      category: "General",
      content: text,
      likes: 0,
      replies: 0,
      isLiked: false,
      isImage: !!image,
      imageUrl: image || "",
      userType : 'Worker'
    };

    setPosts((prev) => [newPost, ...prev]); // add new post at top

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/community/createPost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content : `${newPost.content}`
        }),
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      console.log(data);
    } catch (error) {
      
    }


    setText("");
    setImage(null);
    setIsModalOpen(false) // close modal after posting
  };

  const filteredPosts =
    activeFilter === "all"
      ? posts
      : posts.filter((post) => {
          if (activeFilter === "help") return post.category === "Help Request";
          if (activeFilter === "info") return post.category === "Information";
          if (activeFilter === "experience")
            return post.category === "Experience Sharing";
          return true;
        });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>

    {isModalOpen ? 
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
        
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Create a Post</h2>

        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What do you want to talk about?"
          className="w-full p-3 border rounded-lg resize-none focus:ring focus:ring-blue-300 mb-4"
          rows="4"
        />

        
        <label className="block">
          <span className="sr-only">Choose an image</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0 file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </label>

        
        {image && (
          <div className="mt-4">
            <img
              src={image}
              alt="Preview"
              className="rounded-lg max-h-60 object-contain mx-auto"
            />
          </div>
        )}
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={()=>setIsModalOpen(false)}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              alert("Post submitted!")
              setIsModalOpen(false)
              handlePost()}}
            className="px-4 py-2 rounded-lg bg-secondary text-white hover:bg-foreground/70"
          >
            Post
          </button>
        </div>
      </div>
    </div>
    : <></>}


      {/* Header */}
      <div className="bg-gradient-hero">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Community Forum</h1>
              <p className="text-foreground opacity-80">
                Connect, share experiences, and help each other succeed
              </p>
            </div>
            <div className="relative">
              <button
                className="flex bg-foreground hover:bg-secondary 
                text-white font-semibold py-4 px-4 rounded-full 
                shadow-lg items-center justify-center transition-colors"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className={`h-5 w-5 ${ismobile ? 'mr-0' : 'mr-2'}`} />
                {ismobile ? null : 'New Post' }
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="card-styles rounded-2xl p-4 shadow-md">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts, questions, or topics..."
                  className="w-full px-10 py-2 rounded-lg border border-1 border-gray-300 
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-48">
                <select className="w-full py-2 px-3 rounded-lg border border-1
                border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="all">All Locations</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="delhi">Delhi</option>
                  <option value="bangalore">Bangalore</option>
                  <option value="hyderabad">Hyderabad</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card-styles bg-primary/50 rounded-xl p-4">
              <div className="card-header-styles">
                <h3 className="flex items-center text-lg font-semibold text-gray-800">
                  <Filter className="h-5 w-5 mr-2" />
                  Categories
                </h3>
              </div>
              <div className="p-4 space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`w-full text-left py-3 px-4 
                    rounded-lg flex items-center justify-between transition-colors ${
                      activeFilter === category.id
                        ? "bg-foreground text-white"
                        : "bg-transparent text-gray-700 hover:bg-secondary"
                    }`}
                    onClick={() => setActiveFilter(category.id)}
                  >
                    <div className="flex items-center">
                      <category.icon className="h-4 w-4 mr-3" />
                      <span className="flex-1">{category.label}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border border-1 ${
                        activeFilter === category.id
                          ? "border-white text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {activeFilter === "all"
                  ? "All Posts"
                  : categories.find((c) => c.id === activeFilter)?.label}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                <span>2,847 active members</span>
              </div>
            </div>

            <div className="space-y-8">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
