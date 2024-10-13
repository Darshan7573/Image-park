import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import FileView from './components/FileView';
import ClusterView from './components/ClusterView';
import axios from 'axios';

const categoriesList = [
  'car',
  'person',
  'nature',
  'architecture',
  'animal',
  'fish',
  'bikes',
  'technology',
  'food',
  'sports',
  'fashion',
  'music',
  'travel'
];


const getCategoryById = (id) => {
  return categoriesList[id % categoriesList.length];
};

const App = () => {
  const [images, setImages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState('clusterView');
  const [filters, setFilters] = useState('');

  const fetchRandomImages = async () => {
    try {
      const newImages = Array.from({ length: 20 }, (_, index) => ({
        id: Math.floor(Math.random() * 1000),
        urls: { small: `https://picsum.photos/200/300?random=${index}` },
        categories: [getCategoryById(index)],
      }));
      setImages((prevImages) => [...prevImages, ...newImages]);
      setHasMore(true);
    } catch (error) {
      console.error('Error fetching random images:', error);
      setHasMore(false);
    }
  };

  const fetchImagesByCategory = async (category) => {
    try {
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: { query: category, per_page: 20 },
        headers: {
          Authorization: 'Client-ID WIQ1qjQenNf7-qCadLuYn53CGYWDWBAzOiorSR7mFm4',
        },
      });
      const newImages = response.data.results.map((image) => ({
        id: image.id,
        urls: image.urls,
        categories: [category],
      }));
      setImages((prevImages) => [...prevImages, ...newImages]);
    } catch (error) {
      console.error('Error fetching images by category:', error);
      setHasMore(false);
    }
  };

  const loadMoreImages = () => {
    if (viewMode === 'fileView') {
      fetchRandomImages();
    } else if (viewMode === 'clusterView') {
      categoriesList.forEach((category) => fetchImagesByCategory(category));
    }
  };

  useEffect(() => {
    if (viewMode === 'fileView') {
      setImages([]);
      loadMoreImages();
    } else if (viewMode === 'clusterView') {
      setImages([])
      loadMoreImages();
    }
  }, [viewMode]);

  const filteredImages = images.filter((image) => {
    if (filters.trim() === '') return true;
    return image.categories.some((category) =>
      category.toLowerCase() === filters.trim().toLowerCase()
    );
  });

  const groupedImages = filteredImages.reduce((acc, image) => {
    image.categories.forEach((category) => {
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
          className={`px-4 py-2 ${viewMode === 'fileView' ? 'bg-blue-500 text-white' : 'bg-gray-300'} rounded-md`}
        >
          File View
        </button>
        <button
          onClick={() => setViewMode('clusterView')}
          className={`px-4 py-2 ${viewMode === 'clusterView' ? 'bg-blue-500 text-white' : 'bg-gray-300'} rounded-md`}
        >
          Cluster View
        </button>
      </div>

      {viewMode === "clusterView" ? <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by category (e.g., car, person)"
          className="w-full px-4 py-2 border rounded-md"
          onChange={(e) => setFilters(e.target.value.toLowerCase())}
        />
      </div> : ""}


      {viewMode === 'fileView' ? (
        <InfiniteScroll
          dataLength={images.length}
          next={loadMoreImages}
          hasMore={hasMore}
          loader={<h4>Loading more images...</h4>}
          endMessage={<p>No more images to load.</p>}
        >
          <FileView images={filteredImages} />
        </InfiniteScroll>
      ) : (
        <ClusterView groupedImages={groupedImages} />
      )}
    </div>
  );
};

export default App;
