import React, { useEffect } from "react";
import Chart from "react-apexcharts";

const randomColor = () => {
    const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    return /^#[0-9A-F]{6}$/i.test(color) ? color : "#000000";
};

export const LineChart = ({ data, categories, title }) => {
    useEffect(() => {
        console.log("LineChart Props:", { data, categories });
    }, [data, categories]);

    if (!data || !categories || data.length !== categories.length) {
        return <p className="text-red-500">Error: Invalid data for {title}</p>;
    }

    console.log(data)
    console.log(title)
    return (
        <div className="bg-neutral-100 rounded-md p-4 hover:scale-105 hover:bg-[#b87b74] hover:text-primary-50 transition-transform duration-300">
            <h2 className="text-lg font-semibold text-neutral-950 mb-4">{title}</h2>
            <Chart
                type="line"
                series={[{ name: title, data }]}
                options={{
                    chart: { toolbar: { show: false } },
                    colors: [randomColor()],
                    dataLabels: { enabled: false },
                    stroke: { curve: 'smooth' }
                }}
                width="100%"
                height="300px"
            />
        </div>
    );
};

export const DonutChart = ({ series, labels, title }) => {
    useEffect(() => {
        console.log("DonutChart Props:", { series, labels });
    }, [series, labels]);

    if (!series || !labels || series.length !== labels.length) {
        return <p className="text-red-500">Error: Invalid data for {title}</p>;
    }

    return (
        <div className="bg-neutral-100 rounded-md p-4 hover:scale-105 hover:bg-[#b87b74] hover:text-primary-50 transition-transform duration-300">
            <h2 className="text-lg font-semibold text-neutral-950 mb-4">{title}</h2>
            <Chart
                type="donut"
                series={series}
                options={{
                    chart: { toolbar: { show: false } },
                    colors: series.map(() => randomColor()),
                    labels,
                    dataLabels: { enabled: false }
                }}
                width="100%"
                height="300px"
            />
        </div>
    );
};

export const PieChart = ({ series, labels, title }) => {
    if (!series || !labels || series.length !== labels.length) {
        return <p className="text-red-500">Error: Invalid data for {title}</p>;
    }

    return (
        <div className="bg-neutral-100 rounded-md p-4 hover:scale-105 hover:bg-[#b87b74] hover:text-primary-50 transition-transform duration-300">
            <h2 className="text-lg font-semibold text-neutral-950 mb-4">{title}</h2>
            <Chart
                type="pie"
                series={series}
                options={{
                    chart: { toolbar: { show: false } },
                    colors: series.map(() => randomColor()),
                    labels,
                    dataLabels: { enabled: false }
                }}
                width="100%"
                height="300px"
            />
        </div>
    );
};

export const BarChart = ({ data, categories, title, yAxisTitle }) => {
    if (!data || !categories || data.length !== categories.length) {
        return <p className="text-red-500">Error: Invalid data for {title}</p>;
    }

    return (
        <div className="bg-neutral-100 rounded-md p-4 hover:scale-105 hover:bg-[#b87b74] hover:text-primary-50 transition-transform duration-300">
            <h2 className="text-lg font-semibold text-neutral-950 mb-4">{title}</h2>
            <Chart
                type="bar"
                series={[{ name: title, data }]}
                options={{
                    chart: { toolbar: { show: false } },
                    colors: [randomColor()],
                    dataLabels: { enabled: false },
                    xaxis: { categories },
                    yaxis: { title: { text: yAxisTitle } }
                }}
                width="100%"
                height="300px"
            />
        </div>
    );
};

export const RadarChart = ({ data, categories, title }) => {
    if (!data || !categories || data.length !== categories.length) {
        return <p className="text-red-500">Error: Invalid data for {title}</p>;
    }

    return (
        <div className="bg-neutral-100 rounded-md p-4 hover:scale-105 hover:bg-[#b87b74] hover:text-primary-50 transition-transform duration-300">
            <h2 className="text-lg font-semibold text-neutral-950 mb-4">{title}</h2>
            <Chart
                type="radar"
                series={[{ name: title, data }]}
                options={{
                    chart: { toolbar: { show: false } },
                    colors: [randomColor()],
                    dataLabels: { enabled: false },
                    xaxis: { categories }
                }}
                width="100%"
                height="300px"
            />
        </div>
    );
};
