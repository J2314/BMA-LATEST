<template>
  <ion-content class="ion-padding">
    <div class="content-wrapper">
      <form @submit.prevent="submitForm" class="add-form">
        <h1 class="form-title text-primary">ADD FORMS</h1>
        <div class="form-table-container">
          <table class="form-table">
            <tr>
              <td>
                <label for="formName" class="form-label">Form Name</label>
                <input type="text" id="formName" class="form-control" v-model="formName" placeholder="Enter name">
              </td>
              <td>
                <label for="formCode" class="form-label">Form Code</label>
                <input type="text" id="formCode" class="form-control" v-model="formCode" placeholder="Enter code">
              </td>
              <td>
                <label for="formDescription" class="form-label">Description</label>
                <input type="text" id="formDescription" class="form-control" v-model="formDescription"
                  placeholder="Enter Description">
              </td>
              <td>
                <label for="formDepartment" class="form-label">Department</label>
                <select id="formDepartment" class="form-control" v-model="formDepartment">
                  <option value="">Select Department</option>
                  <option v-for="(department, index) in departments" :key="index" :value="String(department.id)">{{ department.name }}</option>
                </select>
              </td>
              <td class="button-cell">
                <button type="submit" class="btn btn-primary">Add</button>
              </td>
            </tr>
          </table>
        </div>
        <span v-if="submitSuccess" class="success-message">Form submitted successfully!</span>
        <span v-if="submitError" class="error-message">{{ submitError }}</span>
      </form>
      <div class="search-department-container">
        <div class="search-bar">
          <input type="text" class="form-control" v-model="searchKeyword" placeholder="Search forms...">
        </div>
        <div class="department-filter">
          <select id="departmentFilter" class="form-control" v-model="selectedDepartment">
            <option value="">All Departments</option>
            <option v-for="(department, index) in departments" :key="index" :value="String(department.id)">{{ department.name }}</option>
          </select>
        </div>
      </div>
      <table class="form-summary-table">
        <thead>
          <tr>
            <th v-for="(header, index) in tableHeaders" :key="index">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="form in filteredForms" :key="form.id">
            <td>{{ form.file_name }}</td>
            <td>{{ form.description }}</td>
            <td>{{ form.department.name }}</td>
            <td>
              <router-link class="btn btn-primary" :to="{ name: 'admin.upload-forms', query: { formId: form.id, } }">
                Edit
              </router-link>
              <button @click="deleteForm(form.id)" class="btn btn-danger">Archive</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </ion-content>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import { GET_USER_TOKEN } from '@/store/storeConstants.js'

export default {
  name: 'AddFormPage',
  data() {
    return {
      formName: '',
      formCode: '',
      formDescription: '',
      formDepartment: '',
      submitError: '',
      submitSuccess: false,
      departments: [],
      forms: [],
      searchKeyword: '',
      selectedDepartment: '',
      tableHeaders: ['Form Name', 'Description', 'Department', 'Action']
    };
  },
  computed: {
    ...mapGetters('auth', {
      token: GET_USER_TOKEN
    }),
    filteredForms() {
      let filtered = this.forms;
      if (this.selectedDepartment) {
        filtered = filtered.filter(form => String(form.department.id) === this.selectedDepartment);
      }
      if (this.searchKeyword.trim() !== '') {
        const keyword = this.searchKeyword.toLowerCase();
        filtered = filtered.filter(form =>
          form.file_name.toLowerCase().includes(keyword) ||
          form.description.toLowerCase().includes(keyword)
        );
      }
      return filtered;
    }
  },
  methods: {
    submitForm() {
      if (!this.formName || !this.formCode || !this.formDepartment || !this.formDescription) {
        this.submitError = 'Please fill out all fields.';
        return;
      }

      axios.post('form', {
        file_name: this.formName,
        file_code: this.formCode,
        description: this.formDescription,
        department_id: this.formDepartment,
      }, {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      })
        .then(() => {
          // Reset form fields and fetch updated forms
          this.resetFormFields();
          this.fetchForms();
          this.submitSuccess = true;
        })
        .catch(error => {
          // Handle error
          this.handleError(error);
        });
    },
    fetchDepartments() {
      axios.get('retrieve', {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      })
        .then(response => {
          this.departments = response.data;
        })
        .catch(error => {
          console.error('Error fetching departments:', error);
        });
    },
    fetchForms() {
      axios.get('retrieve-forms', {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      })
        .then(response => {
          this.forms = response.data;
        })
        .catch(error => {
          console.error('Error fetching forms:', error);
        });
    },
    resetFormFields() {
      this.formName = '';
      this.formCode = '';
      this.formDescription = '';
      this.formDepartment = '';
      this.submitError = '';
      this.submitSuccess = false;
    },
    handleError(error) {
      if (error.response && error.response.data && error.response.data.message) {
        this.submitError = error.response.data.message;
      } else {
        this.submitError = 'An error occurred.';
      }
    },
    deleteForm(formId) {
      axios.put(`archive-forms/${formId}`, null, {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      })
        .then(() => {
          // Alert and fetch updated forms
          alert('Form archived successfully');
          this.fetchForms();
        })
        .catch(error => {
          // Handle error
          console.error('Error archiving form:', error.message);
          alert('Error archiving form: ' + error.message);
        });
    }
  },
  mounted() {
    this.fetchDepartments();
    this.fetchForms();
  }
}
</script>

<style scoped>
.content-wrapper {
  padding: 20px;
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
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 14px;
  margin-right: 10px;
}

.btn-primary:hover {
  background-color: #218838;
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

.search-department-container {
  display: flex;
  justify-content: center; /* Align items horizontally */
  margin-top: 20px;
}

.search-bar,
.department-filter {
  margin-right: 20px;
}

.search-bar input,
.department-filter select {
  width: auto;
}
</style>
