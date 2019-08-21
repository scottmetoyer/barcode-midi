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

function notesOff(note1, note2) {
  output.sendMessage([144, note1, 0]);
  output.sendMessage([145, note2, 0]);
}

input.on('line', (input) =>{
  console.log('Received: ' + input);

  // Parse the input into midi channel, note, pressure
  // 144, 145 are channel 1 and 2 out respectively
  // Tweak the max out and in values to map the usable range of the parameters
  var byte1 = Math.round(scale(input.substr(1, 2), 0, 100, 40, 80));
  var byte2 = Math.round(scale(input.substr(3, 2), 0, 100, 40, 80));
  var byte3 = Math.round(scale(input.substr(5, 2), 0, 100, 0, 127));
  var byte4 = Math.round(scale(input.substr(7, 2), 0, 100, 0, 127));
  // var byte5 = Math.round(scale(input.substr(9, 2), 0, 100, 0, 127));

  // Send the MIDI data
  console.log('Parsed MIDI values: ' + byte1 + ' ' + byte2 + ' ' + byte3 + ' ' + byte4);

  output.sendMessage([144, byte1, byte3])
  output.sendMessage([145, byte2, byte4])

  // Turn the note off after half a second.
  setTimeout(notesOff, 250, byte1, byte2);
});

// output.sendMessage([176,22,1]);
// output.closePort();

const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}