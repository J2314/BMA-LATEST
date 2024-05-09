<template>
  <ion-content>
    <!-- Tabs for selecting policies -->
    <div class="tab">
      <button :class="{ 'tablinks': true, 'active': selectedPolicy === 'Quality Policy' }" @click="openPdf('quality')">Quality Policy</button>
      <button :class="{ 'tablinks': true, 'active': selectedPolicy === 'Environmental Policy' }" @click="openPdf('environmental')">Environmental Policy</button>
      <button :class="{ 'tablinks': true, 'active': selectedPolicy === 'Health and Safety Policy' }" @click="openPdf('health')">Health and Safety Policy</button>
    </div>

    <!-- Selected policy title -->
    <div class="pdf-title">{{ selectedPolicy }}</div>

    <!-- PDF viewer container -->
    <div class="pdf-viewer-container">
      <iframe id="pdfViewer" class="pdf-viewer" ref="pdfViewer"></iframe>
    </div>

    <!-- Search bar and Department filter -->
    <div class="search-department-container">
      <!-- Search bar -->
      <div class="search-bar">
        <input type="text" class="form-control" v-model="searchKeyword" placeholder="Search documents...">
      </div>
      <!-- Department filter -->
      <div class="department-filter">
        <select id="departmentFilter" class="form-control" v-model="selectedDepartment">
          <option value="">All Departments</option>
          <option v-for="(department, index) in departments" :key="index" :value="department.id">{{ department.name }}</option>
        </select>
      </div>
    </div>

    <!-- Policies table -->
    <table class="table table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th id="documentType" scope="col">Document Type</th>
          <th id="documentName" scope="col">Document Name</th>
          <th id="department" scope="col">Department</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(policy, index) in filteredPolicies" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ policy.document_type }}</td>
          <td>{{ policy.document_name }}</td>
          <td>{{ getDepartmentName(policy.department_id) }}</td>
        </tr>
      </tbody>
    </table>
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
      policies: [],
      departments: [], // Initialize departments array
      selectedPolicy: '',
      searchKeyword: '',
      selectedDepartment: ''
    };
  },
  computed: {
    ...mapGetters('auth', {
      token: GET_USER_TOKEN
    }),
    filteredPolicies() {
      let filtered = this.policies;
      if (this.searchKeyword.trim() !== '') {
        filtered = filtered.filter(policy =>
          policy.document_name.toLowerCase().includes(this.searchKeyword.trim().toLowerCase())
        );
      }
      if (this.selectedDepartment !== '') {
        filtered = filtered.filter(policy => policy.department_id === this.selectedDepartment);
      }
      return filtered;
    }
  },
  methods: {
    openPdf(policyType) {
      let policyId;
      switch (policyType) {
        case 'quality':
          policyId = 1; 
          this.selectedPolicy = 'Quality Policy';
          break;
        case 'environmental':
          policyId = 2;
          this.selectedPolicy = 'Environmental Policy';
          break;
        case 'health':
          policyId = 3;
          this.selectedPolicy = 'Health and Safety Policy';
          break;
        default:
          return;
      }
      
      axios.get(`retrieve-policies/${policyId}`, {
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
          console.error('Error fetching file content:', error);
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
          console.error('Error fetching policies:', error);
        });
    },
    fetchDepartments() {
      axios.get('retrieve', { // Assuming this is the correct endpoint
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
    this.fetchPolicies();
    this.fetchDepartments(); // Fetch departments when the component is mounted
    // Optionally, you can load an initial PDF on page load
    // For example: this.openPdf('quality');
  }
}
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

.table {
  margin: 30px;
}

.search-department-container {
  max-width: auto;
  margin: 20px;
  display: flex;
  justify-content: space-between;
}

.search-bar {
  flex: 0.6;
  margin-right: 10px;
}

.department-filter {
  flex: 0.4;
}

</style>
