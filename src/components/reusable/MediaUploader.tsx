import React, { useState, useEffect } from 'react';
import { useUploadImageMutation } from '@/api/data/media';
import { CloudUpload } from 'lucide-react';

interface ImageItem {
	id: string;
	url: string;
	isUploaded: boolean;
	uploadFailed?: boolean;
	file?: File;
}

interface UploadProgressMap {
	[key: string]: number;
}

interface MediaUploaderProps {
	value: string[];
	onChange: (value: string[]) => void;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({ value, onChange }) => {
	const [images, setImages] = useState<ImageItem[]>([]);
	const [uploadProgress, setUploadProgress] = useState<UploadProgressMap>({});
	const uploadMutation = useUploadImageMutation();

	useEffect(() => {
		const initialImages: ImageItem[] = value.map(url => ({
			id: `existing-${Math.random().toString(36).substring(2, 9)}`,
			url,
			isUploaded: true
		}));
		setImages(initialImages);
	}, [value]);

	useEffect(() => {
		const currentImageUrls = images
			.filter(img => img.isUploaded)
			.map(img => img.url);

		if (JSON.stringify(currentImageUrls) !== JSON.stringify(value)) {
			onChange(currentImageUrls);
		}
	}, [images, onChange, value]);

	const uploadImage = async (fileObj: ImageItem): Promise<unknown> => {
		if (!fileObj.file) return Promise.reject("No file provided");

		return new Promise((resolve, reject) => {
			uploadMutation.mutate(fileObj.file!, {
				onSuccess: (data: { imageUrl: string }) => {
					setImages(currentImages =>
						currentImages.map(img =>
							img.id === fileObj.id
								? { ...img, url: data.imageUrl, isUploaded: true }
								: img
						)
					);
					setUploadProgress(prev => ({ ...prev, [fileObj.id]: 100 }));
					resolve(data);
				},
				onError: (error: Error) => {
					setImages(currentImages =>
						currentImages.map(img =>
							img.id === fileObj.id
								? { ...img, uploadFailed: true }
								: img
						)
					);
					reject(error);
				},
				// @ts-ignore
				onProgress: (progress: number) => {
					setUploadProgress(prev => ({ ...prev, [fileObj.id]: progress }));
				}
			});
		});
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		if (!files.length) return;

		const newImages: ImageItem[] = files.map(file => {
			const id = `file-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
			setUploadProgress(prev => ({ ...prev, [id]: 0 }));

			return {
				id,
				file,
				url: URL.createObjectURL(file),
				isUploaded: false
			};
		});

		setImages(prev => [...prev, ...newImages]);

		if (e.target) e.target.value = '';

		for (const image of newImages) {
			try {
				await uploadImage(image);
			} catch (error) {
				console.error("Upload failed:", error);
			}
		}
	};

	const handleRemoveImage = (index: number) => {
		setImages(prev => prev.filter((_, i) => i !== index));
	};

	return (
		<div className="max-w-lg mx-auto p-6 bg-white rounded border border-dashed hover:border-brand">
			<div className="mb-4">
				<div className="p-4 rounded text-center">
					<input
						type="file"
						onChange={handleFileChange}
						accept="image/*"
						multiple
						className="hidden"
						id="file-upload"
					/>
					<label
						htmlFor="file-upload"
						className="cursor-pointer bg-brand hover:bg-brandAlt text-white py-2 px-4 rounded inline-block"
					>
						<CloudUpload />
					</label>
					<p className="mt-2 text-sm text-gray-500">
						Click to browse or drag and drop
					</p>
				</div>
			</div>

			{images.length > 0 && (
				<div className="mb-4">
					<h3 className="font-medium mb-2">
						Gallery ({images.filter(img => img.isUploaded).length}/{images.length})
					</h3>
					<div className="grid grid-cols-2 gap-4">
						{images.map((image, index) => (
							<div key={image.id} className="relative border rounded p-1">
								<img
									src={image.url}
									alt={`Preview ${index + 1}`}
									className="w-full h-32 object-cover"
								/>
								<button
									type="button"
									onClick={() => handleRemoveImage(index)}
									className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
								>
									✕
								</button>

								{!image.isUploaded && !image.uploadFailed && (
									<div className="absolute bottom-0 left-0 right-0 bg-gray-100 h-2">
										<div
											className="bg-green-500 h-full transition-all duration-300"
											style={{ width: `${uploadProgress[image.id] || 0}%` }}
										/>
									</div>
								)}

								<div className="absolute bottom-0 right-0 p-1">
									{image.isUploaded ? (
										<span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
											Uploaded
										</span>
									) : image.uploadFailed ? (
										<span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
											Failed
										</span>
									) : (
										<span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
											Uploading
										</span>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};