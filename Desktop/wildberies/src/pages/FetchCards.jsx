// import React, { useEffect, useState } from "react";
// import axiosinstance from "../axiosinstance";
// import { HiOutlineShoppingCart } from "react-icons/hi";

// export default function FetchCards() {
//   const [teachers, setTeachers] = useState([]);

//   // GET
//   const fetchTeachers = async () => {
//     try {
//       const response = await axiosinstance.get("/Products");
//       setTeachers(response.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // POST (если понадобится)
//   const newData = {
//     name: "Kamron",
//     avatar: "https://static.vecteezy.com/system/resources/previews/033/882/148/non_2x/transparent-background-person-icon-free-png.png",
//     difinition: "Backend developer",
//     cost: 99,
//   };

//   // DELETE
//   const deleteUser = async (id) => {
//     try {
//       await axiosinstance.delete(`/Products/${id}`);
//       fetchTeachers();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchTeachers();
//   }, []);

//   return (
//     <div className="px-10 py-10">
//       <div className="grid grid-cols-1 sm:grid-cols-10 lg:grid-cols-6 gap-10">
//         {teachers.map((item) => (
//           <div
//             key={item.id}
//             className="bg-white rounded-xl  w-52 shadow-sm p-4 hover:shadow-md transition"
//           >
            
//             <img
//               src={item.avatar}
//               alt={item.name}
//               className="w-full h-40 object-cover rounded-lg"
//             />

//             <h2 className="text-lg font-bold mt-3">
//               {item.name}
//             </h2>

//             <p className="text-sm text-gray-600 mt-1">
//               {item.difinition}
//             </p>

//             <p className="text-xl font-bold mt-3">
//               {item.cost} ₽
//             </p>
//             <div>
//               <button className="flex items-center justify-center gap-3 bg-[#a832ff] hover:bg-[#9126e6] text-white px-5 py-1
              
              
              
              
//               rounded-2xl font-bold text-lg transition-colors duration-200 shadow-md active:scale-95">
//                 <HiOutlineShoppingCart className="w-6 h-6" />
//                 <span>16 января</span>
//               </button>
//               {/* <button
//                 onClick={() => deleteUser(item.id)}
//                 className="mt-3 text-red-500"
//               >
//                 Delete
//               </button> */}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import axiosinstance from "../axiosinstance";
import { HiOutlineShoppingCart } from "react-icons/hi";
import LikeButton from "../models/LikeButton";
import { useLanguage } from "../context/LanguageContext";


export default function FetchCards() {
  const [teachers, setTeachers] = useState([]);
  const { t } = useLanguage();

  const fetchTeachers = async () => {
    try {
      const response = await axiosinstance.get("/Products");
      setTeachers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className="px-10 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-10 lg:grid-cols-6 gap-10">
        {teachers.map((item) => (
          <div
            key={item.id}
            className="relative bg-white rounded-xl w-52 shadow-sm p-4 hover:shadow-md transition"
          >
            {/* ❤️ ЛАЙК */}
            <div className="absolute top-3 right-3 z-10">
              <LikeButton />
            </div>

            <img
              src={item.avatar}
              alt={item.name}
              className="w-full h-40 object-cover rounded-lg"
            />

            <h2 className="text-lg font-bold mt-3">
              {item.name}
            </h2>

            <p className="text-sm text-gray-600 mt-1">
              {item.difinition}
            </p>

            <p className="text-xl font-bold mt-3">
              {item.cost} ₽
            </p>

            <button
              className="
                mt-3 flex items-center justify-center gap-3
                bg-[#a832ff] hover:bg-[#9126e6]
                text-white px-5 py-1 rounded-2xl
                font-bold text-lg transition-colors duration-200
                shadow-md active:scale-95
              "
            >
              <HiOutlineShoppingCart className="w-6 h-6" />
              <span>16 {t('january')}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
