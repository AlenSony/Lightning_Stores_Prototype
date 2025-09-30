import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../assets/navbar.jsx';
import { useToast } from '../assets/Toast.jsx';
import '../Stylings/ProfilePage.css';

function ProfilePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [userRole, setUserRole] = useState('user'); // Default to user
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // User profile state
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  });

  // Admin device form state
  const [deviceForm, setDeviceForm] = useState({
    name: '',
    company: '',
    price: '',
    description: '',
    ram: '',
    storage: '',
    image: ''
  });

  // Add admin form state
  const [adminForm, setAdminForm] = useState({
    email: ''
  });

  // Fetch actual user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        // Make API call to fetch current user data
        const response = await fetch('http://localhost:5000/api/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            // Not authenticated, redirect to login
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        setUserRole(data.role || 'user');
        setUserInfo({
          name: data.name || '',
          email: data.email || '',
          address: data.address || '',
          phone: data.phone || ''
        });
        
        setError('');
      } catch (err) {
        setError('Failed to load user data. Please try again.');
        console.error('Error fetching user data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
    }, [navigate]);

  // Handle personal info form changes
  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    const cleanedValue = value.trim();
    setUserInfo(prev => ({
      ...prev,
      [name]: cleanedValue
    }));
  };

  // Handle device form changes
  const handleDeviceFormChange = (e) => {
    const { name, value } = e.target;
    const cleanedValue = value.trim();
    setDeviceForm(prev => ({
      ...prev,
      [name]: cleanedValue
    }));
  };

  // Handle admin form changes
  const handleAdminFormChange = (e) => {
    const { name, value } = e.target;
    const cleanedValue = value.trim();
    setAdminForm(prev => ({
      ...prev,
      [name]: cleanedValue
    }));
  };

  // Handle personal info update
  const handleUpdateUserInfo = async (e) => {
    e.preventDefault();
    try {
      // Check if token cookie is available
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      console.log('Token available:', !!token);
      console.log('Token length:', token ? token.length : 0);
      
      // Create a clean object with only allowed fields to prevent issues
      const profileData = {
        name: userInfo.name || '',
        email: userInfo.email || '',
        address: userInfo.address || '',
        phone: userInfo.phone || ''
      };
      
      console.log('Sending profile update with filtered data:', profileData);
      
      // Stringify the data explicitly to ensure proper JSON formatting
      let requestBody;
      try {
        requestBody = JSON.stringify(profileData);
        console.log('Request body JSON:', requestBody);
      } catch (jsonError) {
        console.error('Error stringifying data:', jsonError);
        throw new Error('Failed to prepare data for update');
      }
      
      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: requestBody
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        // Try to get error details from server
        const errorText = await response.text();
        console.log('Raw error response:', errorText);
        let errorData = {};
        try {
          errorData = JSON.parse(errorText);
        } catch (jsonError) {
          console.log('Error parsing JSON response:', jsonError);
        }
        throw new Error(errorData.message || errorData.error || errorText.substring(0, 100) || 'Failed to update profile');
      }
      
      // Verify we can parse the success response
      const data = await response.json();
      console.log('Update successful data:', data);
      showToast('Profile updated successfully!', 'success');
      
      // Refresh the user data to show the updated information
      //fetchUserData();
    } catch (err) {
      setError("");
    }
  };

  // Handle device submission
  const handleAddDevice = async (e) => {
    e.preventDefault();
    try {
      // Convert form data to match the server's expected format
      const deviceData = {
        name: deviceForm.name,
        company: deviceForm.company,
        description: deviceForm.description,
        ram: deviceForm.ram,
        storage: deviceForm.storage,
        expected_price: parseFloat(deviceForm.price),
        actual_price: parseFloat(deviceForm.price),
        stock: 100, // Default stock value
        category: 'smartphone', // Default category
        image_url: deviceForm.image
      };
      
      const response = await fetch('http://localhost:5000/api/admin/product', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(deviceData)
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Admin access required');
        }
        throw new Error('Failed to add device');
      }
      
      const data = await response.json();
      // Reset form
      setDeviceForm({
        name: '',
        company: '',
        price: '',
        description: '',
        ram: '',
        storage: '',
        image: ''
      });
      showToast('Device added successfully!', 'success');
    } catch (err) {
      setError(err.message || 'Failed to add device. Please try again.');
      console.error('Error adding device:', err);
    }
  };

  // Handle add admin
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/set-admin', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adminForm)
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Admin access required');
        } else if (response.status === 404) {
          throw new Error('User not found');
        }
        throw new Error('Failed to add admin');
      }
      
      const data = await response.json();
      // Reset form
      setAdminForm({ email: '' });
      showToast('Admin added successfully!', 'success');
    } catch (err) {
      setError(err.message || 'Failed to add admin. Please try again.');
      console.error('Error adding admin:', err);
    }
  };

  // Handle get current location
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, you might want to convert lat/long to an address
          // using a geocoding API
          setUserInfo(prev => ({
            ...prev,
            address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
          }));
        },
        (error) => {
          setError('Failed to get current location. Please allow location access.');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to logout');
      }
      
      navigate('/');
    } catch (err) {
      setError('Failed to logout. Please try again.');
      console.error('Error logging out:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="profile-loading">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      <NavBar />
      <div className="profile-content">
        <header className="profile-header">
          <h1>User Profile</h1>
          <p className="profile-role">Role: {userRole}</p>
        </header>

        {error && (
          <div className="profile-error">
            {error}
          </div>
        )}

        {/* Common section for all users - Personal Information */}
        <section className="personal-info-section">
          <h2>Personal Information</h2>
          <form onSubmit={handleUpdateUserInfo} className="user-info-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={userInfo.name}
                onChange={handleUserInfoChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={userInfo.email}
                onChange={handleUserInfoChange}
                required
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <div className="address-input-group">
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={userInfo.address}
                  onChange={handleUserInfoChange}
                  placeholder="Enter your address"
                />
                <button 
                  type="button" 
                  className="location-button"
                  onClick={handleGetCurrentLocation}
                >
                  Use Current Location
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={userInfo.phone}
                onChange={handleUserInfoChange}
                placeholder="Enter your phone number"
              />
            </div>

            <button type="submit" className="update-button">
              Update Profile
            </button>
          </form>
        </section>

        {/* Admin-only sections */}
        {userRole === 'admin' && (
          <>
            <section className="device-management-section">
              <h2>Device Management</h2>
              <form onSubmit={handleAddDevice} className="device-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="device-name">Device Name</label>
                    <input
                      type="text"
                      id="device-name"
                      name="name"
                      value={deviceForm.name}
                      onChange={handleDeviceFormChange}
                      required
                      placeholder="e.g. iPhone 17"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="device-company">Company</label>
                    <input
                      type="text"
                      id="device-company"
                      name="company"
                      value={deviceForm.company}
                      onChange={handleDeviceFormChange}
                      required
                      placeholder="e.g. Apple"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="device-price">Price</label>
                    <input
                      type="number"
                      id="device-price"
                      name="price"
                      value={deviceForm.price}
                      onChange={handleDeviceFormChange}
                      required
                      step="0.01"
                      min="0"
                      placeholder="999.99"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="device-ram">RAM</label>
                    <input
                      type="text"
                      id="device-ram"
                      name="ram"
                      value={deviceForm.ram}
                      onChange={handleDeviceFormChange}
                      required
                      placeholder="e.g. 8GB"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="device-storage">Storage</label>
                    <input
                      type="text"
                      id="device-storage"
                      name="storage"
                      value={deviceForm.storage}
                      onChange={handleDeviceFormChange}
                      required
                      placeholder="e.g. 256GB"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="device-description">Description</label>
                  <textarea
                    id="device-description"
                    name="description"
                    value={deviceForm.description}
                    onChange={handleDeviceFormChange}
                    required
                    rows="3"
                    placeholder="Enter device description"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="device-image">Image URL</label>
                  <input
                    type="url"
                    id="device-image"
                    name="image"
                    value={deviceForm.image}
                    onChange={handleDeviceFormChange}
                    placeholder="Enter image URL"
                  />
                </div>

                <button type="submit" className="add-device-button">
                  Add Device
                </button>
              </form>
            </section>

            <section className="admin-management-section">
              <h2>Admin Management</h2>
              <form onSubmit={handleAddAdmin} className="admin-form">
                <div className="form-group">
                  <label htmlFor="admin-email">User Email</label>
                  <input
                    type="email"
                    id="admin-email"
                    name="email"
                    value={adminForm.email}
                    onChange={handleAdminFormChange}
                    required
                    placeholder="Enter email of user to make admin"
                  />
                </div>

                <button type="submit" className="add-admin-button">
                  Add as Admin
                </button>
              </form>
            </section>
          </>
        )}

        {/* Logout button */}
        <div className="logout-section">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;