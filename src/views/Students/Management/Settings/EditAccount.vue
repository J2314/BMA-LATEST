<template>
    <ion-content class="ion-padding">
      <div class="content-wrapper">
        <h1 class="form-title">Account Details</h1>
        <div class="form-container">
          <div class="form-group">
            <label for="name" class="form-label">Name</label>
            <input type="text" id="name" class="form-control" v-model="name" readonly>
          </div>
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input type="email" id="email" class="form-control" v-model="email" readonly>
          </div>
          <div class="form-group">
            <label for="department" class="form-label">Department</label>
            <input type="text" id="department" class="form-control" v-model="department" readonly>
          </div>
          <div class="form-group">
            <label for="role" class="form-label">Role</label>
            <input type="text" id="role" class="form-control" v-model="role" readonly>
          </div>
          <div class="form-group">
            <label for="birthday" class="form-label">Birthday</label>
            <input type="date" id="birthday" class="form-control" v-model="birthday">
          </div>
          <div class="form-group">
            <label for="gender" class="form-label">Gender</label>
            <select id="gender" class="form-control" v-model="gender">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div class="form-group">
            <label for="address" class="form-label">Address</label>
            <input type="text" id="address" class="form-control" v-model="address">
          </div>
          <div class="form-group">
            <label for="contactNumber" class="form-label">Contact Number</label>
            <input type="text" id="contactNumber" class="form-control" v-model="contactNumber">
          </div>
          <button @click="saveDetails" class="btn btn-primary">Save</button>
        </div>
      </div>
    </ion-content>
  </template>
  
  <script>
  export default {
    name: 'AccountDetails',
    data() {
      return {
        name: 'John Doe',
        email: 'johndoe@example.com',
        department: 'Marketing',
        role: 'Staff',
        birthday: '',
        gender: 'male',
        address: '',
        contactNumber: '',
      };
    },
    methods: {
      saveDetails() {
        // Logic to save account details
      },
    },
  };
  </script>
  
  <style scoped>
  .content-wrapper {
    padding: 20px;
  }
  
  .form-title {
    font-size: 32px;
    font-weight: bold;
    color: #333;
    margin-bottom: 30px;
  }
  
  .form-container {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-label {
    font-size: 18px;
    color: #333;
  }
  
  .form-control {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 16px;
  }
  
  .btn-primary {
    background-color: #28a745;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 12px 20px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-size: 16px;
  }
  
  .btn-primary:hover {
    background-color: #218838;
  }
  </style>
  