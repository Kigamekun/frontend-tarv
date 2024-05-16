import useSWR from 'swr';
import axios from '../axios';
import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';


import Swal, { SweetAlertResult } from 'sweetalert2';
import { User } from '../interfaces/User';

interface AuthHookOptions {
    middleware?: 'guest' | 'auth' | 'user';
    redirectIfAuthenticated?: string;
}

interface AuthHookReturn {
    user: User | undefined;
    register: (props: any) => Promise<void>;
    login: (props: any) => Promise<void>;
    forgotPassword: (props: { email: string }) => Promise<void>;
    resendEmailVerification: (props: { setStatus: (status: string) => void }) => void;
    logout: () => Promise<void>;
}

export const useAuth = ({ middleware, redirectIfAuthenticated }: AuthHookOptions = {}): AuthHookReturn => {
    const router = useRouter();
    const { data: user, error, mutate } = useSWR<User>(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/me`, () =>
        axios
            .get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/me`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            .then(res => res.data.data)
            .catch(error => {
                if (error.response.status !== 409) throw error;
                router.push('/verify-email');
            }),
        { revalidateOnMount: true }
    );

    const isUser = true;

    const handleRedirect = () => {
        if (isUser) router.push("/home");
    };

    const register = async ({ setErrors, setStatus, ...props }: any) => {
        setErrors([]);
        setStatus(null);

        const loadingSwal = Swal.fire({
            title: 'Loading...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/register`, props).then(function (response) {
                setStatus('success');
                (loadingSwal as any).close();

                router.push('/auth/login');

            }).catch(function (error) {
                console.log('INI ERRORNYA', error)
            });

        } catch (error) {
            console.log('INI ERRORNYA', error)
            if ((error as any).response.status !== 422) throw error;
            Swal.fire({
                icon: 'error',
                title: 'Credential is wrong',
                showConfirmButton: false,
                timer: 1500
            });
            setErrors((error as any).response.data.errors);
        }
    };

    const login = async ({ setErrors, setStatus, ...props }: any) => {
        setErrors([]);
        setStatus(null);

        const loadingSwal = Swal.fire({
            title: 'Loading...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/login`, props).then(function (response) {
                var token = response.data.data;
                localStorage.setItem('token', token);
                console.log('INI TOKENNY', token);
                setStatus('success');
                (loadingSwal as any).close();
                const loggedInUser: User = { token };
                mutate(loggedInUser);
                handleRedirect();

            }).catch(function (error) {
            });

        } catch (error) {
            if ((error as any).response.status !== 422) throw error;
            Swal.fire({
                icon: 'error',
                title: 'Credential is wrong',
                showConfirmButton: false,
                timer: 1500
            });
            setErrors((error as any).response.data.errors);
        }
    };

    const forgotPassword = async ({ setErrors, setStatus, email }: any) => {

        setErrors([]);
        setStatus(null);

        axios
            .post('/forgot-password', { email })
            .then(response => setStatus(response.data.status))
            .catch(error => {
                if (error.response.status !== 422) throw error;

                setErrors(error.response.data.errors);
            });
    };

    const resendEmailVerification = ({ setStatus }: any) => {
        axios.post('/email/verification-notification').then(response => setStatus(response.data.status));
    };

    const logout = async () => {
        localStorage.removeItem('token');
        window.location.pathname = '/auth/login';
    };

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user) {
            handleRedirect();
        }
        if ((middleware === 'auth' || middleware === 'user') && user) {
        }
    }, [user, error])

    return {
        user,
        register,
        login,
        forgotPassword,
        resendEmailVerification,
        logout,
    }
}
