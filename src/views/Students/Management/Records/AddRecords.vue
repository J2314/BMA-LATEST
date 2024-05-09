<template>
  <ion-content>
    <div class="content-wrapper">
      <div class="row">
        <div class="col-md-7">
          <div class="add-form">
            <form @submit.prevent="submitForm">
              <h1 class="form-title text-primary"><strong>ADD RECORDS</strong></h1>
              <div class="form-group">
                <label for="documentType" class="form-label">Record Type:</label>
                <select id="documentType" class="form-control" v-model="recordType">
                  <option value="" disabled selected>Select Record Type</option>
                  <option value="Document Control Procedure">Document Control Procedure</option>
                  <option value="Corrective and Preventive Action (CAPA) Procedure">Corrective and Preventive Action (CAPA) Procedure</option>
                  <option value="Internal Audit Procedure">Internal Audit Procedure</option>
                  <option value="Management Review Procedure">Management Review Procedure</option>
                  <option value="Risk Management Review Procedure">Risk Management Review Procedure</option>
                </select>
              </div>
              <div class="form-group">
                <label for="departmentId" class="form-label">Departments:</label>
                <select id="departmentId" class="form-control" v-model="department_id">
                  <option value="">Select Department</option>
                  <option v-for="(department, index) in departments" :key="index" :value="department.id">{{ department.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label for="recordName" class="form-label">Record Name:</label>
                <input type="text" id="recordName" class="form-control smaller-input" v-model="recordName" placeholder="Enter record name">
              </div>
              <div class="form-group">
                <label for="documentName" class="form-label">Document Name:</label>
                <input type="text" id="documentName" class="form-control smaller-input" v-model="documentName" placeholder="Enter document name">
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
          <!-- Search Bar and Department Filter -->
          <div class="search-filter-container mt-3">
            <div class="search-container">
              <input type="text" class="form-control" v-model="searchQuery" placeholder="Search...">
            </div>
            <div class="department-filter-container">
              <select class="form-control" v-model="selectedDepartment">
                <option value="">All Departments</option>
                <option v-for="department in departments" :key="department.id" :value="department.id">{{ department.name }}</option>
              </select>
            </div>
          </div>
          <!-- Table -->
          <div id="cusTable" class="table-wrapper mt-3">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th id="documentType" scope="col">Record Type</th>
                  <th id="department" scope="col">Department</th>
                  <th id="documentName" scope="col">Document Name</th>
                  <th id="actions" scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(record, index) in filteredRecords" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ record.record_type }}</td>
                  <td>{{ getDepartmentName(record.department_id) }}</td>
                  <td>{{ record.document_name }}</td>
                  <td><button id="btnView" type="button" class="btn btn-secondary" @click="openPdf(record.id)">View</button></td>
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
  name: 'AddRecordsPage',
  data() {
    return {
      recordType: '',
      department_id: '',
      recordName: '',
      documentName: '',
      selectedFile: null,
      departments: [],
      records: [],
      searchQuery: '',
      selectedDepartment: '',
    };
  },
  computed: {
    ...mapGetters('auth', {
      token: GET_USER_TOKEN
    }),
    filteredRecords() {
      return this.records.filter(record => {
        const matchesSearchQuery = record.record_type.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          record.document_name.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesDepartment = !this.selectedDepartment || record.department_id === this.selectedDepartment;
        return matchesSearchQuery && matchesDepartment;
      });
    }
  },
  methods: {
    openPdf(recId) {
      axios.get(`retrieve-records/${recId}`, {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      })
        .then(response => {
          const fileContent = response.data.record.file_path;
          const pdfViewer = this.$refs.pdfViewer;
          pdfViewer.src = fileContent;
        })
        .catch(error => {
          console.error('Error fetching file content:', error);
        });
    },
    submitForm() {
      if (!this.recordType || !this.department_id || !this.recordName || !this.documentName || !this.$refs.file.files[0]) {
        alert('Please fill out all fields and select a file.');
        return;
      }

      let formData = new FormData();
      formData.append('file', this.$refs.file.files[0]);
      formData.append('record_type', this.recordType);
      formData.append('department_id', this.department_id);
      formData.append('record_name', this.recordName);
      formData.append('document_name', this.documentName);

      axios.post('upload-record', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + this.token
        }
      })
        .then(response => {
          if (response.status === 200) {
            alert('Record uploaded successfully.');
            this.recordType = '';
            this.department_id = '';
            this.recordName = '';
            this.documentName = '';
            this.$refs.file.value = null;
            this.fetchRecords();
          } else {
            alert('Error uploading record.');
          }
        })
        .catch(error => {
          console.error('Error uploading record:', error);
          alert('Error uploading record.');
        });
    },
    fetchRecords() {
      axios.get('retrieve-record', {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      })
        .then(response => {
          this.records = response.data;
        })
        .catch(error => {
          console.error('Error fetching records:', error);
        });
    },
    fileSelected(event) {
      const files = event.target.files;
      if (files.length > 0) {
        this.selectedFile = files[0];
      }
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
    this.fetchDepartments();
    this.fetchRecords();
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

.search-filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
  margin: 20px auto;
}

.search-container {
  flex: 1;
  margin-right: 10px;
}

.department-filter-container {
  flex: 1;
  margin-left: 10px;
}
</style>
