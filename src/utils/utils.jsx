

export const truncateDescription = (description, maxLength = 50, removeEmbadedHtml = true) => {
    let truncatedDescription = removeHtmlTags(description);
	if (truncatedDescription.length > maxLength) {
	  return truncatedDescription.substring(0, maxLength) + '...';
	}
	return truncatedDescription;
}

const removeHtmlTags = (str) => {
    return str.replace(/<[^>]*>/g, '');
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};


export const handleContactInfo = (contactInfo) => {
    const dataArray = contactInfo.split(", ");

    for (let i = 0; i < dataArray.length; i++) {
        const [key, value] = dataArray[i].split(":");
        const trimmedValue = value.trim();

        if (trimmedValue !== "" && trimmedValue !== null && trimmedValue !== undefined) {
            return trimmedValue;
        }
    }

    return null;
}


export const parseContactInfo = (institutes) => {
    return institutes.map(institute => {
        const contactInfoString = institute.contact_info;
        const contactInfoArray = contactInfoString.split(', ');
        const contactObj = {};
        contactInfoArray.forEach(pair => {
            const [key, value] = pair.split(':');
            contactObj[key.trim()] = value.trim();
        });
        return { ...institute, contact_obj: contactObj };
    });
}


export const formatInputDate = (date) => {
    const dateObject = new Date(date);
    const year = dateObject.getUTCFullYear();
    const month = String(dateObject.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getUTCDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}

export const convertDate = (dateString) => {
    const date = new Date(dateString);
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
  
    const day = date.getDate();
    const daySuffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
      }
    };
  
    return formattedDate.replace(/\d+/, day + daySuffix(day));
  };

export const DateFormat = (date_string) => {
    const isoDate = date_string;
    const date = new Date(isoDate);

    const day = date.getUTCDate();
    const year = date.getUTCFullYear();

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getUTCMonth()];

    const formattedDate = `${month} ${day}, ${year}`;
    return formattedDate;
}