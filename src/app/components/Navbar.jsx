import React from 'react';

const Navbar = () => {
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/users/logout', { method: 'GET' });
      if (response.ok) {
        // Clear the token from the client-side as well
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
        window.location.replace('/login'); // Redirect to login page
      } else {
        console.error('Logout failed:', response.statusText);
      }
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4 border-b">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <a href="/" className="text-gray-300 hover:text-white">Home</a>
            <a href="/analytics" className="text-gray-300 hover:text-white">Analyze</a>
            <a href="/bot" className="text-gray-300 hover:text-white">Imaginate</a>

          </div>
          <div className="flex space-x-4">
          <a href="/profile" className="text-gray-300 hover:text-white">Profile</a>
            <button onClick={handleLogout} className="text-gray-300 hover:text-white">Logout</button>
          </div>
          
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
