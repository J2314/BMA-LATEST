<template>
  <ion-content>
    <div class="content-wrapper">
      <div class="row">
        <div class="col-md-7">
          <div class="add-form">
            <form @submit.prevent="submitForm">
              <h1 class="form-title">Add Records</h1>
              <div class="form-group">
                <label for="documentType" class="form-label">Record Type:</label>
                <select id="documentType" class="form-control" v-model="recordType">
                  <option value="" disabled selected>Select Record Type</option>
                  <option value="Document Control Procedure">Document Control Procedure</option>
                  <option value="Corrective and Preventive Action (CAPA) Procedure">Corrective and Preventive Action
                    (CAPA) Procedure</option>
                  <option value="Internal Audit Procedure">Internal Audit Procedure</option>
                  <option value="Management Review Procedure">Management Review Procedure</option>
                  <option value="Risk Management Review Procedure">Risk Management Review Procedure</option>
                </select>
              </div>
              <div class="form-group">
                <label for="departmentalProcedure" class="form-label">Record Name:</label>
                <input type="text" id="departmentalProcedure" class="form-control smaller-input" v-model="recordName"
                  placeholder="Enter record name">
              </div>
              <div class="form-group">
                <label for="documentName" class="form-label">Document Name:</label>
                <input type="text" id="documentName" class="form-control smaller-input" v-model="documentName"
                  placeholder="Enter document name">
              </div>
              <div class="form-group">
                <label for="file" class="form-label">Choose File:</label>
                <input class="form-control form-control-lg me-3" id="formFileLg" type="file" @change="fileSelected">
              </div>
              <div class="d-flex align-items-center">
                <button type="submit" class="btn btn-primary btn-lg">Upload</button>
              </div>
            </form>
          </div>
          <div id="cusTable" class="table-wrapper mt-3">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th id="documentType" scope="col">Record Type</th>
                  <th id="documentName" scope="col">Document Name</th>
                  <th id="filePath" scope="col">File Path</th>
                  <th id="actions" scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(record, index) in records" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ record.record_type }}</td>
                  <td>{{ record.document_name }}</td>
                  <td>{{ record.file_path }}</td>
                  <td><button id="btnView" type="button" class="btn btn-secondary smaller-button"
                      @click="openPdf(record.id)">View</button></td>
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
      recordName: '',
      documentName: '',
      selectedFile: null,
      records: [],
      file: null
    };
  },
  computed: {
    ...mapGetters('auth', {
      token: GET_USER_TOKEN,
    }),
  },
  methods: {
    openPdf(recId) {
      axios.get(`retrieve-records/${recId}`, {
        headers: {
          Authorization: 'Bearer ' + this.token,
        },
      })
        .then(response => {
          console.log(response)
          const fileContent = response.data.record.file_path;
          this.$refs.pdfViewer.src = fileContent;
        })
        .catch(error => {
          console.error('Error fetching file content:', error);
          alert('Error fetching file content');
        });
    },
    submitForm() {
      if (!this.recordType || !this.recordName || !this.documentName || !this.selectedFile) {
        alert('Please fill out all fields and select a file.');
        return;
      }

      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('record_type', this.recordType);
      formData.append('record_name', this.recordName);
      formData.append('document_name', this.documentName);

      axios.post('upload-record', formData, {
        headers: {
          Authorization: 'Bearer ' + this.token,
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => {
          if (response.status === 200) {
            alert('File uploaded successfully.');
            this.resetForm();
            this.fetchRecords();
          } else {
            alert('Error uploading file.');
          }
        })
        .catch(error => {
          console.error('Error uploading file:', error);
          alert('Error uploading file.');
        });
    },
    fetchRecords() {
      axios.get('retrieve-record', {
        headers: {
          Authorization: 'Bearer ' + this.token,
        },
      })
        .then(response => {
          //console.log(response.data); 
          this.records = response.data; 
        })
        .catch(error => {
          console.error('Error fetching records:', error);
          alert('Error fetching records.');
        });
    },
    fileSelected(event) {
      const files = event.target.files;
      if (files.length > 0) {
        this.selectedFile = files[0];
      }
    },
    resetForm() {
      this.recordType = '';
      this.recordName = '';
      this.documentName = '';
      this.selectedFile = null;
    },
  },
  mounted() {
    this.fetchRecords();
  },
};
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
