import React from 'react';

const EventDetailPage = () => {
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="max-w-5xl mx-auto bg-gray-200 shadow-xl rounded-lg overflow-hidden">
            <div className="p-6">
              <h1 className="text-4xl text-black font-bold mt-2 text-justify">Elevate Your Skills: React.js Conference 2024</h1>
              <p className="text-gray-500 text-justify mt-4 text-lg">June 15-17, 2024</p>
              <p className="text-gray-500 text-left">San Francisco, CA</p>
            </div>
          </div>

          <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden mt-6">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-left">About the Event</h2>
              <p className="mt-4 text-justify text-lg">
                Join us for the React.js Conference 2024, a premier event dedicated to exploring the latest advancements and best practices in the world of React.js development. This three-day conference will bring together industry experts, seasoned developers, and passionate enthusiasts to share their knowledge, insights, and experiences.

                Whether you're a beginner looking to dive into the React.js ecosystem or an experienced developer seeking to expand your skills, this conference has something for everyone. Attend engaging keynotes, participate in hands-on workshops, and network with like-minded individuals who share your passion for building exceptional web applications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
