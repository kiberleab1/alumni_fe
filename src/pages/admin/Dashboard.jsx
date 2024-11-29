import React from "react";
import {
    LineChart,
    DonutChart,
    BarChart,
    RadarChart,
    PieChart
} from "../../utils/ChartComponents";
import "./dashboard.css";

export const Dashboard = () => {
    return (
        <div id="webcrumbs" className="md:p-8">
            <div className="max-w-[1600px] mx-auto bg-white rounded-lg shadow-lg">
                <header className="flex flex-wrap justify-between items-center px-4 md:px-8 py-4 md:py-6 bg-primary-500 text-primary-50 rounded-t-lg">
                    <h1 className="text-2xl md:text-3xl font-title text-white text-bold">Dashboard</h1>
                    <div className="flex items-center gap-2 md:gap-4">
                        <button className="bg-primary-950 text-primary-50 rounded-md h-[40px] w-[40px] flex items-center justify-center">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <button className="bg-primary-50 text-primary-950 rounded-full h-[40px] w-[40px]">
                            <img
                                src="https://tools-api.webcrumbs.org/image-placeholder/40/40/avatars/1"
                                alt="User Avatar"
                                className="rounded-full object-cover"
                                width={40}
                                height={40}
                            />
                        </button>
                    </div>
                </header>

                <section className="p-4 md:p-8">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-3">
                        <div className='bg-[#d8cbb2] rounded-md p-4 hover:shadow-xl transition-all duration-300 hover:rotate-3'>
                            <h2 className='text-lg font-semibold text-neutral-950'>Total Alumni</h2>
                            <p className='text-4xl font-bold text-[#b87b74] animate-bounce'>15,345</p>
                        </div>

                        <div className='bg-[#d8cbb2] rounded-md p-4 hover:shadow-xl transition-all duration-300 hover:rotate-3'>
                            <h2 className='text-lg font-semibold text-neutral-950'>Active Alumni</h2>
                            <p className='text-4xl font-bold text-[#b87b74] animate-pulse'>8,765</p>
                        </div>

                        <div className='bg-[#d8cbb2] rounded-md p-4 hover:shadow-xl transition-all duration-300 hover:rotate-3'>
                            <h2 className='text-lg font-semibold text-neutral-950'>New Alumni</h2>
                            <p className='text-4xl font-bold text-[#b87b74] animate-bounce'>345</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <LineChart
                            title="Alumni Engagement by Year"
                            data={[4500, 4800, 5100, 5300, 5800, 6000, 6200]}
                            categories={["2016", "2017", "2018", "2019", "2020", "2021", "2022"]}
                        />
                        <DonutChart
                            title="Alumni by Location"
                            series={[35, 25, 15, 10, 5, 10]}
                            labels={["North America", "Europe", "Asia", "South America", "Africa", "Others"]}
                        />
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        <BarChart
                            title="Alumni Contributions"
                            data={[1200, 1500, 1800, 2000, 2200, 2450, 2700, 3000]}
                            categories={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]}
                            yAxisTitle="Contribution ($)"
                        />
                        <RadarChart
                            title="Alumni Events Attendance"
                            data={[55, 60, 65, 80, 90, 75, 70]}
                            categories={["Event1", "Event2", "Event3", "Event4", "Event5", "Event6", "Event7"]}
                        />
                        <PieChart
                            title="Alumni Engagement by Medium"
                            series={[40, 30, 15, 10, 5]}
                            labels={["Email", "Social Media", "Events", "Phone", "Others"]}
                        />
                    </div>

                    <div className='mt-8'>
                        <h2 className='text-xl font-semibold text-neutral-950 mb-4'>Recent Alumni Activities</h2>
                        <div className='bg-[#d8cbb2] rounded-md p-4'>
                            <ul className='divide-y divide-neutral-300 text-black'>
                                <li className='py-2 flex justify-between items-center hover:bg-[#f5ead2] hover:pl-2 transition-all duration-300'>
                                    <span>John Doe updated his profile</span>
                                    <span className='text-sm text-neutral-700'>2 hours ago</span>
                                </li>
                                <li className='py-2 flex justify-between items-center hover:bg-[#f5ead2] hover:pl-2 transition-all duration-300'>
                                    <span>Jane Smith added a new post</span>
                                    <span className='text-sm text-neutral-700'>1 day ago</span>
                                </li>
                                <li className='py-2 flex justify-between items-center hover:bg-[#f5ead2] hover:pl-2 transition-all duration-300'>
                                    <span>Michael Brown attended a meetup</span>
                                    <span className='text-sm text-neutral-700'>3 days ago</span>
                                </li>
                                <li className='py-2 flex justify-between items-center hover:bg-[#f5ead2] hover:pl-2 transition-all duration-300'>
                                    <span>Emily Wilson marked her 5-year anniversary</span>
                                    <span className='text-sm text-neutral-700'>4 days ago</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
