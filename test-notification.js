// Test script to call notification API directly
const testData = {
  type: 'appointment_created',
  data: {
    patientId: '26173c9e-aa23-440c-952f-ca9eb5602386',
    doctorId: '893d92ea-c379-4bce-b6b7-51717bcc1082',
    appointmentDate: 'January 30, 2026',
    appointmentTime: '10:00 AM',
    mode: 'online',
    chiefComplaint: 'Test complaint',
    meetingLink: 'https://test.com',
    tokenNumber: 1
  }
};

fetch('http://localhost:3000/api/notifications/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testData)
})
  .then(async (res) => {
    console.log('Status:', res.status);
    console.log('Status Text:', res.statusText);
    const text = await res.text();
    console.log('Response:', text);
    try {
      const json = JSON.parse(text);
      console.log('JSON:', json);
    } catch (e) {
      console.log('Not JSON, HTML response');
    }
  })
  .catch(err => console.error('Error:', err));
