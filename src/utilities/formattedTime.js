const formattedTime = (dateStr) => {
    const dateObject = new Date(dateStr);
    const options = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };

    const formattedTime = dateObject?.toLocaleString("en-US", options);
    return formattedTime;
  };

  export default formattedTime