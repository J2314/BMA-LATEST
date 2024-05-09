<template>
  <ion-content>
    <div class="tab">
      <button :class="{ 'tablinks': true, 'active': selectedPolicy === 'Document Control Procedure' }" @click="openPdf('document_control')">Document Control Procedure</button>
      <button :class="{ 'tablinks': true, 'active': selectedPolicy === 'Corrective and Preventive Action (CAPA) Procedure' }" @click="openPdf('capa')">Corrective and Preventive Action (CAPA) Procedure</button>
      <button :class="{ 'tablinks': true, 'active': selectedPolicy === 'Internal Audit Procedure' }" @click="openPdf('audit')">Internal Audit Procedure</button>
      <button :class="{ 'tablinks': true, 'active': selectedPolicy === 'Management Review Procedure' }" @click="openPdf('management_review')">Management Review Procedure</button>
      <button :class="{ 'tablinks': true, 'active': selectedPolicy === 'Risk Management Review Procedure' }" @click="openPdf('risk_management')">Risk Management Review Procedure</button>
    </div>
    <div class="pdf-title">{{ selectedPolicy }}</div>
    <div class="pdf-viewer-container">
      <iframe id="pdfViewer" class="pdf-viewer" ref="pdfViewer"></iframe>
    </div>
  </ion-content>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PdfViewerPage',
  data() {
    return {
      selectedPolicy: ''
    };
  },
  methods: {
    openPdf(policyType) {
      let policyId;
      switch (policyType) {
        case 'document_control':
          policyId = 1; 
          this.selectedPolicy = 'Document Control Procedure';
          break;
        case 'capa':
          policyId = 2;
          this.selectedPolicy = 'Corrective and Preventive Action (CAPA) Procedure';
          break;
        case 'audit':
          policyId = 3;
          this.selectedPolicy = 'Internal Audit Procedure';
          break;
        case 'management_review':
          policyId = 4;
          this.selectedPolicy = 'Management Review Procedure';
          break;
        case 'risk_management':
          policyId = 5;
          this.selectedPolicy = 'Risk Management Review Procedure';
          break;
        default:
          return;
      }
      
      axios.get(`retrieve-policies/${policyId}`)
        .then(response => {
          const fileContent = response.data.procedures.file_path;
          const pdfViewer = this.$refs.pdfViewer;

          pdfViewer.src = fileContent;
        })
        .catch(error => {
          console.error('Error fetching file content:', error);
        });
    },
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
