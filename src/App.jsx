import { useState } from 'react'
import './App.css'

const initialDonations = [
  {
    id: 1,
    type: 'Rice & Meals',
    food: 'Vegetable Rice Packets',
    organization: 'Green Garden Restaurant',
    location: 'Colombo 05',
    quantity: 15,
    contact: '0771234567',
  },
  {
    id: 2,
    type: 'Bakery',
    food: 'Fresh Bread & Buns',
    organization: 'Sunrise Bakery',
    location: 'Dehiwala',
    quantity: 25,
    contact: '0712345678',
  },
  {
    id: 3,
    type: 'Fruits & Vegetables',
    food: 'Fresh Vegetable Boxes',
    organization: 'Community Market',
    location: 'Nugegoda',
    quantity: 8,
    contact: '0763456789',
  },
  {
    id: 4,
    type: 'Rice & Meals',
    food: 'Chicken Rice Packets',
    organization: 'City Food Corner',
    location: 'Rajagiriya',
    quantity: 12,
    contact: '0754567890',
  },
]

function App() {
  // =========================
  // Donation Data
  // =========================

  const [donations, setDonations] = useState(() => {
    const savedDonations = localStorage.getItem('foodshare-donations')

    if (savedDonations) {
      return JSON.parse(savedDonations)
    }

    return initialDonations
  })

  // =========================
  // Search & Filter
  // =========================

  const [searchTerm, setSearchTerm] = useState('')
  const [foodType, setFoodType] = useState('All food types')

  // =========================
  // Form Data
  // =========================

  const [formData, setFormData] = useState({
    organization: '',
    food: '',
    type: '',
    quantity: '',
    location: '',
    contact: '',
  })

  // =========================
  // Form Errors
  // =========================

  const [errors, setErrors] = useState({})

  // =========================
  // Success Message
  // =========================

  const [successMessage, setSuccessMessage] = useState('')

  // =========================
  // Search Filtering
  // =========================

  const filteredDonations = donations.filter((donation) => {
    const search = searchTerm.toLowerCase()

    const matchesSearch =
      donation.food.toLowerCase().includes(search) ||
      donation.organization.toLowerCase().includes(search) ||
      donation.location.toLowerCase().includes(search)

    const matchesType =
      foodType === 'All food types' || donation.type === foodType

    return matchesSearch && matchesType
  })

  // =========================
  // Handle Form Input
  // =========================

  const handleInputChange = (event) => {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))

    // Remove error when user starts correcting the field
    if (errors[name]) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        [name]: '',
      }))
    }

    setSuccessMessage('')
  }

  // =========================
  // Validate Form
  // =========================

  const validateForm = () => {
    const newErrors = {}

    if (!formData.organization.trim()) {
      newErrors.organization = 'Please enter the organization name.'
    }

    if (!formData.food.trim()) {
      newErrors.food = 'Please enter the food name.'
    }

    if (!formData.type) {
      newErrors.type = 'Please select a food type.'
    }

    if (!formData.quantity) {
      newErrors.quantity = 'Please enter the quantity.'
    } else if (
      Number(formData.quantity) <= 0 ||
      !Number.isInteger(Number(formData.quantity))
    ) {
      newErrors.quantity = 'Quantity must be a positive whole number.'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Please enter the location.'
    }

    const phonePattern = /^(?:\+94|0)7\d{8}$/

    if (!formData.contact.trim()) {
      newErrors.contact = 'Please enter a contact number.'
    } else if (!phonePattern.test(formData.contact.trim())) {
      newErrors.contact =
        'Please enter a valid Sri Lankan mobile number, e.g. 0771234567.'
    }

    return newErrors
  }

  // =========================
  // Submit Donation
  // =========================

  const handleSubmit = (event) => {
    event.preventDefault()

    const validationErrors = validateForm()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setSuccessMessage('')
      return
    }

    const newDonation = {
      id: Date.now(),
      organization: formData.organization.trim(),
      food: formData.food.trim(),
      type: formData.type,
      quantity: Number(formData.quantity),
      location: formData.location.trim(),
      contact: formData.contact.trim(),
    }

    const updatedDonations = [newDonation, ...donations]

    setDonations(updatedDonations)

    localStorage.setItem(
      'foodshare-donations',
      JSON.stringify(updatedDonations)
    )

    setFormData({
      organization: '',
      food: '',
      type: '',
      quantity: '',
      location: '',
      contact: '',
    })

    setErrors({})

    setSuccessMessage(
      '✓ Donation added successfully! It is now available in the food listings.'
    )
  }

  return (
    <div className="app">
      {/* =========================
          Navigation
      ========================= */}

      <header className="navbar">
        <div className="logo">FoodShare SL</div>

        <nav>
          <a href="#home">Home</a>
          <a href="#donations">Available Food</a>
          <a href="#add-donation">Add Donation</a>
        </nav>
      </header>

      <main>
        {/* =========================
            Hero Section
        ========================= */}

        <section id="home" className="hero">
          <div className="hero-content">
            <p className="tag">REDUCING FOOD WASTE IN SRI LANKA</p>

            <h1>
              Share surplus food.
              <br />
              Help your community.
            </h1>

            <p className="hero-text">
              FoodShare SL helps restaurants and community organizations
              share surplus food with people who need it instead of letting
              good food go to waste.
            </p>

            <div className="hero-buttons">
              <a href="#donations" className="primary-button">
                Find Available Food
              </a>

              <a href="#add-donation" className="secondary-button">
                Add a Donation
              </a>
            </div>
          </div>
        </section>

        {/* =========================
            Problem Section
        ========================= */}

        <section className="problem-section">
          <p className="section-label">THE PROBLEM</p>

          <h2>Food waste affects communities and the environment.</h2>

          <p>
            Restaurants, shops and households can have edible surplus food
            while nearby communities may need access to affordable meals.
            FoodShare SL provides a simple way to make surplus food visible
            and easier to share.
          </p>
        </section>

        {/* =========================
            Available Food
        ========================= */}

        <section id="donations" className="donations-section">
          <div className="section-heading">
            <div>
              <p className="section-label">AVAILABLE FOOD</p>

              <h2>Find surplus food near you</h2>
            </div>
          </div>

          {/* Search and Filter */}

          <div className="search-box">
            <input
              type="text"
              placeholder="Search by food, organization, or location..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <select
              value={foodType}
              onChange={(event) => setFoodType(event.target.value)}
            >
              <option>All food types</option>
              <option>Rice & Meals</option>
              <option>Bakery</option>
              <option>Fruits & Vegetables</option>
            </select>
          </div>

          <p className="search-results">
            Showing {filteredDonations.length} donation
            {filteredDonations.length !== 1 ? 's' : ''}
          </p>

          {/* Donation Cards */}

          <div className="donation-grid">
            {filteredDonations.length > 0 ? (
              filteredDonations.map((donation) => (
                <article className="donation-card" key={donation.id}>
                  <span className="food-type">{donation.type}</span>

                  <h3>{donation.food}</h3>

                  <p>
                    <strong>Organization:</strong>{' '}
                    {donation.organization}
                  </p>

                  <p>📍 {donation.location}</p>

                  <p>
                    <strong>Available:</strong> {donation.quantity}{' '}
                    portions/items
                  </p>

                  <p>
                    <strong>Contact:</strong> {donation.contact}
                  </p>

                  <button type="button">View Details</button>
                </article>
              ))
            ) : (
              <div className="no-results">
                <h3>No food donations found</h3>

                <p>
                  Try another search term or select a different food type.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* =========================
            Add Donation
        ========================= */}

        <section id="add-donation" className="form-section">
          <div className="form-container">
            <p className="section-label">SHARE SURPLUS FOOD</p>

            <h2>Add a food donation</h2>

            <p>
              Have surplus food that can help someone? Add the details below.
            </p>

            {/* Success Message */}

            {successMessage && (
              <div className="success-message">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-grid">
                {/* Organization */}

                <div className="form-group">
                  <label htmlFor="organization">
                    Organization Name
                  </label>

                  <input
                    id="organization"
                    name="organization"
                    type="text"
                    placeholder="e.g. Green Garden Restaurant"
                    value={formData.organization}
                    onChange={handleInputChange}
                  />

                  {errors.organization && (
                    <p className="error-message">
                      {errors.organization}
                    </p>
                  )}
                </div>

                {/* Food Name */}

                <div className="form-group">
                  <label htmlFor="food">Food Name</label>

                  <input
                    id="food"
                    name="food"
                    type="text"
                    placeholder="e.g. Vegetable Rice"
                    value={formData.food}
                    onChange={handleInputChange}
                  />

                  {errors.food && (
                    <p className="error-message">
                      {errors.food}
                    </p>
                  )}
                </div>

                {/* Food Type */}

                <div className="form-group">
                  <label htmlFor="type">Food Type</label>

                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option value="">Select food type</option>
                    <option>Rice & Meals</option>
                    <option>Bakery</option>
                    <option>Fruits & Vegetables</option>
                  </select>

                  {errors.type && (
                    <p className="error-message">
                      {errors.type}
                    </p>
                  )}
                </div>

                {/* Quantity */}

                <div className="form-group">
                  <label htmlFor="quantity">Quantity</label>

                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    placeholder="Number of portions/items"
                    value={formData.quantity}
                    onChange={handleInputChange}
                  />

                  {errors.quantity && (
                    <p className="error-message">
                      {errors.quantity}
                    </p>
                  )}
                </div>

                {/* Location */}

                <div className="form-group">
                  <label htmlFor="location">Location</label>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="e.g. Colombo 05"
                    value={formData.location}
                    onChange={handleInputChange}
                  />

                  {errors.location && (
                    <p className="error-message">
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* Contact */}

                <div className="form-group">
                  <label htmlFor="contact">Contact Number</label>

                  <input
                    id="contact"
                    name="contact"
                    type="tel"
                    placeholder="e.g. 0771234567"
                    value={formData.contact}
                    onChange={handleInputChange}
                  />

                  {errors.contact && (
                    <p className="error-message">
                      {errors.contact}
                    </p>
                  )}
                </div>
              </div>

              <button type="submit" className="submit-button">
                Add Food Donation
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* =========================
          Footer
      ========================= */}

      <footer>
        <p>
          FoodShare SL — Reducing food waste through community sharing.
        </p>
      </footer>
    </div>
  )
}

export default App