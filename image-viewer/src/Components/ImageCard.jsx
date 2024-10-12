import React from 'react';

const ImageCard = ({ image }) => {
    return (
        <div className="border rounded-md overflow-hidden bg-white shadow-md">
            <img
                src={image.url}
                alt={`Image ${image.id}`}
                className="w-full h-48 object-cover"
            />
            <div className="p-2 text-sm">
                Categories: {image.categories.join(', ')}
            </div>
        </div>
    );
};

export default ImageCard;
