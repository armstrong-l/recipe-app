import {toast} from "react-toastify";

export const displayToast = (message, type="success") => {
    const options = {
        position: "bottom-right",
        autoClose: 2000,
        pauseOnHover: false,
        closeOnClick: true,
    };

    if (type==="success") {
        return toast.success(message, options)
    } else if (type==="error") {
        return toast.error(message, options)
    }

};