import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import {
    Box,
    Avatar,
} from '@mui/material';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import { useState } from "react";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            avatar: null,
        });

    const [avatarPreview, setAvatarPreview] = useState(user.avatar ? `/storage/${user.avatar}` : "/default-avatar.png");

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
        let hasChanges = false;

        // Only append fields that have been modified
        if (data.name !== user.name) {
            formData.append('name', data.name);
            hasChanges = true;
        }

        if (data.email !== user.email) {
            formData.append('email', data.email);
            hasChanges = true;
        }

        // Only append avatar if a new file was selected
        if (data.avatar) {
            formData.append('avatar', data.avatar);
            hasChanges = true;
        }

        // Only send the form if at least one field has been modified
        if (hasChanges) {
            // Important: Send the original values for fields that weren't changed
            // This ensures the backend knows which fields to ignore
            if (!formData.has('name')) {
                formData.append('_name_unchanged', 'true');
            }

            if (!formData.has('email')) {
                formData.append('_email_unchanged', 'true');
            }

            if (!data.avatar) {
                formData.append('_avatar_unchanged', 'true');
            }

            post(route('profile.update'), {
                body: formData,
                forceFormData: true, // Ensures file uploads work properly
            });
        } else {
            // If nothing changed, just show a message
            console.log('No changes detected');
        }
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6" encType="multipart/form-data">
                {/* Avatar Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <Box className="relative mx-auto">
                        <Avatar
                            src={avatarPreview}
                            alt="Profile Picture"
                            sx={{ width: 120, height: 120 }}
                        />
                        <InputLabel htmlFor="avatar" className="absolute bottom-0 right-0 cursor-pointer">
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 0.4,
                                color: 'white',
                                backgroundColor: (theme) => theme.palette.primary.main,
                                borderRadius: "50%",
                                border: '2px solid',
                                borderColor: 'white'
                            }}>
                                <CreateRoundedIcon sx={{
                                    fontSize: 24,
                                }} />
                            </Box>

                        </InputLabel>
                        <input
                            type="file"
                            id="avatar"
                            name="avatar" // Add name attribute
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </Box>
                    <InputError className="mt-2" message={errors.avatar} />
                </Box>

                <Box>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </Box>

                <Box>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </Box>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}