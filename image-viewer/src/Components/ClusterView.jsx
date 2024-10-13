import React from 'react';
import ImageCard from './ImageCard';

const ClusterView = ({ groupedImages }) => {
    return (
        <div>
            {Object.keys(groupedImages).length === 0 ? (
                <p>No images found for this category.</p>
            ) : (
                Object.keys(groupedImages).map((category) => (
                    <div key={category} className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 capitalize">{category} Category</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {groupedImages[category].map((image) => (
                                <ImageCard key={image.id} image={image} />
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ClusterView;
