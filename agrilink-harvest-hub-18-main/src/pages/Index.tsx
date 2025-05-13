// import React, { useEffect, useState } from "react";
// import Layout from "@/components/Layout";
// import Hero from "@/components/Hero";
// import CategorySection from "@/components/CategorySection";
// import FeaturedProducts from "@/components/FeaturedProducts";
// import WhyChooseUs from "@/components/WhyChooseUs";
// import Testimonials from "@/components/Testimonials";
// import CallToAction from "@/components/CallToAction";
// import { fetchCategories } from "@/services/categoryService";




// const Index: React.FC = () => {
//   const [categories, setCategories] = useState<any[]>([]);

//   useEffect(() => {
//     const getData = async () => {
//       const data = await fetchCategories();
//       setCategories(data);
//     };
//     getData();
//   }, []);

//   return (
//     <Layout>
//       <Hero />
//       <CategorySection />
//       <FeaturedProducts />
//       <WhyChooseUs />
//       <Testimonials />
//       <CallToAction />

//       {/* 🧪 Supabase Test Section */}
//       <div className="bg-gray-100 p-4 rounded mt-8">
//         <h2 className="text-xl font-semibold mb-2">🌿 Categories from Supabase</h2>
//         <ul className="list-disc pl-6 space-y-1">
//           {categories.map((category) => (
//             <li key={category.Category_ID}>
//               <strong>{category.Category_Name}</strong>: {category.Description}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </Layout>
//   );
// };


// export default Index;

import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import CallToAction from "@/components/CallToAction";
import { fetchCategories } from "@/services/categoryService";

const Index: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    getData();
  }, []);

  return (
    <Layout>
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      <WhyChooseUs />
      <Testimonials />
      <CallToAction />

      {/* ✅ Supabase Test Section: Display Categories */}
      <div className="bg-gray-100 p-6 mt-8 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">🌿 Available Categories (from Supabase)</h2>
        {categories.length === 0 ? (
          <p className="text-gray-600">No categories found.</p>
        ) : (
          <ul className="list-disc pl-6 space-y-2">
            {categories.map((category) => (
              <li key={category.Category_ID}>
                <strong>{category.Category_Name}</strong>: {category.Description}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default Index;

