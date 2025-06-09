const formattedDate = (dateStr) => {
  if(dateStr){
    const fixedString = `${dateStr?.slice(0, 10)}`;
    const dateObject = new Date(fixedString);

    const day = String(dateObject.getDate()).padStart(2, "0");
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const year = dateObject.getFullYear();
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }
  };

  export default formattedDate