<template>
  <ion-content>
    <div class="content-wrapper">
      <div class="row">
        <div class="col-md-7">
          <div class="add-form">
            <form @submit.prevent="submitForm">
              <h1 class="form-title">Add Work Instruction</h1>
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
                <input type="text" id="documentName" class="form-control smaller-input" v-model="document_name" placeholder="Enter document name">
              </div>
              <div class="form-group">
                <label for="employee" class="form-label">Employee:</label>
                <input type="text" id="employee" class="form-control smaller-input" v-model="employee" placeholder="Enter employee name">
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
                  <th id="documentType" scope="col">Document Type</th>
                  <th id="documentName" scope="col">Document Name</th>
                  <th id="employee" scope="col">Employee</th>
                  <th id="filePath" scope="col">File Path</th>
                  <th id="actions" scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(instruction, index) in instructions" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ instruction.document_type }}</td>
                  <td>{{ instruction.document_name }}</td>
                  <td>{{ instruction.employee }}</td>
                  <td>{{ instruction.file_path }}</td>
                  <td><button id="btnView" type="button" class="btn btn-secondary" @click="openPdf(instruction.id)">View</button></td>
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

export default {
  name: 'AddWorkInstructionPage',
  data() {
    return {
      document_type: '',
      document_name: '',
      employee: '',
      instructions: [],
    };
  },
  methods: {
    openPdf(instrId) {
      axios.get(`http://127.0.0.1:8000/api/retrieve-instructions/${instrId}`)
        .then(response => {
          const fileContent = response.data.instruction.file_path;
          const pdfViewer = this.$refs.pdfViewer;

          pdfViewer.src = fileContent;
        })
        .catch(error => {
          console.error('Error fetching file content:', error);
        });
    },
    submitForm() {
      if (!this.document_type || !this.document_name || !this.employee || !this.$refs.file.files[0]) {
        alert('Please fill out all fields and select a file.');
        return;
      }

      let formData = new FormData();
      formData.append('file', this.$refs.file.files[0]);
      formData.append('document_type', this.document_type);
      formData.append('document_name', this.document_name);
      formData.append('employee', this.employee);

      axios.post('http://127.0.0.1:8000/api/upload-instruction', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => {
          if (response.status === 200) {
            alert('File uploaded successfully.');
            this.document_type = '';
            this.document_name = '';
            this.employee = '';
            this.$refs.file.value = null;
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
      axios.get('http://127.0.0.1:8000/api/retrieve-instructions')
        .then(response => {
          this.instructions = response.data;
        })
        .catch(error => {
          console.error('Error fetching instructions:', error);
        });
    },
    fileSelected(event) {
      const files = event.target.files;
      if (files.length > 0) {
        this.form.file = files[0];
      }
    },
  },
  mounted() {
    this.fetchInstructions();
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
