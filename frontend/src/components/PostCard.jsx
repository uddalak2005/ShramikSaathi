// import { useState } from "react";
// import '../index.css'

// const PostCard = ({
//   id,
//   author,
//   avatar,
//   location,
//   timeAgo,
//   category,
//   content,
//   likes,
//   replies,
//   isLiked: initialLiked = false,
//   isImage = false,
//   imageUrl = null
// }) => {
//   const [isLiked, setIsLiked] = useState(initialLiked);

//   const getCategoryColor = (category) => {
//     switch (category.toLowerCase()) {
//       case 'help request':
//         return 'bg-destructive text-destructive-foreground';
//       case 'information':
//         return 'bg-accent text-accent-foreground';
//       case 'experience sharing':
//         return 'bg-success text-success-foreground';
//       default:
//         return 'bg-muted text-muted-foreground';
//     }
//   };

//   return (
//     <div className="flex flex-col gap-2 card-styles bg-card text-card-foreground rounded-lg 
//     shadow-soft border border-border hover:shadow-medium 
//     p-4">
//       {/* Header */}
//       <div className="flex items-start justify-between pb-3">
//         <div className="flex items-center space-x-3">
//           {/* Avatar */}
//           <div className="h-10 w-10 rounded-full overflow-hidden bg-gradient-hero 
//           flex items-center justify-center text-foreground font-bold">
//             {avatar ? <img src={avatar} alt={author} className="h-full w-full object-cover" /> : author.charAt(0).toUpperCase()}
//           </div>

//           <div>
//             <div className="flex items-center gap-2 mb-1">
//               <h4 className="font-semibold text-foreground">{author}</h4>
//               <span className={`text-xs px-2 py-1 rounded-sm ${getCategoryColor(category)}`}>
//                 {category}
//               </span>
//             </div>

//             <div className="flex items-center text-xs text-muted-foreground">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.656 0 3-1.344 3-3S13.656 5 12 5 9 6.344 9 8s1.344 3 3 3zM12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" />
//               </svg>
//               {location}
//               <span className="mx-2">•</span>
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2m2 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               {timeAgo}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <p className="text-foreground mb-4 leading-relaxed">{content}</p>

//       {/* Actions */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           {/* Like Button */}
//           <button
//             className={`flex items-center text-sm px-2 py-1 rounded hover:bg-muted 
//             ${isLiked ? 'text-destructive' : 'text-muted-foreground'}`}
//             onClick={() => setIsLiked(!isLiked)}
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
//             </svg>
//             {likes}
//           </button>

//           {/* Reply Button */}
//           <button className="flex items-center text-sm px-2 py-1 rounded text-muted-foreground hover:bg-muted">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-3.582 8-8 8-1.657 0-3.177-.51-4.427-1.364L3 21l1.364-5.573A7.96 7.96 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
//             </svg>
//             {replies}
//           </button>
//         </div>

//         {/* Share Button */}
//         <button className="flex items-center text-sm px-2 py-1 rounded text-muted-foreground hover:bg-muted">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12v-2a8 8 0 0116 0v2M4 12h16M12 16v-4" />
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PostCard;
