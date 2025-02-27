import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from "react";
import {
    Box,
    Avatar,
} from '@mui/material';
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        avatar: null, // Ensure avatar is part of form data
    });

    const [avatarPreview, setAvatarPreview] = useState('/images/default-avatar.png'); // Default avatar

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            setAvatarPreview(URL.createObjectURL(file)); // Show preview
        }
    };

    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('password_confirmation', data.password_confirmation);
        if (data.avatar) {
            formData.append('avatar', data.avatar);
        }

        post(route('register'), {
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' },
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit} encType="multipart/form-data">
                {/* Avatar Upload Section (Moved Above Name Input) */}
                <Box className="relative w-24 h-24 mx-auto">
                    <Avatar
                        src={avatarPreview}
                        alt="Profile Picture"
                        sx={{ width: 100, height: 100}}
                    />
                    <InputLabel htmlFor="avatar" className="absolute bottom-0 right-0 cursor-pointer">
                        <AddCircleIcon sx={{ color: (theme) => theme.palette.primary.main, backgroundColor: "white", borderRadius: "50%" }}/>
                    </InputLabel>
                    <input
                        type="file"
                        id="avatar"
                        name="avatar"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <InputError className="mt-2" message={errors.avatar} />
                </Box>

                <Box sx={{ pt: 1 }}>
                    <InputLabel htmlFor="name" value="Name" />
                    <Box sx={{ py: 0.5 }}>
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </Box>
                </Box>

                <Box className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />
                    <Box sx={{ py: 0.5 }}>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </Box>
                </Box>

                <Box className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />
                    <Box sx={{ py: 0.5 }}>
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </Box>
                </Box>

                <Box className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                    <Box sx={{ py: 0.5 }}>
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </Box>
                </Box>

                <Box className="mt-4 flex items-center justify-end gap-4">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </Box>
            </form>
        </GuestLayout>
    );
}
