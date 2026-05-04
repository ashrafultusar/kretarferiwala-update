import React from "react";
import LoadingSpinner from "@/components/LoadingSpiner";

const LoadingPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner />
        </div>
    );
};

export default LoadingPage;
