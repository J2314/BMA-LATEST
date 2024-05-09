<template>
  <ion-content>
    <div class="content-wrapper">
      <div class="row">
        <div class="col-md-7">
          <div class="add-form">
            <form @submit.prevent="submitForm">
              <h1 class="form-title text-primary"><strong>ADD WORK INSTRUCTIONS</strong></h1>
              <div class="form-group">
                <label for="documentType" class="form-label">Document Type:</label>
                <select id="documentType" class="form-control" v-model="document_type">
                  <option value="" disabled selected>Select Document Type</option>
                  <option value="Quality Policy">Quality Policy</option>
                  <option value="Environmental Policy">Environmental Policy</option>
                  <option value="Health and Safety Policy">Health and Safety Policy</option>
                </select>
              </div>
              <div class="form-group">
                <label for="documentName" class="form-label">Document Name:</label>
                <input type="text" id="documentName" class="form-control smaller-input" v-model="document_name"
                  placeholder="Enter document name">
              </div>
              <div class="form-group">
                <label for="departmentId" class="form-label">Department:</label>
                <select id="departmentId" class="form-control" v-model="selected_department">
                  <option value="" disabled selected>Select Department</option>
                  <option v-for="(department, index) in departments" :key="index" :value="department.id">{{
              department.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label for="employee" class="form-label">Employee:</label>
                <select id="employee" class="form-control smaller-input" v-model="employee">
                  <option value="" disabled selected>Select Employee</option>
                  <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label for="file" class="form-label">Choose File:</label>
                <input class="form-control smaller-input" id="formFileLg" type="file" @change="fileSelected" ref="file">
              </div>
              <div class="d-flex">
                <button type="submit" class="btn btn-primary">Upload</button>
              </div>
            </form>
          </div>
          <div id="cusTable" class="table-wrapper mt-3">
            <!-- Search bar and Department filter -->
            <div class="search-department-container">
              <!-- Search bar -->
              <div class="search-bar">
                <input type="text" class="form-control" v-model="searchKeyword" placeholder="Search instructions...">
              </div>
              <!-- Department filter -->
              <div class="department-filter">
                <select id="departmentFilter" class="form-control" v-model="selectedDepartment">
                  <option value="">All Departments</option>
                  <option v-for="(department, index) in departments" :key="index" :value="department.id">{{
              department.name }}</option>
                </select>
              </div>
            </div>
            <!-- Instructions table -->
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th id="documentType" scope="col">Document Type</th>
                  <th id="documentName" scope="col">Document Name</th>
                  <th id="employee" scope="col">Employee</th>
                  <th id="department" scope="col">Department</th>
                  <th id="actions" scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(instruction, index) in filteredInstructions" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ instruction.document_type }}</td>
                  <td>{{ instruction.document_name }}</td>
                  <td>{{ instruction.user_id }}</td>
                  <td>{{ getDepartmentName(instruction.department_id) }}</td>
                  <td><button id="btnView" type="button" class="btn btn-secondary"
                      @click="openPdf(instruction.id)">View</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="col-md-5">
          <div class="pdf-viewer-container">
            <iframe id="pdfViewer" class="pdf-viewer" ref="pdfViewer"></iframe>
          </div>
        </div>
      </div>
    </div>
  </ion-content>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import { GET_USER_TOKEN } from '@/store/storeConstants.js';

export default {
  name: 'AddWorkInstructionPage',
  data() {
    return {
      document_type: '',
      document_name: '',
      employee: '',
      selected_department: '',
      instructions: [],
      file: null,
      users: [],
      departments: [],
      searchKeyword: '',
      selectedDepartment: ''
    };
  },
  computed: {
    ...mapGetters('auth', {
      token: GET_USER_TOKEN
    }),
    filteredInstructions() {
      let filtered = this.instructions;
      if (this.selectedDepartment) {
        filtered = filtered.filter(instruction => instruction.department_id === this.selectedDepartment);
      }
      if (this.searchKeyword.trim() !== '') {
        const keyword = this.searchKeyword.toLowerCase();
        filtered = filtered.filter(instruction =>
          (instruction.document_type || '').toLowerCase().includes(keyword) ||
          (instruction.document_name || '').toLowerCase().includes(keyword) ||
          ((instruction.user_id || '') + '').toLowerCase().includes(keyword) || // Ensure user_id is a string
          this.getDepartmentName(instruction.department_id).toLowerCase().includes(keyword)
        );
      }
      return filtered;
    }


  },
  methods: {
    openPdf(workId) {
      axios.get(`retrieve-workins/${workId}`, {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      })
        .then(response => {
          const fileContent = response.data.work.file_path;
          const pdfViewer = this.$refs.pdfViewer;
          pdfViewer.src = fileContent;
        })
        .catch(error => {
          console.error('Error fetching file content:', error);
        });
    },
    submitForm() {
      if (!this.document_type || !this.document_name || !this.employee || !this.file || !this.selected_department) {
        alert('Please fill out all fields and select a file.');
        return;
      }

      let formData = new FormData();
      formData.append('file', this.file);
      formData.append('document_type', this.document_type);
      formData.append('document_name', this.document_name);
      formData.append('user_id', this.employee);
      formData.append('department_id', this.selected_department);

      axios.post('upload-work', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + this.token
        }
      })
        .then(response => {
          console.log(response)
          if (response.status === 200) {
            alert('File uploaded successfully.');
            this.document_type = '';
            this.document_name = '';
            this.employee = '';
            this.file = null;
            this.selected_department = '';
            this.fetchInstructions();
          } else {
            alert('Error uploading file.');
          }
        })
        .catch(error => {
          console.error('Error uploading file:', error);
          alert('Error uploading file.');
        });
    },
    fetchInstructions() {
      axios.get('retrieve-instructions', {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      })
        .then(response => {
          console.log(response)
          this.instructions = response.data;
        })
        .catch(error => {
          console.error('Error fetching instructions:', error);
        });
    },
    fileSelected(event) {
      const files = event.target.files;
      if (files.length > 0) {
        this.file = files[0];
      }
    },
    fetchUsers() {
      axios.get('user-retrieve', {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      })
        .then(response => {
          console.log(response)
          this.users = response.data.users;
        })
        .catch(error => {
          console.error('Error fetching users:', error);
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
    getDepartmentName(departmentId) {
      const department = this.departments.find(dep => dep.id === departmentId);
      return department ? department.name : '';
    }
  },
  mounted() {
    this.fetchInstructions();
    this.fetchUsers();
    this.fetchDepartments();
  }
}
</script>

<style scoped>
.content-wrapper {
  padding: 20px;
  overflow-y: auto;
}

.add-form {
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.form-label {
  font-size: 16px;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 8px;
}

.smaller-input {
  padding: 5px;
}

.btn-primary {
  margin-top: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 14px;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.table-wrapper {
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  overflow-x: auto;
}

.table-hover th,
.table-hover td {
  padding: 8px;
}

.pdf-viewer-container {
  margin-top: 10px;
  width: 100%;
  height: 600px;
  border: 1px solid #ccc;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.pdf-viewer {
  width: 100%;
  height: 100%;
  border: none;
}

.search-department-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.search-bar,
.department-filter {
  flex: 1;
  margin-right: 10px;
}

.search-bar input {
  width: 100%;
}

.department-filter select {
  width: 100%;
}
</style>
