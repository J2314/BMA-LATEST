<template>
    <div class="profile-container">
      <div class="profile-header">
        <div class="profile-frame">
          <img src="./Screenshot 2024-03-12 163138.png" alt="Profile Picture" class="profile-picture">
          <h2 class="employee-name">Saks lang</h2>
        </div>
      </div>
      <div class="profile-tabs">
        <button class="tab-button" :class="{ active: activeTab === 'details' }" @click="setActiveTab('details')">Details</button>
        <!-- Add more tabs as needed -->
      </div>
      <div class="tab-content">
        <div v-if="activeTab === 'details'" class="tab-panel active">
          <div class="input-columns">
            <div class="input-group">
              <label for="firstName">First Name:</label>
              <input type="text" id="firstName" v-model="firstName">
            </div>
            <div class="input-group">
              <label for="lastName">Last Name:</label>
              <input type="text" id="lastName" v-model="lastName">
            </div>
            <div class="input-group">
              <label for="userId">User ID:</label>
              <input type="text" id="userId" v-model="userId">
            </div>
            <div class="input-group">
              <label for="birthdate">Birthdate:</label>
              <input type="date" id="birthdate" v-model="birthdate">
            </div>
            <div class="input-group">
              <label for="gender">Gender:</label>
              <select id="gender" v-model="gender">
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="input-group">
              <label for="address">Address:</label>
              <textarea id="address" v-model="address"></textarea>
            </div>
            <div class="input-group" style="margin-top: -50px;">
              <label for="contactNumber">Contact Number:</label>
              <input type="text" id="contactNumber" v-model="contactNumber">
            </div>
          </div>
        </div>
        <div v-else class="tab-panel">
          <!-- Placeholder content for other tabs -->
          <p>Other tab content goes here.</p>
        </div>
      </div>
      <button class="btn-primary" @click="submitForm">Submit</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'ProfileAcc',
    data() {
      return {
        activeTab: 'details',
        firstName: '',
        lastName: '',
        userId: '',
        birthdate: '',
        gender: '',
        address: '',
        contactNumber: '',
        submitError: ''
      };
    },
    methods: {
      setActiveTab(tab) {
        this.activeTab = tab;
      },
      submitForm() {
        if (!this.firstName || !this.lastName || !this.userId || !this.birthdate || !this.gender || !this.address || !this.contactNumber) {
          this.submitError = 'Please fill out all fields.';
          return;
        }
  
        axios.post('users', {
          firstName: this.firstName,
          lastName: this.lastName,
          userId: this.userId,
          birthdate: this.birthdate,
          gender: this.gender,
          address: this.address,
          contactNumber: this.contactNumber
        })
        .then(response => {
          // Handle success
          console.log(response.data);
          // Clear form fields
          this.firstName = '';
          this.lastName = '';
          this.userId = '';
          this.birthdate = '';
          this.gender = '';
          this.address = '';
          this.contactNumber = '';
          this.submitError = '';
        })
        .catch(error => {
          // Handle error
          console.error(error);
          if (error.response && error.response.data && error.response.data.message) {
            this.submitError = error.response.data.message;
          } else {
            this.submitError = 'An error occurred.';
          }
        });
      }
    }
  };
  </script>
  
  <style scoped>
  .profile-container {
    max-width: 800px; /* Wider container */
    margin: 50px auto;
    padding: 20px;
    background-color: #f7f7f7;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
    text-align: center; 
  }
  
  .profile-header {
    margin-bottom: 20px;
  }
  
  .profile-frame {
    border: 2px solid #ccc; /* Add border */
    border-radius: 20px; /* Rounded corners */
    padding: 20px; /* Add padding */
    display: inline-block; /* Make it inline-block to center it */
    width: 300px; /* Widen the frame */
  }
  
  .profile-picture {
    width: 120px; /* Decrease width */
    height: 120px; /* Decrease height */
    border-radius: 50%;
    margin-bottom: 10px; /* Decrease margin */
  }
  
  .employee-name {
    margin-bottom: 10px; /* Decrease bottom margin */
    font-size: 28px; /* Increase font size */
    font-weight: bold; /* Add bold font weight */
    color: #333333;
  }
  
  .profile-tabs {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  .tab-button {
    padding: 10px 20px;
    margin: 0 10px;
    border: none;
    background-color: #69c267; 
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-size: 16px;
    color: #ffffff; 
  }
  
  .tab-button.active {
    background-color: #4ca94c; 
  }
  
  .tab-content {
    padding: 0 20px;
  }
  
  .input-columns {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  
  .input-group {
    flex: 0 0 calc(50% - 10px);
    margin-bottom: 20px;
  }
  
  .input-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    font-size: 16px;
    color: #333333;
  }
  
  .input-group input,
  .input-group select,
  .input-group textarea {
    width: calc(100% - 20px); /* Adjusting width to account for padding */
    padding: 10px; /* Increased padding for better appearance */
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 16px;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  
  .input-group input:focus,
  .input-group select:focus,
  .input-group textarea:focus {
    outline: none;
    border-color: #007bff; 
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
  
  .input-group textarea {
    height: 100px;
  }
  
  .btn-primary {
    margin-top: 20px;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: #ffffff;
    cursor: pointer;
    transition: background-color 0.3s;
    font-size: 16px;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
  }
  </style>
  