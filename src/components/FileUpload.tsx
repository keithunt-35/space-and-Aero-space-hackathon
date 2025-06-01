import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addBook } from '../store/slices/readingSlice';
import { Upload, FileText, AlertCircle } from 'lucide-react';

const FileUpload: React.FC = () => {
  const dispatch = useDispatch();
  const [dragActive, setDragActive] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File): boolean => {
    const validTypes = ['application/pdf', 'application/epub+zip', 'text/plain'];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload PDF, EPUB, or TXT files.');
      return false;
    }

    if (file.size > maxSize) {
      setError('File is too large. Maximum size is 50MB.');
      return false;
    }

    return true;
  };

  const processFile = async (file: File) => {
    if (!validateFile(file)) return;

    try {
      // In a real app, we would upload the file to a server here
      // For now, we'll just create a book entry
      const format = file.type === 'application/pdf' ? 'pdf' : 
                    file.type === 'application/epub+zip' ? 'epub' : 
                    'article';

      dispatch(addBook({
        id: Date.now().toString(),
        title: file.name.replace(/\.[^/.]+$/, ""),
        author: 'Unknown', // This would be extracted from metadata in a real app
        format,
        totalPages: 0, // This would be extracted from the file in a real app
        currentPage: 0,
        isLocal: false,
        language: 'en',
        description: '',
        readingTime: 0,
        bookmarkedPages: [],
        notes: [],
      }));

      setError(null);
    } catch (err) {
      setError('Failed to process file. Please try again.');
      console.error(err);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <form
        className={`relative p-8 border-2 border-dashed rounded-lg text-center ${
          dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept=".pdf,.epub,.txt"
          onChange={handleChange}
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            {error ? (
              <AlertCircle className="w-12 h-12 text-red-500" />
            ) : (
              <Upload className="w-12 h-12 text-primary" />
            )}
          </div>
          
          <div>
            <p className="text-lg font-medium">
              {error || 'Drop your file here, or click to browse'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supports PDF, EPUB, and TXT files up to 50MB
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <FileText className="w-4 h-4 mr-1" />
              <span>PDF</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <FileText className="w-4 h-4 mr-1" />
              <span>EPUB</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <FileText className="w-4 h-4 mr-1" />
              <span>TXT</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FileUpload; 