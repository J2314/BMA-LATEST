<template>
  <ion-content>
    <div class="content-wrapper">
      <div class="row">
        <div class="col-md-7"> <!-- Adjusted column width -->
          <div class="add-form">
            <form @submit.prevent="submitForm">
              <h1 class="form-title">Add Procedures</h1>
              <div class="form-group">
                <label for="documentType" class="form-label">Procedure Type:</label>
                <select id="documentType" class="form-control" v-model="document_type">
                  <option value="" disabled selected>Select Procedure Type</option>
                  <option value="Document Control Procedure">Document Control Procedure</option>
                  <option value="Corrective and Preventive Action (CAPA) Procedure">Corrective and Preventive Action (CAPA) Procedure</option>
                  <option value="Internal Audit Procedure">Internal Audit Procedure</option>
                  <option value="Management Review Procedure">Management Review Procedure</option>
                  <option value="Risk Management Review Procedure">Risk Management Review Procedure</option>
                </select>
              </div>
              <div class="form-group">
                <label for="departmentId" class="form-label">Department:</label>
                <select id="departmentId" class="form-control" v-model="department_id">
                  <option value="">Select Department</option>
                  <option v-for="(department, index) in departments" :key="index" :value="department.id">{{ department.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label for="documentName" class="form-label">Document Name:</label>
                <input type="text" id="documentName" class="form-control smaller-input" v-model="document_name" placeholder="Enter document name">
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
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th id="documentType" scope="col">Procedure Type</th>
                  <th id="documentName" scope="col">Document Name</th>
                  <th id="filePath" scope="col">File Path</th>
                  <th id="actions" scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(procedure, index) in procedures" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ procedure.document_type }}</td>
                  <td>{{ procedure.document_name }}</td>
                  <td>{{ procedure.file_path }}</td>
                  <td><button id="btnView" type="button" class="btn btn-secondary" @click="openPdf(procedure.id)">View</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="col-md-5"> <!-- Adjusted column width -->
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
  name: 'AddProcedurePage',
  data() {
    return {
      document_type: '',
      department_id: '',
      document_name: '',
      procedures: [],
      departments: [] // Assuming you have departments data to populate the select options
    };
  },
  computed: {
    ...mapGetters('auth', {
      token: GET_USER_TOKEN
    })
  },
  methods: {
    openPdf(procId) {
      axios.get(`retrieve-procedures/${procId}`, {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      })
      .then(response => {
        const fileContent = response.data.procedure.file_path;
        const pdfViewer = this.$refs.pdfViewer;

        pdfViewer.src = fileContent;
      })
      .catch(error => {
        console.error('Error fetching file content:', error);
      });
    },
    submitForm() {
      if (!this.document_type || !this.department_id || !this.document_name || !this.$refs.file.files[0]) {
        alert('Please fill out all fields and select a file.');
        return;
      }

      let formData = new FormData();
      formData.append('file', this.$refs.file.files[0]);
      formData.append('document_type', this.document_type);
      formData.append('department_id', this.department_id);
      formData.append('document_name', this.document_name);

      axios.post('upload-procedure', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + this.token
        }
      })
      .then(response => {
        if (response.status === 200) {
          alert('File uploaded successfully.');
          this.document_type = '';
          this.department_id = '';
          this.document_name = '';
          this.$refs.file.value = null;
          this.fetchProcedures();
        } else {
          alert('Error uploading file.');
        }
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        alert('Error uploading file.');
      });
    },
    fetchProcedures() {
      axios.get('retrieve-procedures', {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      })
      .then(response => {
        this.procedures = response.data;
      })
      .catch(error => {
        console.error('Error fetching procedures:', error);
      });
    },
    fileSelected(event) {
      const files = event.target.files;
      if (files.length > 0) {
        this.form.file = files[0];
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
}

  },
  mounted() {
  this.fetchProcedures();
  this.fetchDepartments(); // Call fetchDepartments when the component is mounted
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
