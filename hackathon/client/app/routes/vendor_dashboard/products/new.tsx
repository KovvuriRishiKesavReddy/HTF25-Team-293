import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import {
  TextField,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { AddPhotoAlternate, Clear, CloudUpload, Visibility, Delete } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@mui/material';

// Interface for image previews
interface ImagePreview {
  file: File;
  url: string;
  id: string;
}

export default function AddNewProduct() {
  const navigate = useNavigate();
  const vendor = useSelector((state) => state.reducer.vendor);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState<number | ''>('');
  const [dimensions, setDimensions] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);

  // UI State
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isDragging, setIsDragging] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  useEffect(() => {
    if (vendor?.shopCategory) {
      setCategory(vendor.shopCategory);
    }
  }, [vendor]);

  // Image Handling (same as before)
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const currentImageCount = imagePreviews.length;
      if (currentImageCount + filesArray.length > 5) {
        toast.error("You can upload a maximum of 5 images.");
        return;
      }

      const newPreviews: ImagePreview[] = [];
      const newImageFiles: File[] = [...images];

      filesArray.forEach(file => {
        if (file.type.startsWith("image/")) {
          const url = URL.createObjectURL(file);
          newPreviews.push({ file, url, id: URL.createObjectURL(file) });
          newImageFiles.push(file);
        } else {
          toast.error(`File ${file.name} is not a valid image.`);
        }
      });

      setImages(newImageFiles);
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const filesArray = Array.from(files);
      const currentImageCount = imagePreviews.length;
      if (currentImageCount + filesArray.length > 5) {
        toast.error("You can upload a maximum of 5 images.");
        return;
      }

      const newPreviews: ImagePreview[] = [];
      const newImageFiles: File[] = [...images];

      filesArray.forEach(file => {
        if (file.type.startsWith("image/")) {
          const url = URL.createObjectURL(file);
          newPreviews.push({ file, url, id: URL.createObjectURL(file) });
          newImageFiles.push(file);
        } else {
          toast.error(`File ${file.name} is not a valid image.`);
        }
      });

      setImages(newImageFiles);
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    URL.revokeObjectURL(imagePreviews[indexToRemove].url);
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const viewPreview = (index: number) => {
    setPreviewIndex(index);
    setIsPreviewOpen(true);
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
    };
  }, [imagePreviews]);

  // Form Validation
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "Product name is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (price === '' || price <= 0) newErrors.price = "Valid price is required.";
    if (stock === '' || stock < 0) newErrors.stock = "Valid stock quantity is required.";
    if (!category) newErrors.category = "Category is required.";
    if (images.length === 0) newErrors.images = "At least one image is required.";
    if (weight === '' || weight <= 0) newErrors.weight = "Valid weight is required.";
    if (!dimensions.trim()) newErrors.dimensions = "Dimensions are required.";
    if (!tags.trim()) newErrors.tags = "Add at least one tag for better search.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submission
// Add this function outside handleSubmit (in component)
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Updated handleSubmit (replace entire function)
const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  if (!validateForm()) {
    toast.error("Please fix the errors in the form.");
    return;
  }
  if (!vendor?._id) {
    toast.error("Vendor information not found. Please log in again.");
    return;
  }

  setLoading(true);

  try {
    // Convert images to base64 array
    let imageBase64s = [];
    for (let i = 0; i < images.length; i++) {
      const base64 = await convertToBase64(images[i]);
      imageBase64s.push(base64);
    }

    const payload = {
      name,
      description,
      weight: String(weight),
      dimensions,
      price: String(price),
      stock: String(stock),
      category,
      tags,
      vendorId: vendor._id,
      images: imageBase64s, // Array of full base64 strings (data:image...)
    };

    console.log('Sending payload keys:', Object.keys(payload)); // Debug

    const response = await axios.post(`http://localhost:5000/api/products/create`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    toast.success("Product added successfully!");
    setName('');
    setDescription('');
    setWeight('');
    setDimensions('');
    setPrice('');
    setStock('');
    setCategory('');
    setTags('');
    setImages([]);
    setImagePreviews([]);
    setErrors({});
    navigate('/vendor_dashboard/products');
  } catch (err: any) {
    console.error("Error adding product:", err);
    toast.error(err.response?.data?.message || "Failed to add product.");
  } finally {
    setLoading(false);
  }
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-6"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <Typography variant="h3" sx={{ fontWeight: 800, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
              Add New Product
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', mt: 1 }}>
              Fill in the details below to list your new product. Include weight/dimensions for shipping, and tags for search optimization.
            </Typography>
          </motion.div>

          {/* Form Card */}
          <Paper
            component={motion.div}
            variants={itemVariants}
            elevation={0}
            sx={{ p: { xs: 3, sm: 4 }, borderRadius: '20px', background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', border: '1px solid #e2e8f0' }}
          >
            <Box component="form" onSubmit={handleSubmit} noValidate>
              {/* Basic Info */}
              <Box sx={{ display: 'grid', gap: 3, mb: 3 }}>
                <TextField
                  fullWidth
                  label="Product Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name || "Enter a catchy name for your product"}
                  InputProps={{
                    startAdornment: <AddPhotoAlternate sx={{ color: '#9ca3af', mr: 1 }} />,
                  }}
                />
                <TextField
                  fullWidth
                  label="Product Description *"
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  error={!!errors.description}
                  helperText={errors.description || "Detailed description to attract buyers (up to 500 chars)"}
                />
              </Box>

              {/* Pricing & Inventory */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 3 }}>
                <FormControl fullWidth error={!!errors.price}>
                  <InputLabel>Price (₹)*</InputLabel>
                  <OutlinedInput
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                    label="Price"
                    inputProps={{ min: "0.01", step: "0.01" }}
                  />
                  {errors.price && <Typography variant="caption" color="error">{errors.price}</Typography>}
                </FormControl>
                <FormControl fullWidth error={!!errors.stock}>
                  <InputLabel>Stock Quantity *</InputLabel>
                  <OutlinedInput
                    value={stock}
                    onChange={(e) => setStock(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                    label="Stock Quantity"
                    inputProps={{ min: "0", step: "1" }}
                    endAdornment={<InputAdornment position="end">units</InputAdornment>}
                  />
                  {errors.stock && <Typography variant="caption" color="error">{errors.stock}</Typography>}
                </FormControl>
              </Box>

              {/* Shipping & Category */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 3 }}>
                <FormControl fullWidth error={!!errors.weight}>
                  <InputLabel>Weight (grams) *</InputLabel>
                  <OutlinedInput
                    value={weight}
                    onChange={(e) => setWeight(e.target.value === '' ? '' : parseFloat(e.target.value))}
                    label="Weight (grams)"
                    inputProps={{ min: "0", step: "0.1" }}
                    endAdornment={<InputAdornment position="end">g</InputAdornment>}
                  />
                  {errors.weight && <Typography variant="caption" color="error">{errors.weight}</Typography>}
                </FormControl>
                <FormControl fullWidth error={!!errors.dimensions}>
                  <InputLabel>Dimensions *</InputLabel>
                  <OutlinedInput
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    label="Dimensions"
                    placeholder="e.g., 10x5x2 cm"
                  />
                  {errors.dimensions && <Typography variant="caption" color="error">{errors.dimensions}</Typography>}
                </FormControl>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 3 }}>
                <FormControl fullWidth error={!!errors.category}>
                  <InputLabel>Category *</InputLabel>
                  <Select value={category} onChange={(e) => setCategory(e.target.value as string)} label="Category">
                    <MenuItem value="electronics">Electronics</MenuItem>
                    <MenuItem value="clothing">Clothing & Fashion</MenuItem>
                    <MenuItem value="grocery">Grocery</MenuItem>
                    <MenuItem value="home">Home & Kitchen</MenuItem>
                    <MenuItem value="beauty">Beauty & Health</MenuItem>
                    <MenuItem value={vendor?.shopCategory || 'other'}>
                      {vendor?.shopCategory ? `${vendor.shopCategory} (Default)` : 'Other'}
                    </MenuItem>
                  </Select>
                  {errors.category && <Typography variant="caption" color="error">{errors.category}</Typography>}
                </FormControl>
                <FormControl fullWidth error={!!errors.tags}>
                  <InputLabel>Tags (comma-separated) *</InputLabel>
                  <OutlinedInput
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    label="Tags (comma-separated)"
                    placeholder="e.g., new, sale, organic"
                  />
                  {errors.tags && <Typography variant="caption" color="error">{errors.tags}</Typography>}
                </FormControl>
              </Box>

              {/* Image Uploader */}
              <motion.div variants={itemVariants} sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
                  Product Images (Max 5, Recommended: High-res, 800x800px)
                </Typography>
                {errors.images && <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>{errors.images}</Typography>}
                <motion.div
                  className={`rounded-2xl p-6 text-center border-2 border-dashed transition-all duration-300 ${
                    isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <CloudUpload sx={{ fontSize: 48, color: isDragging ? '#6366f1' : '#9ca3af', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#374151' }}>
                    Drop your images here
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
                    or click to browse (JPG, PNG, up to 5MB each, <strong>first image is primary</strong>)
                  </Typography>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    multiple
                    hidden
                  />
                  <motion.button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imagePreviews.length >= 5}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-6 py-2 rounded-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Choose Images
                  </motion.button>
                  {imagePreviews.length > 0 && (
                    <Typography variant="body2" sx={{ mt: 2, color: '#059669', fontWeight: 500 }}>
                      {imagePreviews.length} / 5 images selected
                    </Typography>
                  )}
                </motion.div>

                {/* Image Previews Grid */}
                <AnimatePresence>
                  {imagePreviews.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4"
                    >
                      {imagePreviews.map((preview, index) => (
                        <motion.div
                          key={preview.id}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="relative group"
                        >
                          <img
                            src={preview.url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <motion.div
                            className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => viewPreview(index)}
                              sx={{ color: 'white', background: 'rgba(255,255,255,0.2)' }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </motion.div>
                          <IconButton
                            size="small"
                            onClick={() => removeImage(index)}
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              background: '#ef4444',
                              color: 'white',
                              width: 32,
                              height: 32,
                              '&:hover': { background: '#dc2626' },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants} className="mt-4">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                      Adding Product...
                    </>
                  ) : (
                    <>
                      <AddPhotoAlternate />
                      Add Product
                    </>
                  )}
                </motion.button>
              </motion.div>
            </Box>
          </Paper>
        </motion.div>

        {/* Preview Dialog */}
        <Dialog open={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} maxWidth="md" fullWidth>
          <DialogContent sx={{ p: 0 }}>
            <img
              src={imagePreviews[previewIndex]?.url || ''}
              alt="Preview"
              className="w-full h-auto max-h-[70vh] object-contain"
            />
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
}

