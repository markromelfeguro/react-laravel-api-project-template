import toast from 'react-hot-toast';

export const notify = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  loading: (message: string) => toast.loading(message),
  info: (message: string) => toast(message, { icon: 'ℹ️' }),
  dismiss: () => toast.dismiss(),
  promise: (promise: Promise<any>, messages: { loading: string; success: string; error: string }) => {
    return toast.promise(promise, messages);
  }
};