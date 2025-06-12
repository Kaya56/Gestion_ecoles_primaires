import React from "react";

// Loading component 
const Loading: React.FC = () => (
    <div style={{ textAlign: "center", padding: "2rem" }}>
        <div className="spinner" style={{
            width: "40px",
            height: "40px",
            border: "4px solid #ccc",
            borderTop: "4px solid #007bff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 1rem"
        }} />
        <div>Chargement...</div>
        <style>
            {`
                @keyframes spin {
                    0% { transform: rotate(0deg);}
                    100% { transform: rotate(360deg);}
                }
            `}
        </style>
    </div>
);

export default Loading;