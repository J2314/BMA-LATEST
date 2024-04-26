<template>
  <ion-content>
    <div class="content-wrapper">
      <div class="row">
        <div class="col-md-7">
          <div class="add-form">
            <form @submit.prevent="submitForm">
              <h1 class="form-title">Add Policy Documents</h1>
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
                <input type="text" id="documentName" class="form-control" v-model="document_name"
                  placeholder="Enter document name">
              </div>
              <div class="form-group">
                <label for="departmentId" class="form-label">Departments:</label>
                <select id="departmentId" class="form-control" v-model="department_id">
                  <option value="">Select Department</option>
                  <option v-for="(department, index) in departments" :key="index" :value="department.id">{{ department.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label for="file" class="form-label">Choose File:</label>
                <input class="form-control smaller-input" id="formFileLg" type="file" @change="fileSelected"
                  ref="file">
              </div>
              <div class="d-flex">
                <button type="submit" class="btn btn-primary">Upload</button>
              </div>
            </form>
          </div>
          <div id="cusTable" class="table-wrapper mt-3">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th id="documentType" scope="col">Document Type</th>
                  <th id="documentName" scope="col">Document Name</th>
                  <th id="filePath" scope="col">File Path</th>
                  <th id="actions" scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(policy, index) in policies" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ policy.document_type }}</td>
                  <td>{{ policy.document_name }}</td>
                  <td>{{ policy.file_path }}</td>
                  <td><button id="btnView" type="button" class="btn btn-secondary" @click="openPdf(policy.id)">View</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="col-md-5">
          <div class="pdf-viewer-container">
            <iframe id="pdfViewer" class="pdf-viewer" ref="pdfViewer" height="600px"></iframe>
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
  name: 'AddPolicyPage',
  data() {
    return {
      document_type: '',
      document_name: '',
      department_id: '',
      departments: [],
      policies: [],
      formErrors: {} // New state to hold form validation errors
    };
  },
  computed: {
    ...mapGetters('auth', {
      token: GET_USER_TOKEN
    })
  },
  methods: {
    openPdf(polId) {
      axios.get(`retrieve-policies/${polId}`, {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      })
      .then(response => {
        const fileContent = response.data.policy.file_path;
        const pdfViewer = this.$refs.pdfViewer;
        pdfViewer.src = fileContent;
      })
      .catch(error => {
        this.handleApiError(error);
      });
    },
    submitForm() {
      if (!this.document_type || !this.document_name || !this.$refs.file.files[0]) {
        this.formErrors = {
          document_type: !this.document_type,
          document_name: !this.document_name,
          file: !this.$refs.file.files[0]
        };
        return;
      }

      let formData = new FormData();
      formData.append('file', this.$refs.file.files[0]);
      formData.append('document_type', this.document_type);
      formData.append('document_name', this.document_name);
      formData.append('department_id', this.department_id);

      axios.post('upload-policy', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + this.token
        }
      })
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          this.handleSuccess();
        } else {
          this.handleApiError(response.error);
        }
      })
      .catch(error => {
        this.handleApiError(error);
      });
    },
    fetchPolicies() {
      axios.get('retrieve-policies', {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      })
      .then(response => {
        this.policies = response.data;
      })
      .catch(error => {
        this.handleApiError(error);
      });
    },
    fileSelected(event) {
      const file = event.target.files[0]; 
      if (file) {
        const fileList = new DataTransfer();
        fileList.items.add(file);
        this.$refs.file.files = fileList.files;
      }
    },
    fetchDepartments() {
      axios.get('retrieve', {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      })
      .then(response => {
        this.fetchDepartments()
        this.departments = response.data;
      })
      .catch(error => {
        this.handleApiError(error);
      });
    },
    handleSuccess() {
      alert('File uploaded successfully.');
      this.document_type = '';
      this.document_name = '';
      this.department_id = '';
      this.$refs.file.value = null;
      this.fetchPolicies();
      this.formErrors = {}; // Clear form errors
    },
    handleApiError(error) {
      console.error('API Error:', error);
      // Display error message to the user, e.g., this.errorMessage = 'An error occurred. Please try again later.';
    }
  },
  mounted() {
    this.fetchPolicies();
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
</style>