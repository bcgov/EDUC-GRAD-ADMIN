const HttpStatus = require('http-status-codes');

const csvHelpers = {
  // Format date as YYYY-MM-DD
  formatDate: (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (e) {
      return '';
    }
  },

  // Format expiry date as YYYY-MM-DD, but return blank if date is 2099-12-31
  formatExpiryDateOrBlankIfFarFuture: (dateString) => {
    if (!dateString) return '';
    const formatted = csvHelpers.formatDate(dateString);
    if (formatted === '2099-12-31') return '';
    return formatted;
  },

  // Escape CSV values
  escapeCSV: (value) => {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  },

  // Generate CSV content from headers and rows
  generateCSV: (headers, rows) => {
    const csvRows = [
      headers.join(','),
      ...rows
    ];
    return csvRows.join('\n');
  },

  // Send CSV response with proper headers
  sendCSVResponse: (res, csvContent, filename) => {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(HttpStatus.OK).send(csvContent);
  }
};

module.exports = csvHelpers;

