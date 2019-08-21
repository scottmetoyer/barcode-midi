const midi = require('midi');
const readline = require('readline');

const output = new midi.Output();

var portCount = output.getPortCount();

console.log("Available MIDI devices:");
for (var i = 0; i < portCount; i++) {
  console.log(i + ': ' + output.getPortName(i));
}

var deviceNumber = 1;
output.openPort(deviceNumber);

console.log('Port opened. Waiting for input.');

const input = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

input.on('line', (input) =>{
  console.log('Received: ' + input);
});

// output.sendMessage([176,22,1]);
// output.closePort();
