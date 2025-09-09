'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ProfilePictureUpload from '@/components/profile/ProfilePictureUpload';
import {
  validatePhoneNumber,
  validateName,
  validateOrganizationName,
  validateAddress,
  validateDescription,
  validateRegistrationNumber,
  formatPhoneNumber,
  ValidationResult
} from '@/lib/validation';

const VISIT_PURPOSES = [
  'DONATION',
  'TEACHING',
  'WORKSHOP',
  'ONLINE_CLASS',
  'VOLUNTEERING'
];

export default function SetupProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Orphanage fields
  const [orphanageName, setOrphanageName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [directorName, setDirectorName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [isGeocodingAddress, setIsGeocodingAddress] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState('');

  // Organization fields
  const [organizationName, setOrganizationName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [orgPhone, setOrgPhone] = useState('');
  const [orgDescription, setOrgDescription] = useState('');
  const [orgAddress, setOrgAddress] = useState('');
  const [orgRegistrationNumber, setOrgRegistrationNumber] = useState('');
  const [orgProfileImageUrl, setOrgProfileImageUrl] = useState('');
  const [purposes, setPurposes] = useState<string[]>([]);

  // Validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
  }, [session, status, router]);

  // Validation helper
  const validateField = (fieldName: string, value: string, validator: (value: string) => ValidationResult) => {
    const result = validator(value);
    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: result.isValid ? '' : (result.error || 'Invalid input')
    }));
    return result.isValid;
  };

  // Handle phone number input with formatting
  const handlePhoneChange = (value: string, setter: (value: string) => void, fieldName: string) => {
    setter(value);
    validateField(fieldName, value, validatePhoneNumber);
  };

  // Geocoding function
  const geocodeAddress = async (address: string) => {
    if (!address.trim()) return null;

    setIsGeocodingAddress(true);
    try {
      // Using a free geocoding service (Nominatim)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        return { lat: parseFloat(lat), lng: parseFloat(lon) };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    } finally {
      setIsGeocodingAddress(false);
    }
  };

  // Handle address change with geocoding
  const handleAddressChange = async (newAddress: string) => {
    setAddress(newAddress);

    // Debounce geocoding
    if (newAddress.trim().length > 10) {
      const coords = await geocodeAddress(newAddress);
      setCoordinates(coords);
    }
  };

  const handlePurposeToggle = (purpose: string) => {
    setPurposes(prev => 
      prev.includes(purpose) 
        ? prev.filter(p => p !== purpose)
        : [...prev, purpose]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});
    setIsLoading(true);

    // Validate all fields
    let hasErrors = false;
    const errors: Record<string, string> = {};

    if (session?.user.role === 'ORPHANAGE') {
      // Validate orphanage fields
      const nameValidation = validateOrganizationName(orphanageName);
      if (!nameValidation.isValid) {
        errors.orphanageName = nameValidation.error || 'Invalid name';
        hasErrors = true;
      }

      const descValidation = validateDescription(description);
      if (!descValidation.isValid) {
        errors.description = descValidation.error || 'Invalid description';
        hasErrors = true;
      }

      const addressValidation = validateAddress(address);
      if (!addressValidation.isValid) {
        errors.address = addressValidation.error || 'Invalid address';
        hasErrors = true;
      }

      const phoneValidation = validatePhoneNumber(phone);
      if (!phoneValidation.isValid) {
        errors.phone = phoneValidation.error || 'Invalid phone number';
        hasErrors = true;
      }

      const directorValidation = validateName(directorName, 'Director name');
      if (directorName && !directorValidation.isValid) {
        errors.directorName = directorValidation.error || 'Invalid director name';
        hasErrors = true;
      }

      const regValidation = validateRegistrationNumber(registrationNumber);
      if (!regValidation.isValid) {
        errors.registrationNumber = regValidation.error || 'Invalid registration number';
        hasErrors = true;
      }
    } else {
      // Validate organization fields
      const nameValidation = validateOrganizationName(organizationName);
      if (!nameValidation.isValid) {
        errors.organizationName = nameValidation.error || 'Invalid name';
        hasErrors = true;
      }

      const contactValidation = validateName(contactPerson, 'Contact person');
      if (contactPerson && !contactValidation.isValid) {
        errors.contactPerson = contactValidation.error || 'Invalid contact person';
        hasErrors = true;
      }

      const phoneValidation = validatePhoneNumber(orgPhone);
      if (!phoneValidation.isValid) {
        errors.orgPhone = phoneValidation.error || 'Invalid phone number';
        hasErrors = true;
      }

      const descValidation = validateDescription(orgDescription);
      if (orgDescription && !descValidation.isValid) {
        errors.orgDescription = descValidation.error || 'Invalid description';
        hasErrors = true;
      }

      const addressValidation = validateAddress(orgAddress);
      if (orgAddress && !addressValidation.isValid) {
        errors.orgAddress = addressValidation.error || 'Invalid address';
        hasErrors = true;
      }

      if (purposes.length === 0) {
        errors.purposes = 'Please select at least one purpose';
        hasErrors = true;
      }
    }

    if (hasErrors) {
      setValidationErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const profileData = session?.user.role === 'ORPHANAGE'
        ? {
            name: orphanageName.trim(),
            description: description.trim(),
            address: address.trim(),
            phone: phone.trim(),
            directorName: directorName.trim(),
            registrationNumber: registrationNumber.trim(),
            latitude: coordinates?.lat || null,
            longitude: coordinates?.lng || null,
            profileImageUrl: profileImageUrl || null,
          }
        : {
            name: organizationName.trim(),
            contactPerson: contactPerson.trim(),
            phone: orgPhone.trim(),
            description: orgDescription.trim(),
            address: orgAddress.trim(),
            registrationNumber: orgRegistrationNumber.trim(),
            profileImageUrl: orgProfileImageUrl || null,
            purposes,
          };

      const res = await fetch('/api/profile/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (res.ok) {
        // Redirect to appropriate dashboard
        const dashboardPath = session?.user.role === 'ORPHANAGE' 
          ? '/dashboard/orphanage' 
          : '/dashboard/organization';
        router.push(dashboardPath);
      } else {
        const data = await res.json();
        setError(data.message || 'Profile setup failed.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">
              Complete Your Profile
            </h1>
            <p className="text-orange-100 mt-2">
              {session.user.role === 'ORPHANAGE' 
                ? 'Set up your orphanage profile to start connecting with organizations'
                : 'Set up your organization profile to start helping orphanages'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {session.user.role === 'ORPHANAGE' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Orphanage Name *
                  </label>
                  <input
                    type="text"
                    value={orphanageName}
                    onChange={(e) => {
                      setOrphanageName(e.target.value);
                      validateField('orphanageName', e.target.value, validateOrganizationName);
                    }}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      validationErrors.orphanageName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.orphanageName && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.orphanageName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Profile Picture
                  </label>
                  <ProfilePictureUpload
                    currentImageUrl={profileImageUrl}
                    onImageUpdate={setProfileImageUrl}
                    userRole={session.user.role}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Tell organizations about your orphanage, mission, and the children you care for..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => handleAddressChange(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter full address for location mapping"
                      required
                    />
                    {isGeocodingAddress && (
                      <div className="absolute right-3 top-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
                      </div>
                    )}
                    {coordinates && (
                      <div className="mt-2">
                        <p className="text-xs text-green-600 mb-2">
                          ✓ Location found: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                        </p>
                        <div className="h-32 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center">
                          <div className="text-center text-gray-600">
                            <div className="text-2xl mb-1">📍</div>
                            <div className="text-xs">Location Preview</div>
                            <div className="text-xs font-mono">
                              {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value, setPhone, 'phone')}
                      placeholder="+237 6XX XX XX XX"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {validationErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Format: +237 6XX XX XX XX (mobile) or +237 2XX XX XX XX (landline)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Director Name
                    </label>
                    <input
                      type="text"
                      value={directorName}
                      onChange={(e) => setDirectorName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Official registration or license number"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    value={organizationName}
                    onChange={(e) => {
                      setOrganizationName(e.target.value);
                      validateField('organizationName', e.target.value, validateOrganizationName);
                    }}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      validationErrors.organizationName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.organizationName && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.organizationName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Organization Logo
                  </label>
                  <ProfilePictureUpload
                    currentImageUrl={orgProfileImageUrl}
                    onImageUpdate={setOrgProfileImageUrl}
                    userRole={session.user.role}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Description
                  </label>
                  <textarea
                    value={orgDescription}
                    onChange={(e) => {
                      setOrgDescription(e.target.value);
                      if (e.target.value) validateField('orgDescription', e.target.value, validateDescription);
                    }}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      validationErrors.orgDescription ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describe your organization's mission, activities, and how you help orphanages..."
                  />
                  {validationErrors.orgDescription && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.orgDescription}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Address
                  </label>
                  <input
                    type="text"
                    value={orgAddress}
                    onChange={(e) => {
                      setOrgAddress(e.target.value);
                      if (e.target.value) validateField('orgAddress', e.target.value, validateAddress);
                    }}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      validationErrors.orgAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Your organization's main address"
                  />
                  {validationErrors.orgAddress && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.orgAddress}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      value={contactPerson}
                      onChange={(e) => {
                        setContactPerson(e.target.value);
                        if (e.target.value) validateField('contactPerson', e.target.value, (value) => validateName(value, 'Contact person'));
                      }}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        validationErrors.contactPerson ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Primary contact person name"
                    />
                    {validationErrors.contactPerson && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.contactPerson}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={orgPhone}
                      onChange={(e) => handlePhoneChange(e.target.value, setOrgPhone, 'orgPhone')}
                      placeholder="+237 6XX XX XX XX"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        validationErrors.orgPhone ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {validationErrors.orgPhone && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.orgPhone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    value={orgRegistrationNumber}
                    onChange={(e) => {
                      setOrgRegistrationNumber(e.target.value);
                      validateField('orgRegistrationNumber', e.target.value, validateRegistrationNumber);
                    }}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      validationErrors.orgRegistrationNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Official registration or license number"
                  />
                  {validationErrors.orgRegistrationNumber && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.orgRegistrationNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Primary Purposes * (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {VISIT_PURPOSES.map((purpose) => (
                      <label
                        key={purpose}
                        className={`flex items-center p-3 border rounded-xl cursor-pointer transition-colors ${
                          purposes.includes(purpose)
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-300 hover:border-orange-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={purposes.includes(purpose)}
                          onChange={() => handlePurposeToggle(purpose)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                          purposes.includes(purpose)
                            ? 'border-orange-500 bg-orange-500'
                            : 'border-gray-300'
                        }`}>
                          {purposes.includes(purpose) && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {purpose.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </label>
                    ))}
                  </div>
                  {validationErrors.purposes && (
                    <p className="text-sm text-red-600 mt-2">{validationErrors.purposes}</p>
                  )}
                </div>
              </>
            )}

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading || (session.user.role === 'ORGANIZATION' && purposes.length === 0)}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 px-6 rounded-xl hover:from-orange-600 hover:to-orange-700 focus:ring-4 focus:ring-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? 'Setting up...' : 'Complete Profile Setup'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
