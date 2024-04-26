<template>
  <div class="container">
    <div class="chart-container">
      <div v-for="(item, index) in chartData" :key="index" class="chart">
        <h3>{{ item.title }}</h3>
        <canvas :ref="item.ref" width="150" height="100"></canvas>
      </div>
    </div>
    <div class="table-container">
      <h3>Chart Table</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Chart</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in chartTotals" :key="index">
            <td>{{ item.chart }}</td>
            <td>{{ item.total }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  data() {
    return {
      chartData: [
        { title: 'Form Viewing Count', ref: 'formViewCountChart', dataset: 'formViewCountsData' },
        { title: 'Downloading Count', ref: 'downloadingCountChart', dataset: 'downloadingCountsData' },
        { title: 'Monthly Trends', ref: 'monthlyTrendsChart', dataset: 'monthlyTrendsData' }
      ],
      formViewCountsData: [100, 200, 300, 400, 500],
      downloadingCountsData: [50, 150, 250, 350, 450],
      monthlyTrendsData: [
        { month: 'January', formViews: 120, downloads: 50 },
        { month: 'February', formViews: 180, downloads: 80 },
        { month: 'March', formViews: 250, downloads: 120 },
        { month: 'April', formViews: 320, downloads: 200 },
        { month: 'May', formViews: 400, downloads: 250 },
      ],
    };
  },
  computed: {
    chartTotals() {
      return this.chartData.map(item => {
        const total = this[item.dataset].reduce((acc, val) => acc + val, 0);
        return { chart: item.title, total };
      });
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.renderCharts();
    });
  },
  methods: {
    renderCharts() {
      this.chartData.forEach(chart => {
        const canvasRef = this.$refs[chart.ref];
        if (canvasRef && canvasRef[0]) {
          const ctx = canvasRef[0].getContext('2d');
          if (chart.title === 'Form Viewing Count') {
            this.renderFormViewCountChart(ctx);
          } else if (chart.title === 'Downloading Count') {
            this.renderDownloadingCountChart(ctx);
          } else if (chart.title === 'Monthly Trends') {
            this.renderMonthlyTrendsChart(ctx);
          }
        }
      });
    },
    renderFormViewCountChart(ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May'],
          datasets: [{
            label: 'Form View Count',
            data: this.formViewCountsData,
            backgroundColor: 'rgba(75, 192, 192, 0.8)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }]
        },
        options: {
          scales: { y: { beginAtZero: true } }
        }
      });
    },
    renderDownloadingCountChart(ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May'],
          datasets: [{
            label: 'Downloading Count',
            data: this.downloadingCountsData,
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          }]
        },
        options: {
          scales: { y: { beginAtZero: true } }
        }
      });
    },
    renderMonthlyTrendsChart(ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.monthlyTrendsData.map(data => data.month),
          datasets: [
            { label: 'Form Views', backgroundColor: 'rgba(75, 192, 192, 0.8)', borderColor: 'rgba(75, 192, 192, 1)', data: this.monthlyTrendsData.map(data => data.formViews) },
            { label: 'Downloads', backgroundColor: 'rgba(255, 99, 132, 0.8)', borderColor: 'rgba(255, 99, 132, 1)', data: this.monthlyTrendsData.map(data => data.downloads) }
          ]
        },
        options: { scales: { y: { beginAtZero: true } } }
      });
    },
  }
}
</script>

<style scoped>
.container { max-width: 800px; margin: 60px auto 20px; }
.chart-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; }
.chart { padding: 20px; border-radius: 8px; background-color: #f9f9f9; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
.chart h3 { font-size: 16px; color: #007bff; font-weight: bold; margin: 0 0 10px; }
.table-container { margin-top: 50px; }
.table { width: 100%; border-collapse: collapse; background-color: #fff; }
.table th, .table td { padding: 8px; border-bottom: 1px solid #ddd; text-align: left; }
.table th { background-color: #f5f5f5; }
.table tr:hover { background-color: #f2f2f2; }
</style>
