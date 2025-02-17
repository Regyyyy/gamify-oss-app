import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';

export default function QuestBoard() {
    return (
        <MainLayout
        >
            <Head title="QuestBoard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            Beginner Quests
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
