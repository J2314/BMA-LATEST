<template>
  <ion-content>
    <div class="content-wrapper">
      <form @submit.prevent="submitForm" class="add-form">
        <h1 class="form-title">Account Management</h1>
        <div class="form-table-container">
          <table class="form-table">
            <tr>
              <td>
                <label for="userName" class="form-label">Name</label>
                <input type="text" id="userName" class="form-control" v-model="users.userName" placeholder="Enter name">
              </td>
              <td>
                <label for="userEmail" class="form-label">Email</label>
                <input type="email" id="userEmail" class="form-control" v-model="users.userEmail"
                  placeholder="Enter email">
              </td>
              <td>
                <label for="userPassword" class="form-label">Password</label>
                <input type="password" id="userPassword" class="form-control" v-model="users.userPassword"
                  placeholder="Enter password">
              </td>
              <td>
                <label for="userDepartment" class="form-label">Department</label>
                <select id="userDepartment" class="form-control" v-model="users.userDepartment">
                  <option value="">Select department</option>
                  <option v-for="department in departments" :key="department.id" :value="department.id">{{
        department.name }}</option>
                </select>
              </td>
              <td>
                <label for="userRole" class="form-label">Role</label>
                <select id="userRole" class="form-control" v-model="userRole">
                  <option value="">Select role</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </select>
              </td>
              <td class="button-cell">
                <button type="submit" class="btn btn-primary">Create Account</button>
              </td>
            </tr>
          </table>
        </div>
        <span v-if="submitError" class="error-message">{{ submitError }}</span>
      </form>

      <table class="form-summary-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.department }}</td>
            <td>{{ user.role }}</td>
            <td>
              <button @click="editUser(user.id)" class="btn btn-info">Edit</button>
              <button @click="deleteUser(user.id)" class="btn btn-danger">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </ion-content>
</template>


<script>
import axios from 'axios';
import { mapGetters, mapMutations } from 'vuex';
import { GET_USER_TOKEN } from '@/store/storeConstants.js'
export default {
  name: 'AccountManagement',
  data() {
    return {
      userName: '',
      userEmail: '',
      userPassword: '',
      userDepartment: '',
      userRole: '',
      submitError: '',
      departments: [],
      users: []
    };
  },
  computed: {
    ...mapGetters('auth', {
      token: GET_USER_TOKEN
    })
  },
  methods: {
    submitForm() {
      if (!this.userName || !this.userEmail || !this.userPassword || !this.userDepartment) {
        this.submitError = 'Please fill out all fields.';
        return;
      }

      axios.post('register', {
        name: this.userName,
        email: this.userEmail,
        password: this.userPassword,
        department_id: this.userDepartment,
        role: this.userRole
      }, {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      })
        .then(response => {
          //this.users.push(response.data);
          this.userName = '';
          this.userEmail = '';
          this.userPassword = '';
          this.userDepartment = '';
          this.userRole = '';
          this.submitError = '';
          console.log(response)
        })
        .catch(error => {
          if (error.response && error.response.data && error.response.data.message) {
            this.submitError = error.response.data.message;
          } else {
            this.submitError = 'An error occurred.';
          }
        });
    },
    async deleteUser(userId) {
      try {
        await axios.delete(`users/${userId}`);
        this.fetchUsers();
        alert('User removed successfully');
      } catch (error) {
        console.error('Error removing user:', error.message);
        alert('Error removing user: ' + error.message);
      }
    },
    editUser(userId) {

    },
    fetchUsers() {
      axios.get('user-retrieve', {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      })
        .then(response => {
          console.log(response);
          this.users = response.data;
        })
        .catch(error => {
          console.error('Error fetching users:', error);
        });
    },
  },
  mounted() {
    this.fetchUsers();
  }
};
</script>

<style scoped>
.content-wrapper {
  padding: 20px;
  margin-top: 60px;
}

.add-form {
  max-width: 1200px;
  margin: 0 auto;
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
  margin-bottom: 10px;
}

.btn-primary {
  margin-top: 22px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 16px;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-danger {
  background-color: gray;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 14px;
}

.btn-danger:hover {
  background-color: lightgray;
  color: black;
}

.success-message,
.error-message {
  display: block;
  margin-top: 12px;
  font-size: 16px;
  color: #28a745;
}

.error-message {
  color: #dc3545;
}

.form-title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
}

.form-table-container {
  overflow-x: auto;
}

.form-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}

.form-table tr {
  border-bottom: 1px solid #ccc;
}

.form-table td {
  padding: 15px;
}

.button-cell {
  text-align: right;
}

.form-summary-table {
  width: 65%;
  margin-left: 18%;
  margin-top: 30px;
  border-collapse: collapse;
}

.form-summary-table th,
.form-summary-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}

.form-summary-table th {
  background-color: #f0f0f0;
}
</style>
