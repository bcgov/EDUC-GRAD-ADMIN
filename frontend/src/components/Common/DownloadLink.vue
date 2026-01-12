<template>
  <a
      :class="{ 'disabled-link': loading || disabled }"
      :aria-disabled="disabled || loading"
      :tabindex="disabled || loading ? -1 : 0"
      @click="handleClick"
  >
    <template v-if="loading">
      <v-progress-circular
          size="20"
          indeterminate
          color="primary"
          class="mr-1"
      />
    </template>
    <template v-else>
      <v-icon
          :icon="icon"
          class="mr-1"
      />
    </template>
    {{ label }}
  </a>
</template>

<script>
export default {
  name: 'DownloadLink',
  props: {
    label: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: 'mdi-download'
    },
    downloadAction: {
      type: Function,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    handleBlobDownload: {
      type: Boolean,
      default: true
    },
    defaultFilename: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      loading: false
    };
  },
  methods: {
    async handleClick() {
      if (this.loading) return;
      this.loading = true;
      try {
        const result = await this.downloadAction();

        if (this.handleBlobDownload && result && result.data) {
          this.processBlobDownload(result);
        }

        this.$emit('success');
      } catch (error) {
        console.error('Download error:', error);
        this.$emit('error', error);
      } finally {
        this.loading = false;
      }
    },

    processBlobDownload(response) {
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Extract filename from Content-Disposition header or use default
      let filename = this.defaultFilename;
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }

      // Fallback filename if none provided
      if (!filename) {
        const timestamp = new Date().toISOString().split('T')[0];
        filename = `download-${timestamp}`;
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }
  }
};
</script>

<style scoped>
a {
  text-decoration: none !important;
  color: #1976d2;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}

a:hover {
  text-decoration: none !important;
  color: #1565c0;
}

.disabled-link {
  pointer-events: none;
  color: grey;
  cursor: default;
}
</style>
