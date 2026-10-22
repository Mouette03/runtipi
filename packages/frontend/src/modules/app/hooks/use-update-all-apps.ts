import { updateAllAppsMutation } from '@/api-client/@tanstack/react-query.gen';
import type { TranslatableError } from '@/types/error.types';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

/**
 * Runs the bulk "update all" action and reports the outcome.
 * Apps whose update notices require manual confirmation are never updated by
 * the bulk action; they are reported so the user updates them individually.
 */
export const useUpdateAllApps = (onStart?: () => void) => {
  const { t } = useTranslation();

  return useMutation({
    ...updateAllAppsMutation(),
    onMutate: () => {
      onStart?.();
    },
    onSuccess: (data) => {
      const skippedCount = data?.skippedAppUrns?.length ?? 0;
      const updatedCount = data?.updatedAppIds?.length ?? 0;

      if (skippedCount > 0) {
        toast(t('APP_UPDATE_ALL_SKIPPED_NOTICES', { count: skippedCount }), { icon: '⚠️', duration: 8000 });
      }
      if (updatedCount > 0) {
        toast.loading(t('MY_APPS_UPDATE_ALL_IN_PROGRESS'), { duration: 3000 });
      }
    },
    onError: (e: TranslatableError) => {
      toast.error(t(e.message, e.intlParams));
    },
  });
};
