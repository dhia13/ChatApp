import axios from "axios";

const checkUserLoggedIn = async () => {
  try {
    const response = await axios.put("http://localhost:8000/api/v1/checkAccess", {}, {
      withCredentials: true // Make sure to include this option to send cookies
    });
    // If the response is successful and the user is logged in
    if (response.status === 200 && response.data.isLoggedIn) {
      console.log("User is logged in");
      return true
      // Perform any additional actions here (e.g., update state, redirect user)
    }
  } catch (error) {
    // Handle error
    console.error("Error checking user login:", error);
    return false
    // Perform error handling here (e.g., show error message to the user)
  }
};
export default checkUserLoggedIn