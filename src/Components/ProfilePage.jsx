import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../assets/navbar.jsx';
import '../Stylings/ProfilePage.css';

function ProfilePage() {
  const navigate = useNavigate();
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

  // Simulate fetching user data (would be replaced with actual API call)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call to fetch user data
        // For now, we'll simulate an authenticated user with admin role for demo
        // You should replace this with actual authentication check
        const currentUser = {
          role: 'admin', // This would come from auth state
          name: 'Admin User',
          email: 'admin@example.com',
          address: '123 Admin Street',
          phone: '123-456-7890'
        };
        
        setUserRole(currentUser.role);
        setUserInfo({
          name: currentUser.name,
          email: currentUser.email,
          address: currentUser.address || '',
          phone: currentUser.phone || ''
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
  }, []);

  // Handle personal info form changes
  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle device form changes
  const handleDeviceFormChange = (e) => {
    const { name, value } = e.target;
    setDeviceForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle admin form changes
  const handleAdminFormChange = (e) => {
    const { name, value } = e.target;
    setAdminForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle personal info update
  const handleUpdateUserInfo = async (e) => {
    e.preventDefault();
    try {
      // In a real app, this would be an API call to update user info
      console.log('Updating user info:', userInfo);
      alert('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating user info:', err);
    }
  };

  // Handle device submission
  const handleAddDevice = async (e) => {
    e.preventDefault();
    try {
      // In a real app, this would be an API call to add a device
      console.log('Adding device:', deviceForm);
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
      alert('Device added successfully!');
    } catch (err) {
      setError('Failed to add device. Please try again.');
      console.error('Error adding device:', err);
    }
  };

  // Handle add admin
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      // In a real app, this would be an API call to add an admin
      console.log('Adding admin:', adminForm.email);
      // Reset form
      setAdminForm({ email: '' });
      alert('Admin added successfully!');
    } catch (err) {
      setError('Failed to add admin. Please try again.');
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
      // In a real app, this would be an API call to logout
      console.log('Logging out user');
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