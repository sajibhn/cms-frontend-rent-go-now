import { GetServerSideProps } from 'next';
import {
	allowedRoles,
	getAuthCredentials,
	hasAccess,
	isAuthenticated,
} from '@/utils/auth';
import { Routes } from '@/utils/routes';
import CreateOrUpdateForm from '@/components/units/create-or-update-units';
import { ContentLayout } from '@/components/ui/content-layout';

const NeighborhoodCreate = () => {
	return (
		<ContentLayout title='Create Units'>
			<CreateOrUpdateForm />
		</ContentLayout>
	);
};

export default NeighborhoodCreate;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { token, permissions } = getAuthCredentials(ctx);
	if (
		!isAuthenticated({ token, permissions }) ||
		!hasAccess(allowedRoles, permissions)
	) {
		return {
			redirect: {
				destination: Routes.login,
				permanent: false,
			},
		};
	}
	return {
		props: {
			userPermissions: permissions,
		},
	};
};
