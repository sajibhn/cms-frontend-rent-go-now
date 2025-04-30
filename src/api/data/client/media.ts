import { HttpClient } from '../http-client';

export const mediaClient = {
	upload: (file: File) => {
		const formData = new FormData();
		formData.append('file', file);
		return HttpClient.post<{ imageUrl: string }>('/media/upload-to-cloudinary', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	},

	save: (variables: { type: string; typeId: string; imageUrl: string }) => {
		return HttpClient.post('/media/save-url', variables);
	},
};
