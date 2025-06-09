const subtractDates = (dateStr1, dateStr2) => {
    // Convert the formatted strings into Date objects
    const date1 = new Date(dateStr1);
    const date2 = new Date(dateStr2);

    // Calculate the difference in milliseconds
    const diffInMilliseconds = date1 - date2;

    // Convert milliseconds to days
    const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
    const days = Math.ceil(diffInDays)

    return days

    // return {
    //     milliseconds: diffInMilliseconds,
    //     days: Math.floor(diffInDays) // Round down to the nearest whole day
    // };
};

export default subtractDates