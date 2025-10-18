import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Trash2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { getImages, uploadImage, updateImage, deleteImage } from '../../utils/api';

export default function AdminImages() {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState('');

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const { data } = await getImages();
      setImages(data);
    } catch (error) {
      console.error('Failed to load images:', error);
    }
  };

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('caption', caption);
      formData.append('display_order', images.length);

      await uploadImage(formData);
      setSelectedFile(null);
      setCaption('');
      loadImages();
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleToggleActive = async (image) => {
    try {
      await updateImage(image.id, {
        ...image,
        is_active: !image.is_active
      });
      loadImages();
    } catch (error) {
      console.error('Failed to update image:', error);
      alert('Failed to update image');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await deleteImage(id);
      loadImages();
    } catch (error) {
      console.error('Failed to delete image:', error);
      alert('Failed to delete image');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft size={24} />
              </Link>
              <h1 className="text-2xl font-bold">Manage Slideshow Images</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Upload Form */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Upload New Image</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Image File</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="input-field"
                required
              />
              {selectedFile && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Caption (Optional)</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="input-field"
                placeholder="Our Greatest Adventure Begins!"
              />
            </div>

            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Upload size={18} />
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </form>
        </div>

        {/* Images Grid */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Current Images ({images.length})</h2>

          {images.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No images uploaded yet</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {images.map((image) => (
                <div
                  key={image.id}
                  className={`border rounded-lg overflow-hidden ${
                    !image.is_active ? 'opacity-50' : ''
                  }`}
                >
                  <img
                    src={image.image_url}
                    alt={image.caption || 'Slideshow image'}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="font-medium mb-2">{image.caption || 'No caption'}</p>
                    <p className="text-sm text-gray-600 mb-4">
                      Order: {image.display_order} • {image.is_active ? 'Active' : 'Inactive'}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleActive(image)}
                        className={`btn-secondary py-2 px-4 flex items-center gap-2 flex-1 ${
                          image.is_active ? 'bg-green-50' : 'bg-gray-50'
                        }`}
                      >
                        {image.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                        {image.is_active ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        onClick={() => handleDelete(image.id)}
                        className="btn-secondary py-2 px-4 bg-red-50 text-red-700 hover:bg-red-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
