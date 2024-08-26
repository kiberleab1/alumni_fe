import React from "react";
import img from "../../../assets/images/testimonial/2.jpg";
const alumniData = [
  {
    name: "John Doe",
    class: "Class of 2015",
    role: "Software Engineer, Acme Inc.",
  },
  {
    name: "Jane Smith",
    class: "Class of 2018",
    role: "Marketing Manager, Acme Corp.",
  },
  {
    name: "Michael Johnson",
    class: "Class of 2012",
    role: "Entrepreneur, Startup Founder",
  },
  {
    name: "Emily Davis",
    class: "Class of 2020",
    role: "Data Scientist, Acme Analytics",
  },
  {
    name: "David Lee",
    class: "Class of 2016",
    role: "Product Manager, Acme Tech",
  },
  {
    name: "Sarah Chen",
    class: "Class of 2019",
    role: "Graphic Designer, Acme Design",
  },
];

const AlumniCard = ({ name, className, role }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 text-center">
      <div className="w-28 h-28 mx-auto rounded-full bg-gray-200 mb-4">
        <img src={img} alt="" className="rounded-full" />
      </div>
      <h3 className="text-xl font-semibold">{name}</h3>
      <p className="text-gray-500">{className}</p>
      <p className="mt-2 text-gray-700">{role}</p>
      <button className="mt-4 bg-black text-white px-4 py-2 rounded-lg w-full">
        View Profile
      </button>
    </div>
  );
};

const AlumniGrid = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-8">
        <input
          type="text"
          placeholder="Search alumni..."
          className="border p-2 rounded-md bg-white"
        />
        <button className="ml-4 bg-gray-200 px-4 py-2 rounded-md bg-gray-800 text-gray-300">
          Filter by
        </button>
        <button className="ml-2 bg-gray-200 px-4 py-2 rounded-md bg-gray-800 text-gray-300">
          Filters
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {alumniData.map((alumni) => (
          <AlumniCard
            key={alumni.name}
            name={alumni.name}
            className={alumni.class}
            role={alumni.role}
          />
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <button className="mx-2 p-2">◀</button>
        <button className="mx-2 p-2">1</button>
        <button className="mx-2 p-2">2</button>
        <button className="mx-2 p-2">3</button>
        <button className="mx-2 p-2">▶</button>
      </div>
    </div>
  );
};

export default AlumniGrid;
