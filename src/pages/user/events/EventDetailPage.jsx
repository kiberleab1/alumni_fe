const EventDetailPage = ({ event }) => {
  if (!event) {
    return <p>Event data is not available.</p>;
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="max-w-5xl mx-auto bg-gray-200 shadow-xl rounded-lg overflow-hidden">
            <div className="p-6">
              <h1 className="text-4xl font-bold text-left">{event.title || "No Title"}</h1>
              <p className="text-gray-400 text-left">{event.time || "No Time"}</p>
              <p className="text-gray-500 text-left">{event.venue || "No Venue"}</p>
            </div>
          </div>

          <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden mt-6">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-left">About the Event</h2>
              <p className="text-gray-500 text-left mt-4" dangerouslySetInnerHTML={{ __html: event.description || "No Description" }}></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;