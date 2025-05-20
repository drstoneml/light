const express = require('express');
const path = require('path');
const { SerialPort } = require('serialport');

const app = express();
const PORT = 5000;

// Change COM3 to your actual Arduino port (use Arduino IDE to check)
const arduino = new SerialPort({ path: 'COM3', baudRate: 9600 });

app.use(express.static(__dirname)); // Serve HTML

app.get('/control/:cmd', (req, res) => {
  const cmd = req.params.cmd;
  let char = null;

  if (cmd === 'on1') char = 'A';
  if (cmd === 'off1') char = 'B';
  if (cmd === 'on2') char = 'C';
  if (cmd === 'off2') char = 'D';

  if (char) {
    arduino.write(char, (err) => {
      if (err) return res.status(500).send('Failed to send command');
      console.log(`Sent ${char} to Arduino`);
      res.send('OK');
    });
  } else {
    res.status(400).send('Invalid Command');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
