<template>
  <ion-content>
    <div class="tab">
      <button :class="{ 'tablinks': true, 'active': selectedProcedure === 'Document Control Procedure' }" @click="openPdf('Document Control Procedure')">Document Control Procedure</button>
      <button :class="{ 'tablinks': true, 'active': selectedProcedure === 'Corrective and Preventive Action (CAPA) Procedure' }" @click="openPdf('Corrective and Preventive Action (CAPA) Procedure')">Corrective and Preventive Action (CAPA) Procedure</button>
      <button :class="{ 'tablinks': true, 'active': selectedProcedure === 'Internal Audit Procedure' }" @click="openPdf('Internal Audit Procedure')">Internal Audit Procedure</button>
      <button :class="{ 'tablinks': true, 'active': selectedProcedure === 'Management Review Procedure' }" @click="openPdf('Management Review Procedure')">Management Review Procedure</button>
      <button :class="{ 'tablinks': true, 'active': selectedProcedure === 'Risk Management Review Procedure' }" @click="openPdf('Risk Management Review Procedure')">Risk Management Review Procedure</button>
    </div>
    <div class="pdf-title">{{ selectedProcedure }}</div>
    <div class="pdf-viewer-container">
      <iframe id="pdfViewer" class="pdf-viewer" ref="pdfViewer"></iframe>
    </div>
  </ion-content>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import { GET_USER_TOKEN } from '@/store/storeConstants.js';

export default {
  name: 'PdfViewerPage',
  data() {
    return {
      selectedProcedure: ''
    };
  },
  computed: {
    ...mapGetters('auth', {
      token: GET_USER_TOKEN
    })
  },
  methods: {
    openPdf(selectedProcedure) {
      let procedureId;
      switch (selectedProcedure) {
        case 'Document Control Procedure':
          procedureId = 1;
          break;
        case 'Corrective and Preventive Action (CAPA) Procedure':
          procedureId = 2;
          break;
        case 'Internal Audit Procedure':
          procedureId = 3;
          break;
        case 'Management Review Procedure':
          procedureId = 4;
          break;
        case 'Risk Management Review Procedure':
          procedureId = 5;
          break;
        default:
          return;
      }

      axios.get(`retrieve-procedures/${procedureId}`, {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      })
      .then(response => {
        const fileContent = response.data.procedure.file_path; 
        const pdfViewer = this.$refs.pdfViewer;
        pdfViewer.src = fileContent;
        this.selectedProcedure = selectedProcedure; 
      })
      .catch(error => {
        console.error('Error fetching file content:', error);
      });
    }
  }
};
</script>

<style scoped>
.tab {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.tablinks {
  background-color: transparent;
  color: #444;
  border: 1px solid #ccc;
  outline: none;
  cursor: pointer;
  padding: 10px 20px;
  transition: 0.3s;
  border-radius: 8px 8px 0 0;
  font-size: 16px;
}

.tablinks.active {
  background-color: #007bff;
  color: white;
  border-bottom-color: transparent;
  font-weight: bold;
  font-size: 18px;
}

.pdf-title {
  text-align: center;
  margin-top: 1%;
  font-size: 24px;
}

.pdf-viewer-container {
  margin-left: auto;
  margin-right: auto;
  width: 800px;
  height: 700px;
  border: 1px solid #ccc;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.pdf-viewer {
  width: 100%;
  height: 100%;
}
</style>
