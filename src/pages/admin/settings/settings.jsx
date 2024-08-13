import React, { useEffect, useState } from "react";
import { createSettings, getAllSettings, getImageBaseUrl } from "src/api";

import { useQuery } from "react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";

const SettingsPage = () => {
    const [logo, setLogo] = useState(null);
    const [settings, setSettings] = useState({
        headerBackground: "",
        menuBarBackground: "",
        sidebarBackground: "",
        footerBackground: "",
        menuBarText: "",
        sidebarText: "",
        footerText: "",
        buttonText: "",
        buttonBackground: "",
        sideBarHoverBackgroundColor: "",
        sideBarHoverTextColor: "",
        sideBarActiveBackgroundColor: "",
        sideBarActiveTextColor: "",
        menuOption: "",
    });
    const [menuOptionList] = useState(["Sidebar", "Menubar"]);

    const { isError, data, isLoading } = useQuery("getAllSettings", async () => {
        return await getAllSettings({ pageNumber: 0, pageSize: 10 });
    });

    useEffect(() => {
        if (!isError && !isLoading && data) {
            const settingsData = data.data.settings;
            const updatedSettings = { ...settings };

            settingsData.forEach(setting => {
                const { setting_name, setting_value } = setting;
                if (setting_value.startsWith("uploads/")) {
                    setLogo(getImageBaseUrl(setting_value));
                }
                if (setting_name in updatedSettings) {
                    updatedSettings[setting_name] = setting_value;
                }
            });

            setSettings(updatedSettings);
        }
    }, [isError, isLoading, data]);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            console.log("file", file);
            setLogo(file);
        } else {
            alert("Please select a valid image file.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings((prevSettings) => ({
            ...prevSettings,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        const formData = new FormData();
        if (logo) {
            formData.append("image", logo);
        }

        Object.keys(settings).forEach((key) => {
            formData.append(key, settings[key]);
        });

        if (Object.values(settings).some((value) => value !== "") || logo) {
            try {
                const result = await createSettings(formData);
                toast.success("Settings saved successfully!");
                console.log("Create Settings result:", result.data);
            } catch (error) {
                toast.error("Error creating Settings!");
                console.error("Error creating Settings!", error);
            }
        } else {
            toast.error("Please fill in at least one setting or upload an image.");
        }


    };

    return (
        <div className="container mx-auto mt-10">
            <h1 className="text-2xl font-mono font-bold mb-4">Settings</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block mt-10 mb-2 font-mono font-bold">Logo</label>
                    <div className="mb-4">
                        {logo ? (
                            typeof logo === 'string' ? (
                                <img
                                    src={logo}
                                    alt="Uploaded Logo"
                                    className="w-full h-32 object-cover mb-2"
                                />
                            ) : (
                                <img
                                    src={URL.createObjectURL(logo)}
                                    alt="Uploaded Logo"
                                    className="w-full h-32 object-cover mb-2"
                                />
                            )

                        ) : (
                            <div className="w-full h-32 bg-gray-200 mb-2 flex items-center justify-center">
                                <span>No logo uploaded</span>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="block"
                        />
                    </div>
                </div>

                <div>
                    {/* <label className="block mt-10 mb-2 font-mono font-bold">Background Colors</label> */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block mt-10 mb-2 font-mono font-bold">Menu Bar Background</label>
                            <input
                                type="color"
                                name="menuBarBackground"
                                value={settings.menuBarBackground}
                                onChange={handleChange}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-mono font-bold">Sidebar Background</label>
                            <input
                                type="color"
                                name="sidebarBackground"
                                value={settings.sidebarBackground}
                                onChange={handleChange}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-mono font-bold">Footer Background</label>
                            <input
                                type="color"
                                name="footerBackground"
                                value={settings.footerBackground}
                                onChange={handleChange}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-mono font-bold">Button Background</label>
                            <input
                                type="color"
                                name="buttonBackground"
                                value={settings.buttonBackground}
                                onChange={handleChange}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-mono font-bold">SideBar Hover Background</label>
                            <input
                                type="color"
                                name="sideBarHoverBackgroundColor"
                                value={settings.sideBarHoverBackgroundColor}
                                onChange={handleChange}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-mono font-bold">SideBar Active Background</label>
                            <input
                                type="color"
                                name="sideBarActiveBackgroundColor"
                                value={settings.sideBarActiveBackgroundColor}
                                onChange={handleChange}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-mono font-bold">Header Background</label>
                            <input
                                type="color"
                                name="headerBackground"
                                value={settings.headerBackground}
                                onChange={handleChange}
                                className="w-full"
                            />
                        </div>

                    </div>
                </div>

                <div>
                    <label className="block mt-10 mb-2 font-mono font-bold">Menu Text Colors</label>
                    <div className="flex flex-col gap-4">
                        <div>
                            {/* <label className="block mt-10 mb-2 font-mono font-bold">Menu Bar Text</label> */}
                            <input
                                type="color"
                                name="menuBarText"
                                value={settings.menuBarText}
                                onChange={handleChange}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-mono font-bold">Sidebar Text</label>
                            <input
                                type="color"
                                name="sidebarText"
                                value={settings.sidebarText}
                                onChange={handleChange}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-mono font-bold">Footer Text</label>
                            <input
                                type="color"
                                name="footerText"
                                value={settings.footerText}
                                onChange={handleChange}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-mono font-bold">Button Text</label>
                            <input
                                type="color"
                                name="buttonText"
                                value={settings.buttonText}
                                onChange={handleChange}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-mono font-bold">Sidebar Hover Text</label>
                            <input
                                type="color"
                                name="sideBarHoverTextColor"
                                value={settings.sideBarHoverTextColor}
                                onChange={handleChange}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-mono font-bold">SideBar Active Text</label>
                            <input
                                type="color"
                                name="sideBarActiveTextColor"
                                value={settings.sideBarActiveTextColor}
                                onChange={handleChange}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block mt-10 mb-2 font-mono font-bold">Menu Option</label>
                    <div className="mt-2">
                        <select
                            name="menuOption"
                            value={settings.menuOption}
                            onChange={(e) =>
                                setSettings((prevSettings) => ({
                                    ...prevSettings,
                                    [e.target.name]: e.target.value,
                                  }))
                              }
                            className="mt-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5 font-medium font-mono"
                        >
                            {menuOptionList.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>


            <button
                onClick={handleSubmit}
                className="mt-10 float-right bg-green-950 text-white py-2 px-4 rounded"
            >
                Save Changes
            </button>
            <ToastContainer />

        </div>
    );
};

export default SettingsPage;
