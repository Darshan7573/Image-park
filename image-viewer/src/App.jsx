import React, { useState, useEffect } from 'react';
import FileView from './components/FileView';
import ClusterView from './components/ClusterView';


const App = () => {
  const [images, setImages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState('cluster');
  const [filters, setFilters] = useState('');



  const fetchImages = () => {
    const newImages = [];
    const categoriesList = ['car', 'person', 'nature', 'architecture', 'animal'];

    for (let i = 0; i < 20; i++) {
      // Randomly assign 1 or 2 categories from the categoriesList to each image
      const randomCategories = categoriesList
        .filter(() => Math.random() > 0.5)
        .slice(0, 2); // Max 2 categories per image

      // Ensure at least one category is assigned
      if (randomCategories.length === 0) {
        randomCategories.push(categoriesList[Math.floor(Math.random() * categoriesList.length)]);
      }

      newImages.push({
        id: images.length + i + 1,
        url: `https://picsum.photos/300/200?random=${images.length + i + 1}`,
        categories: randomCategories,
      });
    }
    setImages([...images, ...newImages]);
  };


  const loadMoreImages = () => {
    if (images.length >= 10000) {
      setHasMore(false);
      return;
    }
    fetchImages();
  };

  useEffect(() => {
    fetchImages();
  }, []);


  const filteredImages = images.filter(image => {
    if (filters === '') return true;
    return image.categories.some(category => category.includes(filters));
  });


  const groupedImages = filteredImages.reduce((acc, image) => {
    image.categories.forEach(category => {
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(image);
    });
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Image Grid Viewer</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setViewMode('fileView')}
          className={`px-4 py-2 ${viewMode === 'fileView' ? 'bg-blue-500 text-white' : 'bg-gray-300'} rounded-md`}>
          File View
        </button>
        <button
          onClick={() => setViewMode('clusterView')}
          className={`px-4 py-2 ${viewMode === 'clusterView' ? 'bg-blue-500 text-white' : 'bg-gray-300'} rounded-md`}>
          Cluster View
        </button>
      </div>


      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by category (e.g., car, person)"
          className="w-full px-4 py-2 border rounded-md"
          onChange={(e) => setFilters(e.target.value.toLowerCase())}
        />
      </div>

      {viewMode === 'fileView' ? (
        <FileView images={filteredImages} loadMoreImages={loadMoreImages} hasMore={hasMore} />
      ) : (
        <ClusterView groupedImages={groupedImages} />
      )}
    </div>
  );
};

export default App;
