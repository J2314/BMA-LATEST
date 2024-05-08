<template>
  <ion-content class="ion-padding">
    <div class="content-wrapper">
      <router-link class="btn btn-primary btn-bck" to="/admin/Account-Management">
        Back
      </router-link>
      <h1 class="form-title text-primary">ACCOUNT DETAILS</h1>
      <div class="form-container">
        <div class="form-group">
          <label for="name" class="form-label">Name</label>
          <input type="text" id="name" class="form-control" v-model="name">
        </div>
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input type="email" id="email" class="form-control" v-model="email">
        </div>
        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input type="password" id="password" class="form-control" v-model="password" readonly>
        </div>
        <div class="form-group">
          <label for="department" class="form-label">Department</label>
          <input type="text" id="department" class="form-control" v-model="department" readonly>
        </div>
        <div class="form-group">
          <label for="role" class="form-label">Role</label>
          <input type="text" id="role" class="form-control" v-model="role" readonly>
        </div>
        <h3>Other Details:</h3>
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
import axios from 'axios';
import { mapGetters } from 'vuex';
import { GET_USER_TOKEN } from '@/store/storeConstants.js';

export default {
  name: 'EditAccount',
  data() {
    return {
      userId: '',
      name: '',
      email: '',
      password: '',
      department: '',
      role: '',
      birthday: '',
      gender: '',
      address: '',
      contactNumber: '',
      error: '',
    };
  },
  computed: {
    ...mapGetters('auth', {
      token: GET_USER_TOKEN,
    }),
  },
  methods: {
    async fetchPassword() {
      try {
        const response = await axios.get(`/passwords/${this.userId}`, {
          headers: {
            Authorization: 'Bearer ' + this.token,
          },
        });
        this.password = response.data.password;
        console.log(response)
      } catch (error) {
        console.error('Error fetching password:', error);
        this.error = 'Error fetching password.';
      }
    },
    async fetchData() {
      const userId = this.$route.query.userId;
      try {
        const response = await axios.get(`/user/${userId}`, {
          headers: {
            Authorization: 'Bearer ' + this.token,
          },
        });
        const userData = response.data;
        this.name = userData.name;
        this.email = userData.email;
        this.department = userData.department;
        this.role = userData.role;
        this.birthday = userData.birthday;
        this.gender = userData.gender;
        this.address = userData.address;
        this.contactNumber = userData.contactNumber;
      } catch (error) {
        console.error('Error fetching user data:', error);
        this.error = 'Error fetching user data.';
      }
    },
    async saveDetails() {
      
    },
  },
  mounted() {
    const { userId, name, email, department, role } = this.$route.query;
    this.userId = userId;
    this.name = name || '';
    this.email = email || '';
    this.department = department || '';
    this.role = role || '';
    this.fetchPassword();
  },

};
</script>


<style scoped>
.content-wrapper {
  padding: 20px;
}

.form-title {
  font-size: 45px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.form-container {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 15px;
}

.form-label {
  font-size: 16px;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.btn-primary {
  display: block;
  width: 100%;
  margin-bottom: 20px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 16px;
}

.btn-primary:hover {
  background-color: #218838;
}

.btn-bck {
  max-width: 100px;
}

.password-input {
  position: relative;
}

.password-input .btn-secondary {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background-color: transparent;
  border: none;
  cursor: pointer;
}
</style>
