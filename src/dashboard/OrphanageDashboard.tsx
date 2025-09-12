// FILE: src/components/dashboard/OrphanageDashboard.tsx

'use client';

import { useState, FormEvent } from 'react';
import NeedsManager from '@/components/needs/NeedsManager';
import { OrphanageProfile, Need, Event, Message, User, OrganizationProfile } from '@prisma/client';

type OrphanageProfileWithNeeds = OrphanageProfile & {
  needs: Need[];
};

type EventWithOrganization = Event & {
  organization: {
    name: string;
  };
};

type MessageWithSender = Message & {
  sender: User & {
    organization: {
      name: string;
    } | null;
  };
};

interface OrphanageDashboardProps {
  profile: OrphanageProfileWithNeeds;
  pendingEvents: EventWithOrganization[];
  recentMessages: MessageWithSender[];
}

export default function OrphanageDashboard({
  profile,
  pendingEvents,
  recentMessages
}: OrphanageDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [profileState, setProfile] = useState(profile);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [legalDocumentFile, setLegalDocumentFile] = useState<File | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!profile) return;
        setIsSaving(true);
        setMessage('');

        const updatedProfile = { ...profileState };

        try {
            // Step 1: Upload files if they exist
            if (profileImageFile) {
                const response = await fetch(`/api/upload?filename=${profileImageFile.name}`, {
                    method: 'POST',
                    body: profileImageFile,
                });
                const newBlob = await response.json();
                updatedProfile.profileImageUrl = newBlob.url;
            }
            if (legalDocumentFile) {
                const response = await fetch(`/api/upload?filename=${legalDocumentFile.name}`, {
                    method: 'POST',
                    body: legalDocumentFile,
                });
                const newBlob = await response.json();
                updatedProfile.legalDocumentsUrl = newBlob.url;
            }

            // Step 2: Save the updated profile data (with new URLs) to our database
            const res = await fetch('/api/profile/orphanage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProfile),
            });

            if (!res.ok) throw new Error('Failed to save profile.');
            
            setMessage('Profile updated successfully!');
            setProfile(updatedProfile);

        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'An unexpected error occurred.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
                    <p className="text-orange-600 font-medium">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    if (!profile) return <div>Loading...</div>;

    const tabs = [
        { id: 'profile', label: 'Profile Management', icon: '👤' },
        { id: 'needs', label: 'Needs & Requests', icon: '📋' },
        { id: 'events', label: 'Events & Activities', icon: '🎉' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30">
            {/* Header Section */}
            <div className="bg-white border-b border-orange-100 shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                                Director's Dashboard
                            </h1>
                            <p className="text-gray-600 mt-2">Manage your orphanage profile and activities</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            {profile.profileImageUrl && (
                                <img 
                                    src={profile.profileImageUrl} 
                                    alt="Profile" 
                                    className="w-12 h-12 rounded-full object-cover border-2 border-orange-300 shadow-lg"
                                />
                            )}
                            <div className="text-right">
                                <p className="font-semibold text-gray-800">{profile.name || 'Orphanage'}</p>
                                <p className="text-sm text-gray-500">Administrator</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Tab Navigation */}
                <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden mb-8">
                    <div className="flex border-b border-orange-100">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 px-6 py-4 text-center font-medium transition-all duration-300 ${
                                    activeTab === tab.id
                                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                                        : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                                }`}
                            >
                                <span className="text-lg mr-2">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Profile Management Tab */}
                {activeTab === 'profile' && (
                    <div className="space-y-8">
                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
                            {/* Public Profile Section */}
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
                                <h2 className="text-2xl font-bold text-white flex items-center">
                                    <span className="mr-3">🏠</span>
                                    Public Profile Information
                                </h2>
                                <p className="text-orange-100 mt-2">This information will be visible to donors and visitors</p>
                            </div>

                            <div className="p-8 space-y-6">
                                {/* Orphanage Name */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Orphanage Name *
                                    </label>
                                    <input
                                        name="name"
                                        value={profile.name ?? ''}
                                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                                        placeholder="Enter your orphanage name"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 bg-gray-50/50"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={profile.description ?? ''}
                                        onChange={(e) => setProfile({...profile, description: e.target.value})}
                                        placeholder="Tell potential donors about your orphanage, mission, and the children you care for..."
                                        rows={4}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 bg-gray-50/50 resize-none"
                                        required
                                    />
                                </div>

                                {/* Address and Phone Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Address *
                                        </label>
                                        <input
                                            name="address"
                                            value={profile.address ?? ''}
                                            onChange={(e) => setProfile({...profile, address: e.target.value})}
                                            placeholder="Complete address"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 bg-gray-50/50"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Phone Number
                                        </label>
                                        <input
                                            name="phone"
                                            value={profile.phone ?? ''}
                                            onChange={(e) => setProfile({...profile, phone: e.target.value})}
                                            placeholder="Contact phone number"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300 bg-gray-50/50"
                                        />
                                    </div>
                                </div>

                                {/* Profile Image Upload */}
                                <div className="space-y-4">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Profile Image
                                    </label>
                                    <div className="flex items-center space-x-6">
                                        {profile.profileImageUrl && (
                                            <img 
                                                src={profile.profileImageUrl} 
                                                alt="Current Profile" 
                                                className="w-24 h-24 object-cover rounded-xl border-4 border-orange-200 shadow-lg"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => e.target.files && setProfileImageFile(e.target.files[0])}
                                                className="w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 transition-all duration-300 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Verification Section */}
                            <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-8 py-6">
                                <h2 className="text-2xl font-bold text-white flex items-center">
                                    <span className="mr-3">🔒</span>
                                    Verification Information
                                </h2>
                                <p className="text-gray-200 mt-2">Confidential information used for verification purposes only</p>
                            </div>

                            <div className="p-8 bg-gray-50/30 space-y-6">
                                {/* Director Information Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Director's Full Name *
                                        </label>
                                        <input
                                            name="directorName"
                                            value={profile.directorName ?? ''}
                                            onChange={(e) => setProfile({...profile, directorName: e.target.value})}
                                            placeholder="Full legal name of the director"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Registration Number *
                                        </label>
                                        <input
                                            name="registrationNumber"
                                            value={profile.registrationNumber ?? ''}
                                            onChange={(e) => setProfile({...profile, registrationNumber: e.target.value})}
                                            placeholder="Official registration number"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Legal Document Upload */}
                                <div className="space-y-4">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Legal Registration Document
                                    </label>
                                    <div className="space-y-4">
                                        <input
                                            type="file"
                                            accept=".pdf,.png,.jpg,.jpeg"
                                            onChange={(e) => e.target.files && setLegalDocumentFile(e.target.files[0])}
                                            className="w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-300 cursor-pointer"
                                        />
                                        {profile.legalDocumentsUrl && (
                                            <a 
                                                href={profile.legalDocumentsUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-300 text-sm font-medium"
                                            >
                                                📄 View Current Document
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Action Section */}
                            <div className="px-8 py-6 bg-white border-t border-gray-200 flex items-center justify-between">
                                {message && (
                                    <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                        message.includes('success') 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {message}
                                    </div>
                                )}
                                
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="ml-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-200 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isSaving ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Saving Changes...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <span>💾</span>
                                            <span>Save All Changes</span>
                                        </div>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Needs Manager Tab */}
                {activeTab === 'needs' && (
                    <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <span className="mr-3">📋</span>
                                Needs & Requests Management
                            </h2>
                            <p className="text-orange-100 mt-2">Manage your orphanage's current needs and donation requests</p>
                        </div>
                        <div className="p-8">
                            <NeedsManager
                                needs={profile.needs}
                                onNeedsChange={() => window.location.reload()}
                                editable={true}
                                verificationStatus={profile.verificationStatus}
                            />
                        </div>
                    </div>
                )}

                {/* Events Manager Tab */}
                {activeTab === 'events' && (
                    <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <span className="mr-3">🎉</span>
                                Events & Activities Management
                            </h2>
                            <p className="text-orange-100 mt-2">Create and manage events, activities, and special occasions</p>
                        </div>
                        <div className="p-8">
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🎉</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Event Management</h3>
                                <p className="text-gray-600 mb-4">
                                    Event management features are coming soon! You'll be able to create and manage events, activities, and special occasions.
                                </p>
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                    <p className="text-orange-800 text-sm">
                                        <strong>Coming Soon:</strong> Create events, invite organizations, track attendance, and more!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}