// "use client";
// import { auth } from "@/auth";
// import React, { useState, useEffect } from "react";
// import { Camera, X } from "lucide-react";
// import AppNavbar from "@/components/AppNavbar";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";

// interface ProfileData {
//   username: string;
//   name: string;
//   bio: string;
//   location: string;
//   followers: number;
//   following: number;
//   likesReceived: number;
//   joinDate: string;
// }

// const ProfileComponent: React.FC = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [profileData, setProfileData] = useState<ProfileData>({
//     username: "alamin",
//     name: "",
//     bio: "",
//     location: "",
//     followers: 0,
//     following: 3,
//     likesReceived: 6,
//     joinDate: "August 2023",
//   });

//   useEffect(() => {
//     fetchProfileData();
//   }, []);

//   const fetchProfileData = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/profile");
//       const data = await response.json();
//       setProfileData(data);
//     } catch (error) {
//       console.error("Error fetching profile data:", error);
//     }
//   };

//   const handleEditProfile = () => {
//     setIsEditing(true);
//   };

//   const handleSaveChanges = async () => {
//     try {
//       await fetch("http://localhost:5000/api/profile", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(profileData),
//       });
//       setIsEditing(false);
//     } catch (error) {
//       console.error("Error saving profile data:", error);
//     }
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setProfileData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   return (
//     <>
//       <AppNavbar />
//       <div className=" text-white p-4 max-w-md mx-auto md:max-w-2xl lg:max-w-4xl">
//         <div className="flex flex-col md:flex-row items-center justify-between mb-4">
//           <div className="flex items-center space-x-4">
//             <div className="relative">
//               {/* <img
//                 src="https://images.unsplash.com/photo-1720188228786-e6cb3b668aef?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8"
//                 alt="Profile"
//                 className="w-20 h-20 rounded-full"
//               /> */}
//               <img src={session.user.image} alt="User Avatar" />
//               <button className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full">
//                 <Camera size={16} />
//               </button>
//             </div>
//             <div>
//               <h2 className="text-xl font-bold">{profileData.username}</h2>
//               <button className="text-sm text-gray-400">+ Add name</button>
//             </div>
//           </div>
//           <Dialog open={isEditing} onOpenChange={setIsEditing}>
//             <DialogTrigger asChild>
//               <button
//                 onClick={handleEditProfile}
//                 className="px-4 py-2 bg-gray-800 rounded-full text-sm"
//               >
//                 Edit profile
//               </button>
//             </DialogTrigger>
//             <DialogContent className="bg-gray-900 text-white">
//               <DialogHeader>
//                 <DialogTitle>Edit profile</DialogTitle>
//               </DialogHeader>
//               <div className="space-y-4">
//                 <div>
//                   <label
//                     htmlFor="username"
//                     className="block text-sm font-medium mb-1"
//                   >
//                     Username
//                   </label>
//                   <Input
//                     id="username"
//                     name="username"
//                     value={profileData.username}
//                     onChange={handleInputChange}
//                     className="bg-gray-800 border-gray-700"
//                   />
//                 </div>
//                 <div>
//                   <label
//                     htmlFor="name"
//                     className="block text-sm font-medium mb-1"
//                   >
//                     Name (optional)
//                   </label>
//                   <Input
//                     id="name"
//                     name="name"
//                     value={profileData.name}
//                     onChange={handleInputChange}
//                     className="bg-gray-800 border-gray-700"
//                   />
//                 </div>
//                 <div>
//                   <label
//                     htmlFor="location"
//                     className="block text-sm font-medium mb-1"
//                   >
//                     Location (optional)
//                   </label>
//                   <Input
//                     id="location"
//                     name="location"
//                     value={profileData.location}
//                     onChange={handleInputChange}
//                     className="bg-gray-800 border-gray-700"
//                   />
//                 </div>
//                 <div>
//                   <label
//                     htmlFor="bio"
//                     className="block text-sm font-medium mb-1"
//                   >
//                     Bio (optional)
//                   </label>
//                   <Textarea
//                     id="bio"
//                     name="bio"
//                     value={profileData.bio}
//                     onChange={handleInputChange}
//                     className="bg-gray-800 border-gray-700"
//                     rows={3}
//                   />
//                 </div>
//               </div>
//               <Button onClick={handleSaveChanges} className="mt-4 w-full">
//                 Save changes
//               </Button>
//             </DialogContent>
//           </Dialog>
//         </div>
//         {/* <div className="flex space-x-4 mb-4">
//         <span>{profileData.followers} follower</span>
//         <span>{profileData.following} following</span>
//         <span>{profileData.likesReceived} likes received</span>
//       </div> */}
//         <button className="text-sm text-gray-400 mb-4">+ Add bio</button>
//         <div className="flex items-center text-sm text-gray-400 mb-4">
//           <span className="mr-2">📅</span>
//           <span>Joined {profileData.joinDate}</span>
//         </div>
//         <button className="text-sm text-gray-400">+ Add location</button>
//       </div>
//     </>
//   );
// };

// export default ProfileComponent;

"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Camera } from "lucide-react";
import AppNavbar from "@/components/AppNavbar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ProfileData {
  username: string;
  name: string;
  bio: string;
  location: string;
  followers: number;
  following: number;
  likesReceived: number;
  joinDate: string;
}

const ProfileComponent: React.FC = () => {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    username: "alamin",
    name: "",
    bio: "",
    location: "",
    followers: 0,
    following: 3,
    likesReceived: 6,
    joinDate: "August 2023",
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/profile");
      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    try {
      await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile data:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <>
      <AppNavbar />
      <div className="text-white p-4 max-w-md mx-auto md:max-w-2xl lg:max-w-4xl">
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              {session?.user?.image && (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-20 h-20 rounded-full"
                />
              )}
              <button className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full">
                <Camera size={16} />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold">{profileData.username}</h2>
              <button className="text-sm text-gray-400">+ Add name</button>
            </div>
          </div>
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <button
                onClick={handleEditProfile}
                className="px-4 py-2 bg-gray-800 rounded-full text-sm"
              >
                Edit profile
              </button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-white">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium mb-1"
                  >
                    Username
                  </label>
                  <Input
                    id="username"
                    name="username"
                    value={profileData.username}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1"
                  >
                    Name (optional)
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium mb-1"
                  >
                    Location (optional)
                  </label>
                  <Input
                    id="location"
                    name="location"
                    value={profileData.location}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium mb-1"
                  >
                    Bio (optional)
                  </label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700"
                    rows={3}
                  />
                </div>
              </div>
              <Button onClick={handleSaveChanges} className="mt-4 w-full">
                Save changes
              </Button>
            </DialogContent>
          </Dialog>
        </div>
        <button className="text-sm text-gray-400 mb-4">+ Add bio</button>
        <div className="flex items-center text-sm text-gray-400 mb-4">
          <span className="mr-2">📅</span>
          <span>Joined {profileData.joinDate}</span>
        </div>
        <button className="text-sm text-gray-400">+ Add location</button>
      </div>
    </>
  );
};

export default ProfileComponent;
