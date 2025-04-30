import { useMutation } from '@tanstack/react-query';

import { toast } from 'react-toastify';
import { mediaClient } from './client/media';

export function useUploadImageMutation() {
	return useMutation({
		mutationFn: mediaClient.upload,
		onError: () => {
			toast.error('Image upload failed!');
		},
		onSuccess: (data) => {
			toast.success('Image uploaded successfully!');
		},
	});
}

export function useSaveImageMutation() {
	return useMutation({
		mutationFn: mediaClient.save,
		onError: () => {
			toast.error('Saving image to DB failed!');
		},
		onSuccess: () => {
			toast.success('Saved to DB successfully!');
		},
	});
}