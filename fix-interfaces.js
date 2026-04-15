/* eslint-disable @typescript-eslint/no-require-imports */
const os = require('os');

// Android 11+ / proot blocks uv_interface_addresses (Error 13)
// We shim it to return a fake loopback interface so Node.js doesn't crash.
os.networkInterfaces = () => ({
  lo: [{
    address: '127.0.0.1',
    netmask: '255.0.0.0',
    family: 'IPv4',
    internal: true,
    mac: '00:00:00:00:00:00',
    scopeid: 0,
    cidr: '127.0.0.1/8'
  }]
});
