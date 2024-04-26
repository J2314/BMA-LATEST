<template>
  <div class="activity-log">
    <h3>Activity Log</h3>
    <table class="log-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>User</th>
          <th>Activity</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(log, index) in activityLog" :key="index">
          <td>{{ log.date }}</td>
          <td>{{ log.user }}</td>
          <td>{{ log.activity }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'MonitoringPage',
  data() {
    return {
      activityLog: [
        { date: new Date(), user: 'John Doe', activity: 'Logged in' },
        { date: new Date(), user: 'Jane Smith', activity: 'Viewed dashboard' },
        { date: new Date(), user: 'Placeholder User', activity: 'Performed action' }
      ]
    };
  }
};
</script>

<style scoped>
.activity-log {
  max-width: 1400px;
  margin-top: 4%;
  margin-left: 5%;
}

.log-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.log-table th, .log-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
  text-align: left;
}

.log-table th {
  background-color: #f5f5f5;
  font-weight: bold;
  color: #333;
}

.log-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.log-table tr:hover {
  background-color: #f0f0f0;
}
</style>
