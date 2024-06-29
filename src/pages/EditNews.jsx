import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateNews, getInstitutes } from '../api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function EditNews({news}) {

    console.log(news)
    const [institutions, setInstitutions] = useState([]);
    const [newsLevel, setNewsLevel] = useState(['High', 'Medium', 'Low']);

    const dateObject = new Date(news.deadline);
    const year = dateObject.getUTCFullYear();
    const month = String(dateObject.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getUTCDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    const [newsFormFields, setNewsFormFields] = useState({
        ownerAdminId: '129ewrd-32323-323',
        ownerInstituteId: news.ownerInstituteId ? news.ownerInstituteId : '',
        title: news.title? news.title : '',
        description: news.description? news.description : '',
        level: news.level ? news.level : '',
        deadline: formattedDate? formattedDate : '',
        image: null,
    });

    const { isError, data, error, isFetching } = useQuery(
        ['getInstitutes'],
        async () => {
            try {
                const instituteData = await getInstitutes({ pageNumber: 1, pageSize: 10 });
                console.log(instituteData);
                if (instituteData) {
                    const instituteNames = Object.values(instituteData.data.institute).map(
                        institute => ({
                            name: institute.name,
                            id: institute.id,
                        })
                    );

                    if(newsFormFields.ownerInstituteId == "" || newsFormFields.ownerInstituteId== null) {
                        newsFormFields.ownerInstituteId = instituteData.data.institute[0].id;
                    }
                    setInstitutions(instituteNames);
                }
            } catch (error) {
                console.error(error);
            }
        }
    );

    const handleImageChange = (e) => {
        setNewsFormFields({ ...newsFormFields, image: e.target.files[0] });
    };

    const handleNewsSaveButtonClick = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('id', news.id);
        formData.append('ownerAdminId', newsFormFields.ownerAdminId);
        formData.append('ownerInstituteId', newsFormFields.ownerInstituteId);
        formData.append('title', newsFormFields.title);
        formData.append('description', newsFormFields.description);
        formData.append('deadline', newsFormFields.deadline);
        formData.append('level', newsFormFields.level);
        if (newsFormFields.image) {
            formData.append('image', newsFormFields.image);
        }

        try {
            const result = await updateNews(formData);
            toast.success('News udpated successfully!');
            console.log('update news result:', result.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to update news');
        }
    };

    return (
        <div className="space-y-10 divide-y divide-gray-900/10">
            <div className="grid grid-cols-1 gap-x-8 gap-y-8 pl-10 pr-10 pt-10 md:grid-cols-2">
                <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2" encType="multipart/form-data">
                    <div className="px-4 sm:px-0">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">News Information</h2>
                    </div>
                    <div className="px-4 py-6 sm:p-8">
                        <div className="grid max-w-full grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-2">
                                <label htmlFor="news-title" className="block text-sm font-medium leading-6 text-gray-900">
                                    News Title
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        name="news-title"
                                        id="news-title"
                                        required
                                        value={newsFormFields.title}
                                        onChange={(e) => setNewsFormFields({ ...newsFormFields, title: e.target.value })}
                                        placeholder="News Title"
                                        className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="news-deadline" className="block text-sm font-medium leading-6 text-gray-900">
                                    News Deadline
                                </label>
                                <div className="mt-2 cursor-pointer" onClick={() => document.getElementById('news-deadline').showPicker()}>
                                    <input
                                        type="date"
                                        name="news-deadline"
                                        id="news-deadline"
                                        required
                                        value={newsFormFields.deadline}
                                        onChange={(e) => setNewsFormFields({ ...newsFormFields, deadline: e.target.value })}
                                        className="block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="news-image" className="block text-sm font-medium leading-6 text-gray-900">
                                    News Image
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="file"
                                        name="news-image"
                                        id="news-image"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="col-span-2 sm:col-span-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-medium font-mono"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="news-level" className="block text-sm font-medium leading-6 text-gray-900">
                                    News Level
                                </label>
                                <div className="mt-2">
                                    <select
                                        id="news-level"
                                        name="news-level"
                                        value={newsFormFields.level}
                                        onChange={(e) => setNewsFormFields({ ...newsFormFields, level: e.target.value })}
                                        className="mt-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5 font-medium font-mono"
                                    >
                                        {newsLevel.map((level) => (
                                            <option key={level} value={level}>
                                                {level}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="news-institute" className="block text-sm font-medium leading-6 text-gray-900">
                                    News Publisher Institute
                                </label>
                                <div className="mt-2">
                                    <select
                                        id="news-institute"
                                        name="news-institute"
                                        value={newsFormFields.ownerInstituteId}
                                        onChange={(e) => setNewsFormFields({ ...newsFormFields, ownerInstituteId: e.target.value })}
                                        className="mt-1 block w-full bg-white border-gray-500 rounded-md border-1 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5 font-medium font-mono"
                                    >
                                        {institutions.map((institute) => (
                                            <option key={institute.id} value={institute.id}>
                                                {institute.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="sm:col-span-6">
                                <label htmlFor="news-description" className="block text-sm font-medium leading-6 text-gray-900">
                                    News Detail
                                </label>
                                <div className="mt-2">
                                    <ReactQuill
                                        id="news-description"
                                        value={newsFormFields.description}
                                        onChange={(content) => setNewsFormFields({ ...newsFormFields, description: content })}
                                        theme="snow"
                                        style={{ height: '400px' }} // Adjust the height as needed
                                        modules={{
                                            toolbar: [
                                                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                                [{ 'color': [] }, { 'background': [] }],
                                                [{ 'align': [] }],
                                                ['link', 'image', 'video'],
                                                ['clean']
                                            ]
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                        <button type="button" className="text-sm font-semibold leading-6 text-gray-100" onClick={() => setNewsFormFields({
                            ownerAdminId: '129ewrd-32323-323',
                            ownerInstituteId: '',
                            title: '',
                            description: '',
                            level: '',
                            deadline: '',
                            image: null,
                        })}>
                            Clear
                        </button>
                        <button
                            type="button"
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={handleNewsSaveButtonClick}
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
            <div>
                <ToastContainer />
            </div>
        </div>
    );
}
